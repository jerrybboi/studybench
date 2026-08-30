"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { supabase } from "../lib/supabaseClient";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const SUBJECTS = [
  { id: "math", label: "Mathematics", hint: "algebra, calculus, linear algebra, statistics", web3: false },
  { id: "physics", label: "Physics", hint: "mechanics, thermodynamics, E&M - intro level", web3: false },
  { id: "chemistry", label: "Chemistry", hint: "general and organic chemistry basics", web3: false },
  { id: "defi", label: "DeFi", hint: "lending, AMMs, yield farming, borrowing", web3: true },
  { id: "nfts", label: "NFTs", hint: "minting, marketplaces, smart contracts", web3: true },
  { id: "daos", label: "DAOs", hint: "governance, voting, treasuries", web3: true },
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

function Spinner() {
  return (
    <div className="spinner">
      <span className="spin-dot" />
      thinking it through…
      <style jsx>{`
        .spinner {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b5d3d;
          font-size: 0.85rem;
          padding: 24px 0;
          justify-content: center;
        }
        .spin-dot {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid #6b5d3d;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

function LimitReached({ hoursRemaining, onUnlocked }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function pay() {
    setError(null);
    if (!PAYSTACK_PUBLIC_KEY) {
      setError("Payments aren't set up yet.");
      return;
    }
    if (!window.PaystackPop) {
      setError("Payment script hasn't loaded yet - refresh and try again.");
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
    <div className="limit-box">
      <p className="limit-title">You&apos;ve used today&apos;s free generations</p>
      <p className="limit-sub">
        Free access resets in about {hoursRemaining} hour{hoursRemaining === 1 ? "" : "s"} - or unlock unlimited now.
      </p>
      <button onClick={pay} disabled={loading} className="unlock-btn">
        {loading ? "processing…" : `Unlock unlimited — ₦${PRICE_NGN}`}
      </button>
      {error && <p className="limit-error">{error}</p>}
      <style jsx>{`
        .limit-box {
          text-align: center;
          padding: 32px 0;
        }
        .limit-title {
          color: var(--parch-ink);
          font-weight: 600;
          font-family: 'Fraunces', serif;
          font-size: 1.05rem;
          margin: 0 0 6px;
        }
        .limit-sub {
          color: #6b5d3d;
          font-size: 0.86rem;
          margin: 0 0 20px;
        }
        .unlock-btn {
          background: var(--brass);
          color: var(--ink);
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .unlock-btn:disabled {
          opacity: 0.6;
        }
        .limit-error {
          color: var(--danger);
          font-size: 0.75rem;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}

export default function AskAIPage() {
  const [subject, setSubject] = useState("math");
  const [mode, setMode] = useState("quiz");
  const [topic, setTopic] = useState("");
  const [session, setSession] = useState(undefined);
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
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setSession(null);
  }

  const currentSubject = SUBJECTS.find((s) => s.id === subject);

  return (
    <>
      <Nav
        active="ask-ai"
        accent={currentSubject?.web3 ? "teal" : "brass"}
        authed={!!session}
        userEmail={session?.user?.email}
        onSignOut={signOut}
      />
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />

      <div className="page-head">
        <p className="eyebrow">The reading desk</p>
        <h1 className="page-title">Ask anything on the shelf</h1>
        <p className="page-sub">Quizzes, flashcards, and worked solutions across every subject - school or crypto.</p>
        {session && meInfo && (
          <span className="usage-pill">
            {meInfo.unlimited ? "✓ Unlimited access" : `${meInfo.used}/${meInfo.limit} free today`}
          </span>
        )}
      </div>

      {session === undefined ? (
        <div className="center-pad">
          <Spinner />
        </div>
      ) : !session ? (
        <div className="guest-card">
          <p className="guest-title">Log in to use StudyBench</p>
          <Link href="/login" className="guest-btn">
            Log in
          </Link>
          <Link href="/signup" className="guest-btn-ghost">
            Sign up
          </Link>
        </div>
      ) : (
        <>
          <div className="subjects">
            {SUBJECTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSubject(s.id)}
                className={`subj ${s.web3 ? "web3" : ""} ${subject === s.id ? "active" : ""}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="tool-wrap">
            <div className="modes">
              <button className={`mode ${mode === "quiz" ? "active" : ""}`} onClick={() => setMode("quiz")}>
                Quiz Me
              </button>
              <button className={`mode ${mode === "cards" ? "active" : ""}`} onClick={() => setMode("cards")}>
                Flashcards
              </button>
              <button className={`mode ${mode === "solver" ? "active" : ""}`} onClick={() => setMode("solver")}>
                Solve With Me
              </button>
            </div>
            <div className="panel">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={`Topic within ${currentSubject?.label}… e.g. "${currentSubject?.hint.split(",")[0]}" or leave blank for a mix`}
              />

              {mode === "quiz" && <QuizMode subject={currentSubject} topic={topic} onUnlocked={refreshMe} />}
              {mode === "cards" && <CardsMode subject={currentSubject} topic={topic} onUnlocked={refreshMe} />}
              {mode === "solver" && <SolverMode subject={currentSubject} topic={topic} onUnlocked={refreshMe} />}
            </div>
          </div>
        </>
      )}

      <Footer />

      <style jsx>{`
        .page-head {
          padding: clamp(44px, 7vw, 64px) clamp(20px, 6vw, 64px) 10px;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }
        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--brass-soft);
          margin-bottom: 14px;
        }
        .page-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(1.9rem, 3.6vw, 2.6rem);
          color: var(--parchment);
          margin: 0 0 12px;
        }
        .page-sub {
          max-width: 520px;
          margin: 0 auto 8px;
          font-size: 0.98rem;
          line-height: 1.6;
          color: var(--fog);
        }
        .usage-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 18px auto 0;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.76rem;
          padding: 7px 16px;
          border-radius: 20px;
          background: rgba(201, 162, 39, 0.12);
          color: var(--brass-soft);
          border: 1px solid rgba(201, 162, 39, 0.25);
        }
        .center-pad {
          padding: 60px 20px;
        }
        .guest-card {
          max-width: 340px;
          margin: 30px auto 90px;
          background: var(--parchment);
          border-radius: 10px;
          padding: 30px;
          text-align: center;
        }
        .guest-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          color: var(--parch-ink);
          margin: 0 0 16px;
        }
        .guest-btn,
        .guest-btn-ghost {
          display: block;
          width: 100%;
          padding: 12px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 10px;
          font-family: 'Source Sans 3', sans-serif;
        }
        .guest-btn {
          background: var(--ink);
          color: var(--parchment);
        }
        .guest-btn-ghost {
          border: 1px solid rgba(36, 28, 16, 0.25);
          color: var(--parch-ink);
        }
        .subjects {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
          margin: 26px auto 6px;
          max-width: 700px;
          padding: 0 20px;
        }
        :global(.subj) {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid rgba(201, 162, 39, 0.3);
          color: var(--fog);
          cursor: pointer;
          background: transparent;
        }
        :global(.subj.active) {
          background: var(--brass);
          color: var(--ink);
          border-color: var(--brass);
          font-weight: 500;
        }
        :global(.subj.web3) {
          border-color: rgba(111, 167, 154, 0.35);
        }
        :global(.subj.web3.active) {
          background: var(--teal-soft);
          color: var(--ink);
          border-color: var(--teal-soft);
        }
        .tool-wrap {
          max-width: 760px;
          margin: 34px auto 90px;
          padding: 0 clamp(20px, 6vw, 64px);
        }
        .modes {
          display: flex;
          gap: 4px;
        }
        :global(.mode) {
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 12px 22px;
          border-radius: 6px 6px 0 0;
          border: none;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.03);
          color: var(--fog);
        }
        :global(.mode.active) {
          background: var(--parchment);
          color: var(--parch-ink);
        }
        .panel {
          background: var(--parchment);
          border-radius: 0 8px 8px 8px;
          padding: 30px 28px;
          min-height: 340px;
          color: var(--parch-ink);
        }
        .panel input[type="text"] {
          width: 100%;
          padding: 10px 0;
          border: none;
          border-bottom: 1px solid rgba(36, 28, 16, 0.2);
          background: transparent;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 0.92rem;
          color: var(--parch-ink);
          margin-bottom: 22px;
        }
        .panel input[type="text"]:focus {
          outline: none;
          border-color: var(--brass);
        }
      `}</style>
    </>
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

  async function generate() {
    setLoading(true);
    setError(null);
    setFeedback(null);
    setAnswer("");
    setLimitInfo(null);
    try {
      const prompt = `You are creating one exam-style practice problem for a student studying "${subject.label}"${
        topic ? ` on the specific topic: ${topic}` : ""
      }. Respond ONLY with strict JSON, no markdown fences, no preamble:
{"question": "the problem statement, plain text notation like x^2, sqrt(x)", "hint": "a short one-sentence nudge", "answer": "the final correct answer, concise", "solution": "a short step-by-step solution, 3-6 steps, plain text"}
Keep difficulty appropriate for an introductory-to-intermediate learner in this subject.`;
      const data = await askServer(prompt, true);
      setProblem(data);
    } catch (e) {
      if (e.limited) setLimitInfo({ hoursRemaining: e.hoursRemaining });
      else setError(e.message || "Couldn't generate a problem just now.");
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
Is the student's answer correct (allow equivalent forms)? Respond ONLY with strict JSON: {"correct": true or false, "note": "one short encouraging sentence, under 25 words"}`;
      const data = await askServer(prompt, true);
      setFeedback(data);
    } catch (e) {
      if (e.limited) setLimitInfo({ hoursRemaining: e.hoursRemaining });
      else setFeedback({ correct: null, note: "Couldn't check that - compare against the solution below." });
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject.id]);

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
      {loading && (
        <div className="spin-wrap">
          <span>thinking it through…</span>
        </div>
      )}
      {error && <p className="err-text">{error}</p>}

      {!loading && problem && (
        <div>
          <p className="q-text">{problem.question}</p>
          <p className="hint">Hint: {problem.hint}</p>

          <div className="ans-row">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
              placeholder="Your answer"
            />
            <button onClick={checkAnswer} disabled={checking || !answer.trim()} className="check-btn">
              {checking ? "…" : "Check"}
            </button>
          </div>

          {feedback && (
            <div className={`feedback ${feedback.correct === true ? "ok" : feedback.correct === false ? "bad" : "meh"}`}>
              {feedback.correct === true ? "✓ Correct — " : feedback.correct === false ? "✗ Not quite — " : ""}
              {feedback.note}
            </div>
          )}

          <details className="solution">
            <summary>Show full solution</summary>
            <pre>{problem.solution}</pre>
          </details>

          <button onClick={generate} className="next-btn">
            Next problem →
          </button>
        </div>
      )}

      <style jsx>{`
        .spin-wrap {
          text-align: center;
          color: #6b5d3d;
          font-size: 0.85rem;
          padding: 24px 0;
        }
        .err-text {
          color: var(--danger);
          font-size: 0.85rem;
          margin-bottom: 12px;
        }
        .q-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 14px;
        }
        .hint {
          font-size: 0.8rem;
          font-style: italic;
          color: #6b5d3d;
          margin-bottom: 20px;
        }
        .ans-row {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }
        .ans-row input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid rgba(36, 28, 16, 0.2);
          border-radius: 4px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.88rem;
        }
        .check-btn {
          background: var(--ink);
          color: var(--parchment);
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
        }
        .check-btn:disabled {
          opacity: 0.5;
        }
        .feedback {
          font-size: 0.86rem;
          border-radius: 6px;
          padding: 10px 14px;
          margin-bottom: 16px;
        }
        .feedback.ok {
          background: rgba(201, 162, 39, 0.2);
          color: #7a5a0f;
        }
        .feedback.bad {
          background: rgba(196, 84, 74, 0.15);
          color: #8c3b33;
        }
        .feedback.meh {
          background: rgba(159, 176, 192, 0.15);
          color: #3a5566;
        }
        .solution {
          font-size: 0.86rem;
          color: rgba(36, 28, 16, 0.8);
          margin-bottom: 18px;
        }
        .solution summary {
          cursor: pointer;
          color: #6b5d3d;
        }
        .solution pre {
          white-space: pre-wrap;
          margin-top: 10px;
          line-height: 1.6;
          font-family: 'IBM Plex Mono', monospace;
        }
        .next-btn {
          font-size: 0.75rem;
          padding: 7px 14px;
          border-radius: 3px;
          border: 1px solid rgba(36, 28, 16, 0.25);
          color: rgba(36, 28, 16, 0.7);
          background: transparent;
          cursor: pointer;
          font-family: 'IBM Plex Mono', monospace;
        }
      `}</style>
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

  async function generate() {
    setLoading(true);
    setError(null);
    setIdx(0);
    setFlipped(false);
    setLimitInfo(null);
    try {
      const prompt = `Create 8 flashcards for a student studying "${subject.label}"${
        topic ? `, focused on: ${topic}` : ""
      }. Mix key terms and definitions. Respond ONLY with strict JSON array, no markdown fences:
[{"front": "term or question, short", "back": "definition or explanation, concise"}]`;
      const data = await askServer(prompt, true);
      setCards(data);
    } catch (e) {
      if (e.limited) setLimitInfo({ hoursRemaining: e.hoursRemaining });
      else setError(e.message || "Couldn't generate flashcards just now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject.id]);

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
      {loading && <div className="spin-wrap">thinking it through…</div>}
      {error && <p className="err-text">{error}</p>}
      {!loading && card && (
        <div className="cards-area">
          <div className={`flip-card ${flipped ? "flipped" : ""}`} onClick={() => setFlipped((f) => !f)}>
            <p>{flipped ? card.back : card.front}</p>
          </div>
          <p className="tap-hint">tap card to flip</p>
          <div className="nav-row">
            <button
              onClick={() => {
                setIdx((i) => Math.max(0, i - 1));
                setFlipped(false);
              }}
              disabled={idx === 0}
            >
              ← prev
            </button>
            <span className="count">
              {idx + 1} / {cards.length}
            </span>
            <button
              onClick={() => {
                setIdx((i) => Math.min(cards.length - 1, i + 1));
                setFlipped(false);
              }}
              disabled={idx === cards.length - 1}
            >
              next →
            </button>
          </div>
          <button onClick={generate} className="new-deck">
            New deck
          </button>
        </div>
      )}

      <style jsx>{`
        .spin-wrap {
          text-align: center;
          color: #6b5d3d;
          font-size: 0.85rem;
          padding: 24px 0;
        }
        .err-text {
          color: var(--danger);
          font-size: 0.85rem;
        }
        .cards-area {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .flip-card {
          width: 100%;
          max-width: 400px;
          height: 210px;
          border-radius: 10px;
          border: 2px solid rgba(36, 28, 16, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 24px;
          cursor: pointer;
          background: #fbf8ef;
          color: var(--parch-ink);
          font-family: 'Source Sans 3', sans-serif;
          font-size: 1.1rem;
          line-height: 1.5;
        }
        .flip-card.flipped {
          background: var(--ink);
          color: var(--parchment);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.95rem;
        }
        .tap-hint {
          font-size: 0.75rem;
          color: #6b5d3d;
          margin-top: 8px;
        }
        .nav-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 20px;
        }
        .nav-row button {
          background: transparent;
          border: none;
          font-size: 0.85rem;
          color: rgba(36, 28, 16, 0.7);
          cursor: pointer;
        }
        .nav-row button:disabled {
          opacity: 0.3;
        }
        .count {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #6b5d3d;
        }
        .new-deck {
          margin-top: 16px;
          font-size: 0.75rem;
          padding: 7px 14px;
          border-radius: 3px;
          border: 1px solid rgba(36, 28, 16, 0.25);
          color: rgba(36, 28, 16, 0.7);
          background: transparent;
          cursor: pointer;
          font-family: 'IBM Plex Mono', monospace;
        }
      `}</style>
    </div>
  );
}

function SolverMode({ subject, topic, onUnlocked }) {
  const [input, setInput] = useState("");
  const [steps, setSteps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limitInfo, setLimitInfo] = useState(null);

  async function solve() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setSteps(null);
    setLimitInfo(null);
    try {
      const prompt = `A student studying "${subject.label}" wants this problem solved with full worked steps:

"${input}"

Respond ONLY with strict JSON, no markdown fences: {"steps": ["step 1", "step 2", "..."], "final_answer": "concise final answer"}. Each step should show real work, 1-2 lines each, plain text notation.`;
      const data = await askServer(prompt, true);
      setSteps(data);
    } catch (e) {
      if (e.limited) setLimitInfo({ hoursRemaining: e.hoursRemaining });
      else setError(e.message || "Couldn't solve that just now.");
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
        placeholder={`Paste or type a ${subject.label} problem you're stuck on…`}
        rows={3}
      />
      <button onClick={solve} disabled={loading || !input.trim()} className="solve-btn">
        {loading ? "solving…" : "Walk me through it"}
      </button>

      {loading && <div className="spin-wrap">thinking it through…</div>}
      {error && <p className="err-text">{error}</p>}

      {steps && (
        <div className="steps-area">
          {steps.steps.map((s, i) => (
            <div key={i} className="step-row">
              <span className="step-num">{i + 1}</span>
              <p>{s}</p>
            </div>
          ))}
          <div className="final-answer">
            Answer: <span>{steps.final_answer}</span>
          </div>
        </div>
      )}

      <style jsx>{`
        textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid rgba(36, 28, 16, 0.2);
          border-radius: 4px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.88rem;
          margin-bottom: 12px;
          resize: none;
        }
        .solve-btn {
          background: var(--ink);
          color: var(--parchment);
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          margin-bottom: 16px;
        }
        .solve-btn:disabled {
          opacity: 0.5;
        }
        .spin-wrap {
          text-align: center;
          color: #6b5d3d;
          font-size: 0.85rem;
          padding: 20px 0;
        }
        .err-text {
          color: var(--danger);
          font-size: 0.85rem;
        }
        .steps-area {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .step-row {
          display: flex;
          gap: 12px;
        }
        .step-num {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(201, 162, 39, 0.25);
          color: #7a5a0f;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 600;
        }
        .step-row p {
          font-size: 0.9rem;
          line-height: 1.6;
          font-family: 'IBM Plex Mono', monospace;
          margin: 0;
        }
        .final-answer {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(36, 28, 16, 0.15);
          font-weight: 600;
          font-size: 0.92rem;
          font-family: 'Source Sans 3', sans-serif;
        }
        .final-answer span {
          font-family: 'IBM Plex Mono', monospace;
        }
      `}</style>
    </div>
  );
}
