"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function Turnstile({ onToken }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    if (!SITE_KEY) return;

    function renderWidget() {
      if (
        !window.turnstile ||
        !containerRef.current ||
        widgetIdRef.current !== null
      ) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,

        callback: (token) => {
          onToken(token);
        },

        "expired-callback": () => {
          onToken(null);
        },

        "error-callback": () => {
          onToken(null);
        },
      });
    }

    if (window.turnstile) {
      renderWidget();
    }

    window.addEventListener("load", renderWidget);

    return () => {
      window.removeEventListener("load", renderWidget);

      if (
        window.turnstile &&
        widgetIdRef.current !== null
      ) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore cleanup errors
        }
      }

      widgetIdRef.current = null;
    };
  }, [onToken]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />

      <div ref={containerRef} className="my-3" />

      {!SITE_KEY && (
        <p className="text-[#C4544A] text-xs">
          CAPTCHA not configured — missing NEXT_PUBLIC_TURNSTILE_SITE_KEY.
        </p>
      )}
    </>
  );
}