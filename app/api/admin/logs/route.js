import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseServer";
import { requireAdmin } from "../../../lib/adminServer";

export async function GET(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });

  const now = new Date().toISOString();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [profilesRes, usageRes, unlimitedRes, publishedRes] = await Promise.all([
    supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("usage_log").select("count,window_start").gte("window_start", since),
    supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }).gt("unlimited_until", now),
    supabaseAdmin.from("books").select("id", { count: "exact", head: true }).eq("status", "published"),
  ]);

  const generationCount = (usageRes.data || []).reduce((sum, row) => sum + (row.count || 0), 0);

  const errors = [profilesRes.error, usageRes.error, unlimitedRes.error, publishedRes.error].filter(Boolean);
  if (errors.length) return NextResponse.json({ error: errors[0].message }, { status: 500 });

  return NextResponse.json({
    stats: {
      users: profilesRes.count ?? 0,
      generations: generationCount,
      unlimited: unlimitedRes.count ?? 0,
      published: publishedRes.count ?? 0,
    },
    logs: [],
  });
}
