"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

async function adminStatus(session) {
  if (!session?.access_token) return false;

  try {
    const res = await fetch("/api/admin/check", {
      headers: { Authorization: `Bearer ${session.access_token}` },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.isAdmin === true;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const lastToken = useRef(undefined);

  useEffect(() => {
    let active = true;

    async function applySession(nextSession) {
      const normalized = nextSession || null;
      const token = normalized?.access_token || null;

      if (lastToken.current === token) return;
      lastToken.current = token;

      if (!active) return;
      setSession(normalized);

      const nextIsAdmin = await adminStatus(normalized);
      if (active && lastToken.current === token) setIsAdmin(nextIsAdmin);
    }

    supabase.auth.getSession().then(({ data }) => applySession(data.session));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    lastToken.current = null;
    setSession(null);
    setIsAdmin(false);
  }

  const value = useMemo(
    () => ({
      session,
      loading: session === undefined,
      user: session?.user || null,
      isAdmin,
      signOut,
    }),
    [session, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
