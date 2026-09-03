import { NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/adminServer";

export async function GET(req) {
  const auth = await requireAdmin(req);

  if (!auth.ok) {
    return NextResponse.json(
      { isAdmin: false },
      { status: auth.status }
    );
  }

  return NextResponse.json({ isAdmin: true });
}
