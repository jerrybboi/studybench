import { NextResponse } from "next/server";
import { getUserFromRequest, supabaseAdmin } from "../../../lib/supabaseServer";

export async function POST(req) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Server is missing PAYSTACK_SECRET_KEY. Add it in Vercel Environment Variables." },
      { status: 500 }
    );
  }

  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { reference } = body || {};
  if (!reference) {
    return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });
  }

  try {
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || !verifyData.status || verifyData.data?.status !== "success") {
      return NextResponse.json({ error: "Payment could not be verified." }, { status: 402 });
    }

    const unlimitedUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    await supabaseAdmin
      .from("profiles")
      .upsert({ id: user.id, unlimited_until: unlimitedUntil });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to verify with Paystack: " + err.message }, { status: 502 });
  }
}
