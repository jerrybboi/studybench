"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

const TABS = [
  { href: "/", label: "Home", key: "home" },
  { href: "/educational", label: "Educational", key: "educational" },
  { href: "/web3", label: "Web3", key: "web3" },
  { href: "/ask-ai", label: "Ask AI", key: "ask-ai" },
  { href: "/about", label: "About", key: "about" },
];

function keyFromPath(pathname) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/educational")) return "educational";
  if (pathname.startsWith("/web3")) return "web3";
  if (pathname.startsWith("/ask-ai")) return "ask-ai";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/admin")) return "admin";
  return "";
}

export default function Nav({ active, accent = "brass" }) {
  const pathname = usePathname();
  const { session, loading, isAdmin, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const current = active || keyFromPath(pathname);
  const accentVar = accent === "teal" ? "var(--teal-soft)" : "var(--brass)";
  const accentBorder = accent === "teal" ? "rgba(111,167,154,0.35)" : "rgba(201,162,39,0.35)";
  const next = pathname && pathname !== "/login" ? `?next=${encodeURIComponent(pathname)}` : "";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    await signOut();
    setMenuOpen(false);
  }

  const links = isAdmin
    ? [...TABS, { href: "/admin", label: "Admin", key: "admin" }]
    : TABS;

  return (
    <nav>
      <Link href="/" className="brand" aria-label="StudyBench home">
        <span className="brand-mark" aria-hidden="true">SB</span>
        <span>
          <span className="brand-name">StudyBench</span>
          <span className="brand-tag">Learn · Practice · Grow</span>
        </span>
      </Link>

      <div className="desktop-nav">
        <div className="tabs">
          {links.map((tab) => (
            <Link key={tab.key} href={tab.href} className={`tab ${current === tab.key ? "active" : ""}`}>
              {tab.label}
            </Link>
          ))}
        </div>

        {!loading &&
          (session ? (
            <button className="login-link" onClick={handleSignOut} type="button">
              Sign out
            </button>
          ) : (
            <Link href={`/login${next}`} className="login-link">
              Log in
            </Link>
          ))}
      </div>

      <button
        type="button"
        className="menu-button"
        aria-label="Open navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      {menuOpen && (
        <div className="mobile-panel">
          <div className="mobile-links">
            {links.map((tab) => (
              <Link key={tab.key} href={tab.href} className={`mobile-link ${current === tab.key ? "active" : ""}`}>
                {tab.label}
              </Link>
            ))}
          </div>

          {!loading &&
            (session ? (
              <button className="mobile-auth" onClick={handleSignOut} type="button">
                Sign out
              </button>
            ) : (
              <Link href={`/login${next}`} className="mobile-auth">
                Log in
              </Link>
            ))}
        </div>
      )}

      <style jsx>{`
        nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px clamp(20px, 5vw, 64px);
          background: linear-gradient(180deg, rgba(11, 19, 28, 0.98), rgba(11, 19, 28, 0.92));
          backdrop-filter: blur(8px);
          border-bottom: 1px solid ${accentBorder};
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          min-width: max-content;
        }
        .brand-mark {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 0.82rem;
          color: var(--ink);
          background: var(--parchment);
          border: 2px solid ${accentVar};
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
        .desktop-nav {
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
          font-size: 0.76rem;
          letter-spacing: 0.03em;
          color: var(--fog);
          text-decoration: none;
          padding: 9px 12px;
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
          font-size: 0.76rem;
          text-decoration: none;
          color: var(--parchment);
          border: 1px solid ${accentBorder};
          padding: 8px 15px;
          border-radius: 20px;
          background: transparent;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .login-link:hover {
          background: rgba(201, 162, 39, 0.1);
          border-color: ${accentVar};
        }
        .menu-button {
          display: none;
          width: 42px;
          height: 42px;
          padding: 9px;
          border-radius: 5px;
          border: 1px solid ${accentBorder};
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
        }
        .menu-button span {
          display: block;
          width: 100%;
          height: 2px;
          margin: 4px 0;
          background: var(--parchment);
        }
        .mobile-panel {
          display: none;
        }
        @media (max-width: 960px) {
          nav {
            padding: 14px 18px;
          }
          .desktop-nav {
            display: none;
          }
          .menu-button {
            display: block;
          }
          .mobile-panel {
            position: absolute;
            top: calc(100% + 1px);
            left: 0;
            right: 0;
            display: block;
            padding: 16px 18px 20px;
            background: rgba(11, 19, 28, 0.99);
            border-bottom: 1px solid ${accentBorder};
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.32);
          }
          .mobile-links {
            display: grid;
            gap: 6px;
          }
          .mobile-link,
          .mobile-auth {
            display: block;
            width: 100%;
            text-align: left;
            text-decoration: none;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.84rem;
            color: var(--fog);
            padding: 12px 13px;
            border-radius: 4px;
            border: 1px solid transparent;
            background: transparent;
            cursor: pointer;
          }
          .mobile-link.active {
            color: var(--ink);
            background: ${accentVar};
          }
          .mobile-link:hover,
          .mobile-auth:hover {
            color: var(--parchment);
            border-color: ${accentBorder};
          }
          .mobile-auth {
            margin-top: 12px;
            border-color: ${accentBorder};
            color: var(--parchment);
          }
        }
      `}</style>
    </nav>
  );
}
