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
        <img className="brand-mark" src="/logo.jpg" alt="StudyBench" />
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
