"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { supabase } from "./lib/supabaseClient";

const SUBJECTS = [
  { id: "math1", label: "Mathematics 1", hint: "limits, derivatives, integrals, linear algebra basics" },
  { id: "math2", label: "Mathematics 2", hint: "multivariable calc, ODEs, series, advanced linear algebra" },
  { id: "physics", label: "Physics", hint: "mechanics, thermodynamics, E&M — intro level" },
];

const MODES = [
  { id: "quiz", label: "Quiz Me" },
  { id: "cards", label: "Flashcards" },
  { id: "solver", label: "Solve With Me" },
];

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
const PRICE_NGN = 1000;

async function authHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function askServer(prompt, jsonMode = false) {
  const headers = { "Content-Type": "application/json", ...(await authHeader()) };
  const res = await fetch("/api/generate", {
    method: "POST",
    headers,
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || "Request failed");
    if (data.limited) {
      err.limited = true;
      err.hoursRemaining = data.hoursRemaining;
    }
    throw err;
  }
  const text = data.text || "";
  if (jsonMode) {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  }
  return text;
}

function ChalkButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-t-md font-medium text-sm transition-colors border-b-2 ${
        active
          ? "bg-[#F5F1E6] text-[#1E3A2F] border-[#D9A441]"
          : "text-[#EDE7D6]/70 border-transparent hover:text-[#EDE7D6] hover:border-[#EDE7D6]/30"
      }`}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <div className="flex items-center gap-2 text-[#6B8CA3] text-sm py-6 justify-center">
      <span className="inline-block w-4 h-4 border-2 border-[#6B8CA3] border-t-transparent rounded-full animate-spin" />
      thinking it through…
    </div>
  );
}

function LimitReached({ hoursRemaining, onUnlocked }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function pay() {
    setError(null);
    if (!PAYSTACK_PUBLIC_KEY) {
      setError("Payments aren't set up yet — missing NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.");
      return;
    }
    if (!window.PaystackPop) {
      setError("Payment script hasn't loaded yet — refresh and try again.");
      return;
    }
    const { data } = await supabase.auth.getSession();
    const email = data?.session?.user?.email || `visitor+${Date.now()}@studybench.app`;

    setLoading(true);
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: PRICE_NGN * 100,
      currency: "NGN",
      ref: `studybench_${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
      callback: function (response) {
        authHeader().then((headers) => {
          fetch("/api/paystack/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify({ reference: response.reference }),
          })
            .then((res) => res.json())
            .then((data) => {
              setLoading(false);
              if (data.ok) onUnlocked();
              else setError(data.error || "Payment verification failed.");
            })
            .catch((err) => {
              setLoading(false);
              setError("Verification error: " + err.message);
            });
        });
      },
      onClose: function () {
        setLoading(false);
      },
    });
    handler.openIframe();
  }

  return (
    <div className="text-center py-8">
      <p className="text-[#1E3A2F] font-semibold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        You've used today's free generations
      </p>
      <p className="text-[#1E3A2F]/70 text-sm mb-5">
        Free access resets in about {hoursRemaining} hour{hoursRemaining === 1 ? "" : "s"} — or unlock unlimited now.
      </p>
      <button
        onClick={pay}
        disabled={loading}
        className="px-6 py-3 rounded bg-[#D9A441] text-[#1E3A2F] text-sm font-semibold disabled:opacity-50"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {loading ? "processing…" : `Unlock unlimited — ₦${PRICE_NGN}`}
      </button>
      {error && <p className="text-[#C4544A] text-xs mt-3">{error}</p>}
    </div>
  );
}

