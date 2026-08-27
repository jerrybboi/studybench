import { NextResponse } from "next/server";
import { verifyTurnstile } from "../../lib/turnstile";

export async function POST(req) {
  const { token } = await req.json();
  const ok = await verifyTurnstile(token);
  if (!ok) {
    return NextResponse.json({ error: "CAPTCHA failed. Please try again." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
