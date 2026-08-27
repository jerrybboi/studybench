import { NextResponse } from "next/server";
import { getUserFromRequest, supabaseAdmin } from "../../lib/supabaseServer";

const FREE_LIMIT = 25;
const WINDOW_MS = 24 * 60 * 60 * 1000;

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("unlimited_until")
    .eq("id", user.id)
    .maybeSingle();

  const unlimited = !!profile?.unlimited_until && new Date(profile.unlimited_until) > new Date();

  const { data: usage } = await supabaseAdmin
    .from("usage_log")
    .select("count, window_start")
    .eq("user_id", user.id)
    .maybeSingle();

  let used = 0;
  if (usage) {
    const withinWindow = Date.now() - new Date(usage.window_start).getTime() < WINDOW_MS;
    used = withinWindow ? usage.count : 0;
  }

  return NextResponse.json({
    email: user.email,
    unlimited,
    used,
    limit: FREE_LIMIT,
  });
}
