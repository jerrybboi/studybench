"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import Turnstile from "../lib/Turnstile";

function safeNext(value) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextPath, setNextPath] = useState("/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(safeNext(params.get("next")));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Please complete the CAPTCHA first.");
      return;
    }

    setLoading(true);

    try {
      const verifyRes = await fetch("/api/turnstile-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "CAPTCHA verification failed.");

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      router.replace(nextPath);
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="wrap">
      <Link href="/" className="brand" aria-label="StudyBench home">
        <span className="brand-mark">SB</span>
        <span className="brand-name">StudyBench</span>
        <span className="brand-tag">Learn · Practice · Grow</span>
      </Link>

      <section className="card">
        <h1>Welcome back</h1>
        <p className="sub">Log in to continue reading, practicing, and asking.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="captcha-wrap">
            <Turnstile onToken={setToken} />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="switch">
          No account yet? <Link href={`/signup?next=${encodeURIComponent(nextPath)}`}>Sign up</Link>
        </p>
      </section>

      <Link href="/" className="back">← Back to StudyBench</Link>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: radial-gradient(ellipse 900px 500px at 50% 0%, rgba(201, 162, 39, 0.08), transparent 60%), var(--ink);
        }
        .brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          margin-bottom: 30px;
        }
        .brand-mark {
          width: 78px;
          height: 78px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--parchment);
          color: var(--ink);
          border: 3px solid var(--brass);
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 1.15rem;
        }
        .brand-name {
          margin-top: 8px;
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.18rem;
          color: var(--parchment);
        }
        .brand-tag {
          margin-top: 2px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--brass-soft);
        }
        .card {
          width: min(100%, 420px);
          padding: 32px;
          border-radius: 10px;
          background: var(--parchment);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
        }
        h1 {
          margin: 0;
          color: var(--parch-ink);
          font-family: 'Fraunces', serif;
          font-size: 1.8rem;
        }
        .sub {
          margin: 8px 0 24px;
          color: #6b5d3d;
        }
        form {
          display: grid;
          gap: 10px;
        }
        label {
          margin-top: 5px;
          color: var(--parch-ink);
          font-size: 0.82rem;
          font-weight: 600;
        }
        input {
          width: 100%;
          padding: 12px 13px;
          border: 1px solid #cbbd9f;
          border-radius: 5px;
          background: #fffaf0;
          color: var(--parch-ink);
          font: inherit;
          outline: none;
        }
        input:focus {
          border-color: var(--brass);
          box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.12);
        }
        .captcha-wrap {
          margin: 10px 0 2px;
          min-height: 65px;
        }
        .error {
          margin: 0;
          color: var(--danger);
          font-size: 0.82rem;
        }
        .submit-btn {
          margin-top: 4px;
          border: 0;
          border-radius: 5px;
          padding: 12px 16px;
          background: var(--brass);
          color: var(--ink);
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: wait;
        }
        .switch {
          margin: 18px 0 0;
          text-align: center;
          color: #6b5d3d;
          font-size: 0.9rem;
        }
        .switch a {
          color: #5a4510;
          font-weight: 700;
        }
        .back {
          margin-top: 22px;
          color: var(--fog);
          text-decoration: none;
          font-size: 0.84rem;
        }
      `}</style>
    </main>
  );
}
