import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseServer";
import { requireAdmin } from "../../../../lib/adminServer";

export const maxDuration = 60;

const BUCKET = "textbooks";
const MAX_BYTES = 49 * 1024 * 1024;
const CHUNK_BYTES = 40 * 1024 * 1024;
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

async function uploadObject(path, bytes, contentType) {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, bytes, {
      contentType,
      cacheControl: "86400",
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error("Could not create hosted file URL");
  return data.publicUrl;
}

function splitBinary(fileBuffer) {
  const bytes = new Uint8Array(fileBuffer);
  const parts = [];

  for (let offset = 0, index = 0; offset < bytes.byteLength; offset += CHUNK_BYTES, index += 1) {
    const end = Math.min(offset + CHUNK_BYTES, bytes.byteLength);
    const chunk = bytes.slice(offset, end);
    if (chunk.byteLength > MAX_BYTES) throw new Error("Generated chunk exceeds storage limit.");
    parts.push({ index, startByte: offset, endByte: end - 1, bytes: chunk });
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
      const hostedUrl = await uploadObject(path, fileBuffer, "application/pdf");

      const { data: updated, error: updateError } = await supabaseAdmin
        .from("books")
        .update({ hosted_file_url: hostedUrl, storage_path: path, hosted_parts: null })
        .eq("id", book.id)
        .select("*")
        .single();

      if (updateError) throw new Error(updateError.message);
      return NextResponse.json({ ok: true, mode: "single", book: updated, bytes: fileBuffer.byteLength });
    }

    const binaryParts = splitBinary(fileBuffer);
    const hostedParts = [];

    for (let i = 0; i < binaryParts.length; i += 1) {
      const part = binaryParts[i];
      const partNumber = i + 1;
      const path = `${base}-chunk-${String(partNumber).padStart(2, "0")}.bin`;
      const url = await uploadObject(path, part.bytes, "application/octet-stream");
      hostedParts.push({
        part: partNumber,
        label: `Chunk ${partNumber}`,
        kind: "binary_chunk",
        start_byte: part.startByte,
        end_byte: part.endByte,
        bytes: part.bytes.byteLength,
        total_bytes: fileBuffer.byteLength,
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
      mode: "binary_chunks",
      book: updated,
      bytes: fileBuffer.byteLength,
      parts: hostedParts.length,
    });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Could not mirror this PDF" }, { status: 500 });
  }
}