export default function StudyBench() {
  const [subject, setSubject] = useState("math1");
  const [mode, setMode] = useState("quiz");
  const [topic, setTopic] = useState("");
  const [session, setSession] = useState(undefined); // undefined = still checking
  const [meInfo, setMeInfo] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    authHeader().then((headers) => {
      fetch("/api/me", { headers })
        .then((res) => res.json())
        .then(setMeInfo)
        .catch(() => {});
    });
  }, [session]);

  function refreshMe() {
    authHeader().then((headers) => {
      fetch("/api/me", { headers })
        .then((res) => res.json())
        .then(setMeInfo)
        .catch(() => {});
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center"
      style={{
        background: "radial-gradient(ellipse at top, #24473A 0%, #1E3A2F 60%, #16291F 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />

      <header className="w-full max-w-3xl px-6 pt-10 pb-4 text-center">
        <h1 className="text-[#F5F1E6] text-4xl sm:text-5xl tracking-tight" style={{ fontFamily: "'Kalam', cursive", textShadow: "0 0 18px rgba(217,164,65,0.15)" }}>
          StudyBench
        </h1>
        <p className="text-[#9DB8AA] text-sm mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Math &amp; Physics practice, built for JKU exam season
        </p>

        {session && (
          <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
            {meInfo?.unlimited && (
              <span className="text-xs px-3 py-1 rounded-full bg-[#D9A441]/20 text-[#D9A441]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                ✓ Unlimited access
              </span>
            )}
            {meInfo && !meInfo.unlimited && (
              <span className="text-xs px-3 py-1 rounded-full bg-[#EDE7D6]/10 text-[#9DB8AA]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {meInfo.used}/{meInfo.limit} free today
              </span>
            )}
            <button onClick={signOut} className="text-xs text-[#9DB8AA] underline">
              Sign out ({session.user.email})
            </button>
          </div>
        )}
      </header>

      {session === undefined ? (
        <Spinner />
      ) : !session ? (
        <div className="w-full max-w-sm bg-[#F5F1E6] rounded-lg shadow-2xl p-6 mx-4 text-center">
          <p className="text-[#1E3A2F] font-semibold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Log in to use StudyBench
          </p>
          <Link href="/login" className="block w-full py-2.5 rounded bg-[#1E3A2F] text-[#F5F1E6] text-sm font-medium mb-2">
            Log in
          </Link>
          <Link href="/signup" className="block w-full py-2.5 rounded border border-[#1E3A2F]/30 text-[#1E3A2F] text-sm font-medium">
            Sign up
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 justify-center px-4 mb-2">
            {SUBJECTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSubject(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  subject === s.id
                    ? "bg-[#D9A441] text-[#1E3A2F] border-[#D9A441]"
                    : "bg-transparent text-[#EDE7D6]/80 border-[#EDE7D6]/25 hover:border-[#EDE7D6]/60"
                }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-[#6B8CA3] text-xs mb-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {SUBJECTS.find((s) => s.id === subject)?.hint}
          </p>

          <div className="w-full max-w-3xl px-4 pb-16">
            <div className="flex gap-1 px-2">
              {MODES.map((m) => (
                <ChalkButton key={m.id} active={mode === m.id} onClick={() => setMode(m.id)}>
                  {m.label}
                </ChalkButton>
              ))}
            </div>

            <div
              className="rounded-b-lg rounded-tr-lg shadow-2xl p-6 sm:p-8 min-h-[420px]"
              style={{ background: "#F5F1E6", backgroundImage: "repeating-linear-gradient(#F5F1E6 0px, #F5F1E6 27px, #E4DEC9 28px)" }}
            >
              <div className="mb-5">
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={`Topic within ${SUBJECTS.find((s) => s.id === subject)?.label}… e.g. "chain rule" or leave blank for a mix`}
                  className="w-full bg-transparent border-b border-[#1E3A2F]/25 pb-2 text-[#1E3A2F] placeholder:text-[#1E3A2F]/40 focus:outline-none focus:border-[#D9A441] text-sm"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                />
              </div>

              {mode === "quiz" && <QuizMode subject={subject} topic={topic} onUnlocked={refreshMe} />}
              {mode === "cards" && <CardsMode subject={subject} topic={topic} onUnlocked={refreshMe} />}
              {mode === "solver" && <SolverMode subject={subject} topic={topic} onUnlocked={refreshMe} />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function QuizMode({ subject, topic, onUnlocked }) {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);
  const [limitInfo, setLimitInfo] = useState(null);

  const subjLabel = SUBJECTS.find((s) => s.id === subject)?.label;

  async function generate() {
    setLoading(true);
    setError(null);
    setFeedback(null);
    setAnswer("");
    setLimitInfo(null);
    try {
      const prompt = `You are creating one exam-style practice problem for a university student studying "${subjLabel}"${
        topic ? ` on the specific topic: ${topic}` : ""
      }. Respond ONLY with strict JSON, no markdown fences, no preamble, matching exactly this shape:
{"question": "the problem statement, use plain text math notation like x^2, sqrt(x), integral, etc", "hint": "a short one-sentence nudge", "answer": "the final correct answer, concise", "solution": "a short step-by-step solution, 3-6 steps, plain text"}
Make the difficulty appropriate for an intro-to-intermediate university course. Keep it solvable without a calculator where possible.`;
      const data = await askServer(prompt, true);
      setProblem(data);
    } catch (e) {
      if (e.limited) setLimitInfo({ hoursRemaining: e.hoursRemaining });
      else setError(e.message || "Couldn't generate a problem just now. Try again?");
    } finally {
      setLoading(false);
    }
  }

  async function checkAnswer() {
    if (!problem || !answer.trim()) return;
    setChecking(true);
    try {
      const prompt = `Problem: ${problem.question}
Correct answer: ${problem.answer}
Student's answer: ${answer}
Is the student's answer correct (allow equivalent forms, e.g. 1/2 vs 0.5)? Respond ONLY with strict JSON: {"correct": true or false, "note": "one short encouraging sentence explaining why, no more than 25 words"}`;
      const data = await askServer(prompt, true);
      setFeedback(data);
    } catch (e) {
      if (e.limited) setLimitInfo({ hoursRemaining: e.hoursRemaining });
      else setFeedback({ correct: null, note: "Couldn't check that — compare against the solution below." });
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  if (limitInfo) {
    return (
      <LimitReached
        hoursRemaining={limitInfo.hoursRemaining}
        onUnlocked={() => {
          setLimitInfo(null);
          onUnlocked();
          generate();
        }}
      />
    );
  }

  return (
    <div>
      {loading && <Spinner />}
      {error && <p className="text-[#C4544A] text-sm mb-3">{error}</p>}

      {!loading && problem && (
        <div>
          <p className="text-[#1E3A2F] text-base leading-relaxed mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {problem.question}
          </p>
          <p className="text-[#6B8CA3] text-xs italic mb-4">Hint: {problem.hint}</p>

          <div className="flex gap-2 mb-3">
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
              placeholder="Your answer"
              className="flex-1 border border-[#1E3A2F]/20 rounded px-3 py-2 text-sm text-[#1E3A2F] focus:outline-none focus:border-[#D9A441]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            />
            <button
              onClick={checkAnswer}
              disabled={checking || !answer.trim()}
              className="px-4 py-2 rounded bg-[#1E3A2F] text-[#F5F1E6] text-sm font-medium disabled:opacity-40"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {checking ? "…" : "Check"}
            </button>
          </div>

          {feedback && (
            <div
              className={`text-sm rounded px-3 py-2 mb-3 ${
                feedback.correct === true
                  ? "bg-[#D9A441]/20 text-[#7A5A0F]"
                  : feedback.correct === false
                  ? "bg-[#C4544A]/15 text-[#8C3B33]"
                  : "bg-[#6B8CA3]/15 text-[#3A5566]"
              }`}
            >
              {feedback.correct === true ? "✓ Correct — " : feedback.correct === false ? "✗ Not quite — " : ""}
              {feedback.note}
            </div>
          )}

          <details className="text-sm text-[#1E3A2F]/80 mb-4">
            <summary className="cursor-pointer text-[#6B8CA3] hover:text-[#1E3A2F]">Show full solution</summary>
            <pre className="whitespace-pre-wrap mt-2 leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {problem.solution}
            </pre>
          </details>

          <button
            onClick={generate}
            className="text-xs px-3 py-1.5 rounded border border-[#1E3A2F]/25 text-[#1E3A2F]/70 hover:border-[#1E3A2F] hover:text-[#1E3A2F]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Next problem →
          </button>
        </div>
      )}
    </div>
  );
}

function CardsMode({ subject, topic, onUnlocked }) {
  const [cards, setCards] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limitInfo, setLimitInfo] = useState(null);

  const subjLabel = SUBJECTS.find((s) => s.id === subject)?.label;

  async function generate() {
    setLoading(true);
    setError(null);
    setIdx(0);
    setFlipped(false);
    setLimitInfo(null);
    try {
      const prompt = `Create 8 flashcards for a university student studying "${subjLabel}"${
        topic ? `, focused on: ${topic}` : ""
      }. Mix formulas and key concept definitions. Respond ONLY with strict JSON array, no markdown fences:
[{"front": "term or question, short", "back": "formula or definition, concise, plain text math notation"}]`;
      const data = await askServer(prompt, true);
      setCards(data);
    } catch (e) {
      if (e.limited) setLimitInfo({ hoursRemaining: e.hoursRemaining });
      else setError(e.message || "Couldn't generate flashcards just now. Try again?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  if (limitInfo) {
    return (
      <LimitReached
        hoursRemaining={limitInfo.hoursRemaining}
        onUnlocked={() => {
          setLimitInfo(null);
          onUnlocked();
          generate();
        }}
      />
    );
  }

  const card = cards[idx];

  return (
    <div>
      {loading && <Spinner />}
      {error && <p className="text-[#C4544A] text-sm mb-3">{error}</p>}
      {!loading && card && (
        <div className="flex flex-col items-center">
          <div
            onClick={() => setFlipped((f) => !f)}
            className="w-full max-w-md h-52 rounded-lg border-2 border-[#1E3A2F]/15 flex items-center justify-center text-center px-6 cursor-pointer select-none transition-transform"
            style={{ background: flipped ? "#1E3A2F" : "#FBF8EF", color: flipped ? "#F5F1E6" : "#1E3A2F" }}
          >
            <p className="text-lg leading-relaxed" style={{ fontFamily: flipped ? "'JetBrains Mono', monospace" : "'Space Grotesk', sans-serif" }}>
              {flipped ? card.back : card.front}
            </p>
          </div>
          <p className="text-[#6B8CA3] text-xs mt-2">tap card to flip</p>

          <div className="flex items-center gap-4 mt-5">
            <button onClick={() => { setIdx((i) => Math.max(0, i - 1)); setFlipped(false); }} disabled={idx === 0} className="text-sm text-[#1E3A2F]/70 disabled:opacity-30">
              ← prev
            </button>
            <span className="text-xs text-[#6B8CA3]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {idx + 1} / {cards.length}
            </span>
            <button onClick={() => { setIdx((i) => Math.min(cards.length - 1, i + 1)); setFlipped(false); }} disabled={idx === cards.length - 1} className="text-sm text-[#1E3A2F]/70 disabled:opacity-30">
              next →
            </button>
          </div>
          <button onClick={generate} className="text-xs mt-4 px-3 py-1.5 rounded border border-[#1E3A2F]/25 text-[#1E3A2F]/70 hover:border-[#1E3A2F] hover:text-[#1E3A2F]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            New deck
          </button>
        </div>
      )}
    </div>
  );
}

function SolverMode({ subject, topic, onUnlocked }) {
  const [input, setInput] = useState("");
  const [steps, setSteps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limitInfo, setLimitInfo] = useState(null);

  const subjLabel = SUBJECTS.find((s) => s.id === subject)?.label;

  async function solve() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setSteps(null);
    setLimitInfo(null);
    try {
      const prompt = `A university student studying "${subjLabel}" wants this problem solved with full worked steps, so they can check their own work:

"${input}"

Respond ONLY with strict JSON, no markdown fences: {"steps": ["step 1 text", "step 2 text", "..."], "final_answer": "concise final answer"}. Each step should show the actual math work, not just describe it. Use plain text notation (x^2, sqrt(x), integral of, etc). Keep each step to 1-2 lines.`;
      const data = await askServer(prompt, true);
      setSteps(data);
    } catch (e) {
      if (e.limited) setLimitInfo({ hoursRemaining: e.hoursRemaining });
      else setError(e.message || "Couldn't solve that just now — check the problem is clearly stated and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (limitInfo) {
    return (
      <LimitReached
        hoursRemaining={limitInfo.hoursRemaining}
        onUnlocked={() => {
          setLimitInfo(null);
          onUnlocked();
        }}
      />
    );
  }

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Paste or type a ${subjLabel} problem you're stuck on…`}
        rows={3}
        className="w-full border border-[#1E3A2F]/20 rounded px-3 py-2 text-sm text-[#1E3A2F] focus:outline-none focus:border-[#D9A441] mb-3 resize-none"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      />
      <button onClick={solve} disabled={loading || !input.trim()} className="px-4 py-2 rounded bg-[#1E3A2F] text-[#F5F1E6] text-sm font-medium disabled:opacity-40 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {loading ? "solving…" : "Walk me through it"}
      </button>

      {loading && <Spinner />}
      {error && <p className="text-[#C4544A] text-sm mb-3">{error}</p>}

      {steps && (
        <div className="space-y-3">
          {steps.steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D9A441]/25 text-[#7A5A0F] text-xs flex items-center justify-center font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {i + 1}
              </span>
              <p className="text-sm text-[#1E3A2F] leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {s}
              </p>
            </div>
          ))}
          <div className="mt-4 pt-3 border-t border-[#1E3A2F]/15">
            <p className="text-sm font-semibold text-[#1E3A2F]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Answer: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{steps.final_answer}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
