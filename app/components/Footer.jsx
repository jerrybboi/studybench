import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-brand">StudyBench</div>
      <div className="footer-links">
        <Link href="/">Home</Link>
        <Link href="/educational">Educational</Link>
        <Link href="/web3">Web3</Link>
        <Link href="/ask-ai">Ask AI</Link>
        <Link href="/about">About</Link>
      </div>
      <div className="foot-note">Built for thinkers.</div>

      <style jsx>{`
        footer {
          padding: 40px clamp(20px, 6vw, 64px) 50px;
          text-align: center;
          color: var(--fog);
          font-size: 0.82rem;
          border-top: 1px solid rgba(201, 162, 39, 0.12);
        }
        .footer-brand {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          color: var(--parchment);
          font-size: 1rem;
        }
        .footer-links {
          display: flex;
          gap: 22px;
          justify-content: center;
          margin: 16px 0;
          flex-wrap: wrap;
        }
        .footer-links :global(a) {
          color: var(--fog);
          text-decoration: none;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.74rem;
        }
        .footer-links :global(a:hover) {
          color: var(--brass-soft);
        }
        .foot-note {
          opacity: 0.6;
          font-family: 'IBM Plex Mono', monospace;
        }
      `}</style>
    </footer>
  );
}
