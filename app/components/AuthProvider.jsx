"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const nextSession = data.session || null;
      setSession(nextSession);
      setIsAdmin(await adminStatus(nextSession));
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!active) return;
      setSession(nextSession || null);
      setIsAdmin(await adminStatus(nextSession));
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
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
