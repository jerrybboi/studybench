import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseServer";
import { requireAdmin } from "../../../../lib/adminServer";

const ALLOWED = ["title", "category", "wing", "description", "is_free", "amazon_query", "content", "status"];

export async function POST(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "Book id is required" }, { status: 400 });

  const updates = {};
  for (const key of ALLOWED) {
    if (Object.prototype.hasOwnProperty.call(body, key)) updates[key] = body[key];
  }

  if (updates.wing && !["educational", "web3"].includes(updates.wing)) {
    return NextResponse.json({ error: "Invalid wing" }, { status: 400 });
  }
  if (updates.status && !["draft", "published"].includes(updates.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  if (updates.is_free === true) updates.amazon_query = null;
  if (updates.is_free === false) updates.content = null;

  const { data, error } = await supabaseAdmin
    .from("books")
    .update(updates)
    .eq("id", body.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ book: data });
}
