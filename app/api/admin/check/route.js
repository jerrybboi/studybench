import { NextResponse } from "next/server";
import { getUserFromRequest, supabaseAdmin } from "../../../lib/supabaseServer";

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }

  if (data?.is_admin !== true) {
    return NextResponse.json({ isAdmin: false }, { status: 403 });
  }

  return NextResponse.json({ isAdmin: true });
}
