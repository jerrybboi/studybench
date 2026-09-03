import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseServer";
import { requireAdmin } from "../../../../lib/adminServer";

export const maxDuration = 60;

const BUCKET = "textbooks";
const MAX_BYTES = 49 * 1024 * 1024;
const ALLOWED_HOSTS = new Set([
  "assets.openstax.org",
  "d3bxy9euw4e147.cloudfront.net",
  "www.math.ucdavis.edu",
  "math.ucdavis.edu",
]);

function safeName(title) {
  return String(title || "textbook")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "textbook";
}

export async function POST(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body?.id) return NextResponse.json({ error: "Book id is required" }, { status: 400 });

  const { data: book, error: bookError } = await supabaseAdmin
    .from("books")
    .select("id,title,wing,is_free,source_file_url,hosted_file_url,storage_path")
    .eq("id", body.id)
    .maybeSingle();

  if (bookError) return NextResponse.json({ error: bookError.message }, { status: 500 });
  if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });
  if (book.wing !== "educational" || book.is_free !== true) {
    return NextResponse.json({ error: "Only free Educational titles can be mirrored" }, { status: 400 });
  }
  if (!book.source_file_url) {
    return NextResponse.json({ error: "This title does not have a source PDF URL yet" }, { status: 400 });
  }

  let sourceUrl;
  try {
    sourceUrl = new URL(book.source_file_url);
  } catch {
    return NextResponse.json({ error: "Invalid source PDF URL" }, { status: 400 });
  }

  if (sourceUrl.protocol !== "https:" || !ALLOWED_HOSTS.has(sourceUrl.hostname)) {
    return NextResponse.json({ error: "Source host is not approved for mirroring" }, { status: 400 });
  }

  const sourceRes = await fetch(sourceUrl, {
    redirect: "follow",
    headers: { "User-Agent": "StudyBench textbook mirror" },
    cache: "no-store",
  });

  if (!sourceRes.ok) {
    return NextResponse.json({ error: `Source download failed (${sourceRes.status})` }, { status: 502 });
  }

  const contentType = (sourceRes.headers.get("content-type") || "").toLowerCase();
  if (!contentType.includes("pdf") && !sourceUrl.pathname.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Source did not return a PDF" }, { status: 415 });
  }

  const lengthHeader = Number(sourceRes.headers.get("content-length") || 0);
  if (lengthHeader && lengthHeader > MAX_BYTES) {
    return NextResponse.json({ error: "This PDF is larger than the current 49 MB mirror limit. Use a lower-resolution edition." }, { status: 413 });
  }

  const fileBuffer = await sourceRes.arrayBuffer();
  if (fileBuffer.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "This PDF is larger than the current 49 MB mirror limit. Use a lower-resolution edition." }, { status: 413 });
  }

  const path = `educational/${safeName(book.title)}-${book.id}.pdf`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, fileBuffer, {
      contentType: "application/pdf",
      cacheControl: "86400",
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  const hostedUrl = publicData?.publicUrl;
  if (!hostedUrl) return NextResponse.json({ error: "Could not create hosted PDF URL" }, { status: 500 });

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("books")
    .update({ hosted_file_url: hostedUrl, storage_path: path })
    .eq("id", book.id)
    .select("*")
    .single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    book: updated,
    bytes: fileBuffer.byteLength,
  });
}
