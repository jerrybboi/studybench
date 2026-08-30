"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import Turnstile from "../lib/Turnstile";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      router.push("/ask-ai");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="wrap">
      <Link href="/" className="brand">
        <img className="brand-mark" src="data:image/jpeg;base64,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" alt="StudyBench" />
        <span className="brand-name">StudyBench</span>
        <span className="brand-tag">Learn · Practice · Grow</span>
      </Link>

      <div className="card">
        <h1 className="card-title">Welcome back</h1>
        <p className="card-sub">Log in to continue reading and asking.</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            required
            placeholder="you@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="captcha-wrap">
            <Turnstile onToken={setToken} />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "logging in…" : "Log in"}
          </button>

          <p className="switch">
            No account yet? <Link href="/signup">Sign up</Link>
          </p>
        </form>
      </div>

      <Link href="/" className="back">
        ← Back to StudyBench
      </Link>

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
          margin-bottom: 34px;
        }
        .brand-mark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }
        .brand-name {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.15rem;
          color: var(--parchment);
          margin-top: 6px;
        }
        .brand-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--brass-soft);
          margin-top: 2px;
        }
        .card {
          width: 100%;
          max-width: 380px;
          background: var(--parchment);
          border-radius: 10px;
          padding: 34px 30px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        }
        .card-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.5rem;
          color: var(--parch-ink);
          margin: 0 0 4px;
        }
        .card-sub {
          font-size: 0.86rem;
          color: #6b5d3d;
          margin: 0 0 26px;
        }
        label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #6b5d3d;
          margin-bottom: 6px;
        }
        input {
          width: 100%;
          padding: 11px 13px;
          border: 1px solid rgba(36, 28, 16, 0.2);
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.5);
          font-family: 'Source Sans 3', sans-serif;
          font-size: 0.92rem;
          color: var(--parch-ink);
          margin-bottom: 18px;
        }
        input:focus {
          outline: none;
          border-color: var(--brass);
        }
        .captcha-wrap {
          margin: 6px 0 16px;
        }
        .error {
          color: var(--danger);
          font-size: 0.8rem;
          margin-bottom: 12px;
        }
        .submit-btn {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 6px;
          background: var(--ink);
          color: var(--parchment);
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          margin-top: 6px;
        }
        .submit-btn:disabled {
          opacity: 0.6;
        }
        .switch {
          text-align: center;
          margin-top: 22px;
          font-size: 0.84rem;
          color: #6b5d3d;
        }
        .switch :global(a) {
          color: var(--parch-ink);
          font-weight: 600;
          text-decoration: underline;
        }
        .back {
          margin-top: 28px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
          color: var(--fog);
          text-decoration: none;
        }
        .back:hover {
          color: var(--brass-soft);
        }
      `}</style>
    </div>
  );
}
