import { NextResponse } from "next/server";
import { getUserFromRequest, supabaseAdmin } from "../../lib/supabaseServer";

const FREE_LIMIT = 25;
const WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_PROMPT_CHARS = 8000;

export async function POST(req) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI generation is temporarily unavailable." }, { status: 503 });
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

  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return NextResponse.json({ error: "Please enter a prompt." }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return NextResponse.json({ error: "That prompt is too long. Please shorten it and try again." }, { status: 413 });
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("unlimited_until")
    .eq("id", user.id)
    .maybeSingle();

  const isUnlimited = Boolean(profile?.unlimited_until) && new Date(profile.unlimited_until) > new Date();
  let nextUsage = null;

  if (!isUnlimited) {
    const { data: usage } = await supabaseAdmin
      .from("usage_log")
      .select("count,window_start")
      .eq("user_id", user.id)
      .maybeSingle();

    const now = Date.now();
    let count = 0;
    let windowStart = now;

    if (usage) {
      const parsedStart = new Date(usage.window_start).getTime();
      if (Number.isFinite(parsedStart) && now - parsedStart < WINDOW_MS) {
        count = usage.count || 0;
        windowStart = parsedStart;
      }
    }

    if (count >= FREE_LIMIT) {
      const hoursRemaining = Math.max(1, Math.ceil((WINDOW_MS - (now - windowStart)) / (60 * 60 * 1000)));
      return NextResponse.json(
        { error: "Free limit reached.", limited: true, hoursRemaining },
        { status: 429 }
      );
    }

    nextUsage = {
      user_id: user.id,
      count: count + 1,
      window_start: new Date(windowStart).toISOString(),
    };
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
      console.error("Anthropic API request failed", anthropicRes.status);
      return NextResponse.json({ error: "AI generation failed. Please try again later." }, { status: 502 });
    }

    const data = await anthropicRes.json();
    const text = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    if (!text) {
      return NextResponse.json({ error: "The AI returned an empty response. Please try again." }, { status: 502 });
    }

    if (nextUsage) {
      const { error: usageError } = await supabaseAdmin.from("usage_log").upsert(nextUsage);
      if (usageError) console.error("Could not record AI usage", usageError.message);
    }

    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "AI generation failed. Please try again later." }, { status: 502 });
  }
}
