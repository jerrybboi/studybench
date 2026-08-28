“use client”;

import { useEffect, useRef } from “react”;
import Script from “next/script”;

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function Turnstile({ onToken }) {
const ref = useRef(null);
const widgetId = useRef(null);

const handleToken = (token) => {
console.log(“Turnstile token received:”, !!token);
onToken(token);
};

function renderWidget() {
if (!window.turnstile || !ref.current || widgetId.current) return;

widgetId.current = window.turnstile.render(ref.current, {
  sitekey: SITE_KEY,
  callback: handleToken,
  "expired-callback": () => {
    onToken(null);
  },
  "error-callback": () => {
    onToken(null);
  },
});

}

useEffect(() => {
if (window.turnstile) {
renderWidget();
}
}, []);

return (
<>
  <div ref={ref} className="my-3" />
  {!SITE_KEY && (
    <p className="text-[#C4544A] text-xs">
      CAPTCHA not configured — missing NEXT_PUBLIC_TURNSTILE_SITE_KEY.
    </p>
  )}
</>

);
}