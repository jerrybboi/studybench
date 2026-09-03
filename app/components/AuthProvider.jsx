"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session || null);
    }

    loadSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadAdminState() {
      if (!session?.user?.id) {
        if (active) setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!active) return;
      setIsAdmin(!error && data?.is_admin === true);
    }

    loadAdminState();
    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  async function signOut() {
    await supabase.auth.signOut();
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
