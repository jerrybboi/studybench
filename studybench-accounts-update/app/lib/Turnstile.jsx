"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function Turnstile({ onToken }) {
  const ref = useRef(null);
  const widgetId = useRef(null);

  useEffect(() => {
    // Expose a global callback Turnstile's script will call with the token.
    window.__onTurnstileToken = (token) => onToken(token);
    return () => {
      delete window.__onTurnstileToken;
    };
  }, [onToken]);

  function renderWidget() {
    if (!window.turnstile || !ref.current || widgetId.current) return;
    widgetId.current = window.turnstile.render(ref.current, {
      sitekey: SITE_KEY,
      callback: "__onTurnstileToken",
    });
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={renderWidget}
      />
      <div ref={ref} className="my-3" />
      {!SITE_KEY && (
        <p className="text-[#C4544A] text-xs">
          CAPTCHA not configured — missing NEXT_PUBLIC_TURNSTILE_SITE_KEY.
        </p>
      )}
    </>
  );
}
