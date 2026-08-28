"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import Turnstile from "../lib/Turnstile";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(
          verifyData.error || "CAPTCHA verification failed."
        );
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw signUpError;
      }

      setDone(true);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse at top, #24473A 0%, #1E3A2F 60%, #16291F 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="w-full max-w-sm bg-[#F5F1E6] rounded-lg shadow-2xl p-6">
        <h1
          className="text-[#1E3A2F] text-2xl mb-1"
          style={{ fontFamily: "'Kalam', cursive" }}
        >
          Create your account
        </h1>

        <p className="text-[#1E3A2F]/60 text-sm mb-5">
          Join StudyBench with your email.
        </p>

        {done ? (
          <div className="text-sm text-[#1E3A2F]">
            <p className="mb-3">
              Check <strong>{email}</strong> for a confirmation link. Click it,
              then come back and log in.
            </p>

            <Link href="/login" className="text-[#D9A441] underline">
              Go to login →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#1E3A2F]/20 rounded px-3 py-2 text-sm text-[#1E3A2F] mb-3 focus:outline-none focus:border-[#D9A441]"
            />

            <input
              type="password"
              required
              minLength={6}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#1E3A2F]/20 rounded px-3 py-2 text-sm text-[#1E3A2F] mb-1 focus:outline-none focus:border-[#D9A441]"
            />

            <Turnstile onToken={setToken} />

            {error && (
              <p className="text-[#C4544A] text-xs mb-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded bg-[#1E3A2F] text-[#F5F1E6] text-sm font-medium disabled:opacity-50"
            >
              {loading ? "creating account…" : "Sign up"}
            </button>

            <p className="text-[#1E3A2F]/60 text-xs mt-4 text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-[#D9A441] underline">
                Log in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}