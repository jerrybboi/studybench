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

      router.push("/");
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
        background: "radial-gradient(ellipse at top, #24473A 0%, #1E3A2F 60%, #16291F 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="w-full max-w-sm bg-[#F5F1E6] rounded-lg shadow-2xl p-6">
        <h1 className="text-[#1E3A2F] text-2xl mb-1" style={{ fontFamily: "'Kalam', cursive" }}>
          Welcome back
        </h1>
        <p className="text-[#1E3A2F]/60 text-sm mb-5">Log in to StudyBench.</p>

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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#1E3A2F]/20 rounded px-3 py-2 text-sm text-[#1E3A2F] mb-1 focus:outline-none focus:border-[#D9A441]"
          />

          <Turnstile onToken={setToken} />

          {error && <p className="text-[#C4544A] text-xs mb-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded bg-[#1E3A2F] text-[#F5F1E6] text-sm font-medium disabled:opacity-50"
          >
            {loading ? "logging in…" : "Log in"}
          </button>

          <p className="text-[#1E3A2F]/60 text-xs mt-4 text-center">
            No account yet?{" "}
            <Link href="/signup" className="text-[#D9A441] underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
