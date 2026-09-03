import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseServer";
import { requireAdmin } from "../../../../lib/adminServer";

export async function POST(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });

  const body = await req.json();
  const payload = {
    title: body.title?.trim(),
    category: body.category?.trim(),
    wing: body.wing,
    description: body.description?.trim(),
    is_free: body.is_free !== false,
    amazon_query: body.is_free === false ? body.amazon_query?.trim() || null : null,
    content: body.is_free === false ? null : body.content || "",
    status: body.status === "published" ? "published" : "draft",
  };

  if (!payload.title || !payload.category || !payload.description || !["educational", "web3"].includes(payload.wing)) {
    return NextResponse.json({ error: "Missing or invalid book fields" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from("books").insert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ book: data });
}
