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
          
