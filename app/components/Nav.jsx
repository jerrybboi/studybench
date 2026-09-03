"use client";

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
  const current = active || keyFromPath(pathname);
  const accentVar = accent === "teal" ? "var(--teal-soft)" : "var(--brass)";
  const accentBorder = accent === "teal" ? "rgba(111,167,154,0.35)" : "rgba(201,162,39,0.35)";
  const next = pathname && pathname !== "/login" ? `?next=${encodeURIComponent(pathname)}` : "";

  return (
    <nav>
      <Link href="/" className="brand" aria-label="StudyBench home">
        <span className="brand-mark" aria-hidden="true">SB</span>
        <span>
          <span className="brand-name">StudyBench</span>
          <span className="brand-tag">Learn · Practice · Grow</span>
        </span>
      </Link>

      <div className="nav-right">
        <div className="tabs">
          {TABS.map((tab) => (
            <Link key={tab.key} href={tab.href} className={`tab ${current === tab.key ? "active" : ""}`}>
              {tab.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className={`tab ${current === "admin" ? "active" : ""}`}>
              Admin
            </Link>
          )}
        </div>

        {!loading &&
          (session ? (
            <button className="login-link" onClick={signOut} type="button">
              Sign out
            </button>
          ) : (
            <Link href={`/login${next}`} className="login-link">
              Log in
            </Link>
          ))}
      </div>

      <style jsx>{`
        nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
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
          padding: 9px 14px;
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
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .login-link:hover {
          background: rgba(201, 162, 39, 0.1);
          border-color: ${accentVar};
        }
        @media (max-width: 900px) {
          .tabs {
            display: none;
          }
          nav {
            padding: 16px 20px;
          }
        }
      `}</style>
    </nav>
  );
}
