import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { supabaseAdmin } from "../../../../lib/supabaseServer";
import { requireAdmin } from "../../../../lib/adminServer";

export const maxDuration = 60;

const BUCKET = "textbooks";
const MAX_BYTES = 49 * 1024 * 1024;
const TARGET_PART_BYTES = 42 * 1024 * 1024;
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

async function uploadPdf(path, bytes) {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, bytes, {
      contentType: "application/pdf",
      cacheControl: "86400",
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error("Could not create hosted PDF URL");
  return data.publicUrl;
}

async function buildPdfPart(sourcePdf, pageIndexes) {
  const part = await PDFDocument.create();
  const copied = await part.copyPages(sourcePdf, pageIndexes);
  copied.forEach((page) => part.addPage(page));
  return part.save({ useObjectStreams: true });
}

async function splitIntoParts(fileBuffer) {
  const sourcePdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const totalPages = sourcePdf.getPageCount();
  const parts = [];
  let start = 0;

  while (start < totalPages) {
    let low = start + 1;
    let high = totalPages;
    let bestEnd = start;
    let bestBytes = null;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const indexes = Array.from({ length: mid - start }, (_, i) => start + i);
      const bytes = await buildPdfPart(sourcePdf, indexes);

      if (bytes.byteLength <= TARGET_PART_BYTES) {
        bestEnd = mid;
        bestBytes = bytes;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    if (!bestBytes || bestEnd === start) {
      const single = await buildPdfPart(sourcePdf, [start]);
      if (single.byteLength > MAX_BYTES) {
        throw new Error(`Page ${start + 1} alone exceeds the storage file limit.`);
      }
      bestEnd = start + 1;
      bestBytes = single;
    }

    parts.push({
      startPage: start + 1,
      endPage: bestEnd,
      bytes: bestBytes,
    });
    start = bestEnd;
  }

  return parts;
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
    .select("id,title,wing,is_free,source_file_url,hosted_file_url,storage_path,hosted_parts")
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

  const fileBuffer = await sourceRes.arrayBuffer();
  const base = `educational/${safeName(book.title)}-${book.id}`;

  try {
    if (fileBuffer.byteLength <= MAX_BYTES) {
      const path = `${base}.pdf`;
      const hostedUrl = await uploadPdf(path, fileBuffer);

      const { data: updated, error: updateError } = await supabaseAdmin
        .from("books")
        .update({ hosted_file_url: hostedUrl, storage_path: path, hosted_parts: null })
        .eq("id", book.id)
        .select("*")
        .single();

      if (updateError) throw new Error(updateError.message);

      return NextResponse.json({ ok: true, mode: "single", book: updated, bytes: fileBuffer.byteLength });
    }

    const splitParts = await splitIntoParts(fileBuffer);
    const hostedParts = [];

    for (let i = 0; i < splitParts.length; i += 1) {
      const part = splitParts[i];
      const partNumber = i + 1;
      const path = `${base}-part-${String(partNumber).padStart(2, "0")}.pdf`;
      const url = await uploadPdf(path, part.bytes);
      hostedParts.push({
        part: partNumber,
        label: `Part ${partNumber}`,
        start_page: part.startPage,
        end_page: part.endPage,
        bytes: part.bytes.byteLength,
        path,
        url,
      });
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("books")
      .update({ hosted_file_url: null, storage_path: null, hosted_parts: hostedParts })
      .eq("id", book.id)
      .select("*")
      .single();

    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({
      ok: true,
      mode: "parts",
      book: updated,
      bytes: fileBuffer.byteLength,
      parts: hostedParts.length,
    });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Could not mirror this PDF" }, { status: 500 });
  }
}
