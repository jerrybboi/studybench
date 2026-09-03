import { supabaseAdmin, getUserFromRequest } from "./supabaseServer";

export async function requireAdmin(req) {
  const user = await getUserFromRequest(req);
  if (!user) return { ok: false, status: 401, user: null };

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return { ok: false, status: 500, user };
  if (data?.is_admin !== true) return { ok: false, status: 403, user };

  return { ok: true, status: 200, user };
}
