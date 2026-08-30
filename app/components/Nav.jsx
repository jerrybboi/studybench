"use client";

import Link from "next/link";

const TABS = [
  { href: "/educational", label: "Educational", key: "educational" },
  { href: "/web3", label: "Web3", key: "web3" },
  { href: "/ask-ai", label: "Ask AI", key: "ask-ai" },
  { href: "/about", label: "About", key: "about" },
];

export default function Nav({ active, accent = "brass", authed = false, userEmail, onSignOut }) {
  const accentVar = accent === "teal" ? "var(--teal-soft)" : "var(--brass)";
  const accentBorder = accent === "teal" ? "rgba(111,167,154,0.35)" : "rgba(201,162,39,0.35)";

  return (
    <nav>
      <Link href="/" className="brand">
        <img className="brand-mark" src="/logo.jpg" alt="StudyBench" />
        <div>
          <span className="brand-name">StudyBench</span>
          <span className="brand-tag">Learn · Practice · Grow</span>
        </div>
      </Link>
      <div className="nav-right">
        <div className="tabs">
          {TABS.map((t) => (
            <Link key={t.key} href={t.href} className={`tab ${active === t.key ? "active" : ""}`}>
              {t.label}
            </Link>
          ))}
        </div>
        {authed ? (
          <button className="login-link" onClick={onSignOut}>
            Sign out{userEmail ? ` (${userEmail})` : ""}
          </button>
        ) : (
          <Link href="/login" className="login-link">
            Log in
          </Link>
        )}
      </div>

      <style jsx>{`
        nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px clamp(20px, 5vw, 64px);
          background: linear-gradient(180deg, rgba(11, 19, 28, 0.96), rgba(11, 19, 28, 0.86));
          backdrop-filter: blur(6px);
          border-bottom: 1px solid ${accentBorder};
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .brand-mark {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .brand-name {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.15rem;
          color: var(--parchment);
          display: block;
        }
        .brand-tag {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${accentVar};
          margin-top: 1px;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .tabs {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .tab {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.04em;
          color: var(--fog);
          text-decoration: none;
          padding: 9px 16px;
          border-radius: 3px;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .tab:hover {
          color: var(--parchment);
          border-color: ${accentBorder};
          background: rgba(201, 162, 39, 0.06);
        }
        .tab.active {
          color: var(--ink);
          background: ${accentVar};
          font-weight: 500;
        }
        .login-link {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
          text-decoration: none;
          color: var(--parchment);
          border: 1px solid ${accentBorder};
          padding: 8px 16px;
          border-radius: 20px;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .login-link:hover {
          background: rgba(201, 162, 39, 0.1);
          border-color: ${accentVar};
        }
        @media (max-width: 820px) {
          .tabs {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
