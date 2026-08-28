"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function Turnstile({ onToken }) {
const ref = useRef(null);
const widgetId = useRef(null);

useEffect(() => {
if (!SITE_KEY || !ref.current || widgetId.current) return;

```
function renderWidget() {
  if (!window.turnstile || !ref.current || widgetId.current) return;

  widgetId.current = window.turnstile.render(ref.current, {
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

return () => {
  if (widgetId.current !== null && window.turnstile) {
    try {
      window.turnstile.remove(widgetId.current);
    } catch {}
  }
  widgetId.current = null;
};
```

}, [onToken]);

return (
<> <Script
     src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
     strategy="afterInteractive"
   />

```
  <div ref={ref} className="my-3" />

  {!SITE_KEY && (
    <p className="text-[#C4544A] text-xs">
      CAPTCHA not configured — missing NEXT_PUBLIC_TURNSTILE_SITE_KEY.
    </p>
  )}
</>
```

);
}
