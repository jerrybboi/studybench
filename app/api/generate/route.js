import { NextResponse } from "next/server";
import { getUserFromRequest, supabaseAdmin } from "../../lib/supabaseServer";

const FREE_LIMIT = 25;
const WINDOW_MS = 24 * 60 * 60 * 1000;

export async function POST(req) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY. Add it in Vercel Environment Variables." },
      { status: 500 }
    );
  }

  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("unlimited_until")
    .eq("id", user.id)
    .maybeSingle();

  const isUnlimited = !!profile?.unlimited_until && new Date(profile.unlimited_until) > new Date();

  if (!isUnlimited) {
    const { data: usage } = await supabaseAdmin
      .from("usage_log")
      .select("count, window_start")
      .eq("user_id", user.id)
      .maybeSingle();

    const now = Date.now();
    let count = 0;
    let windowStart = now;

    if (usage) {
      const withinWindow = now - new Date(usage.window_start).getTime() < WINDOW_MS;
      if (withinWindow) {
        count = usage.count;
        windowStart = new Date(usage.window_start).getTime();
      }
    }

    if (count >= FREE_LIMIT) {
      const hoursRemaining = Math.max(1, Math.ceil((WINDOW_MS - (now - windowStart)) / (60 * 60 * 1000)));
      return NextResponse.json(
        { error: "Free limit reached.", limited: true, hoursRemaining },
        { status: 429 }
      );
    }

    await supabaseAdmin
      .from("usage_log")
      .upsert({ user_id: user.id, count: count + 1, window_start: new Date(windowStart).toISOString() });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { prompt } = body || {};
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Missing 'prompt' string in request body." }, { status: 400 });
  }

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return NextResponse.json(
        { error: `Anthropic API error (${anthropicRes.status}): ${errText}` },
        { status: 502 }
      );
    }

    const data = await anthropicRes.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return NextResponse.json({ text });
  } catch (err) {
    return NextResponse.json({ error: "Failed to reach Anthropic API: " + err.message }, { status: 502 });
  }
}
