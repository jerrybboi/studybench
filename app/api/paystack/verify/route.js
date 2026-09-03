import { NextResponse } from "next/server";
import { getUserFromRequest, supabaseAdmin } from "../../../lib/supabaseServer";

const EXPECTED_AMOUNT_KOBO = 1000 * 100;
const EXPECTED_CURRENCY = "NGN";

export async function POST(req) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Payments are temporarily unavailable." }, { status: 503 });
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

  const reference = typeof body?.reference === "string" ? body.reference.trim() : "";
  if (!reference || reference.length > 160) {
    return NextResponse.json({ error: "Invalid payment reference." }, { status: 400 });
  }

  try {
    const { data: existing } = await supabaseAdmin
      .from("payment_log")
      .select("user_id,unlimited_until")
      .eq("reference", reference)
      .maybeSingle();

    if (existing) {
      if (existing.user_id !== user.id) {
        return NextResponse.json({ error: "This payment reference has already been used." }, { status: 409 });
      }
      return NextResponse.json({ ok: true, unlimitedUntil: existing.unlimited_until, alreadyProcessed: true });
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` }, cache: "no-store" }
    );
    const verifyData = await verifyRes.json();
    const payment = verifyData?.data;

    if (!verifyRes.ok || verifyData?.status !== true || payment?.status !== "success") {
      return NextResponse.json({ error: "Payment could not be verified." }, { status: 402 });
    }

    if (payment.reference !== reference) {
      return NextResponse.json({ error: "Payment reference mismatch." }, { status: 402 });
    }

    if (Number(payment.amount) !== EXPECTED_AMOUNT_KOBO || String(payment.currency || "").toUpperCase() !== EXPECTED_CURRENCY) {
      return NextResponse.json({ error: "Payment amount or currency does not match this unlock." }, { status: 402 });
    }

    const paidEmail = String(payment.customer?.email || "").trim().toLowerCase();
    const userEmail = String(user.email || "").trim().toLowerCase();
    if (!paidEmail || !userEmail || paidEmail !== userEmail) {
      return NextResponse.json({ error: "Payment account does not match the signed-in user." }, { status: 403 });
    }

    const paidAt = payment.paid_at || payment.paidAt || new Date().toISOString();
    const { data: unlimitedUntil, error: applyError } = await supabaseAdmin.rpc("apply_verified_payment", {
      p_user_id: user.id,
      p_reference: reference,
      p_amount_kobo: EXPECTED_AMOUNT_KOBO,
      p_currency: EXPECTED_CURRENCY,
      p_paid_at: paidAt,
    });

    if (applyError) {
      if (applyError.code === "23505") {
        const { data: processed } = await supabaseAdmin
          .from("payment_log")
          .select("user_id,unlimited_until")
          .eq("reference", reference)
          .maybeSingle();

        if (processed?.user_id === user.id) {
          return NextResponse.json({ ok: true, unlimitedUntil: processed.unlimited_until, alreadyProcessed: true });
        }
      }
      return NextResponse.json({ error: "Payment was verified but access could not be updated." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, unlimitedUntil });
  } catch {
    return NextResponse.json({ error: "Could not verify the payment right now." }, { status: 502 });
  }
}
