"use client";

import Link from "next/link";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const EDU_BOOKS = [
  { cat: "Mathematics", title: "Calculus & Linear Algebra", badge: "Free · Read Now" },
  { cat: "Physics", title: "University Physics", badge: "Free · Read Now" },
  { cat: "Biology", title: "Concepts of Biology", badge: "Free · Read Now" },
  { cat: "Chemistry", title: "General Chemistry", badge: "Free · Read Now" },
  { cat: "Government", title: "American Government", badge: "Free · Read Now" },
  { cat: "History", title: "World History, Vol. 1", badge: "Buy · Amazon" },
];

const WEB3_BOOKS = [
  { cat: "Fundamentals", title: "Understanding Blockchain", badge: "Free · Original" },
  { cat: "Fundamentals", title: "Intro to Cryptocurrency", badge: "Free · Original" },
  { cat: "Governance", title: "DAOs & Decentralized Voting", badge: "Free · Original" },
  { cat: "DeFi", title: "What is DeFi? A Field Guide", badge: "Free · Original" },
  { cat: "NFTs", title: "The NFT Revolution", badge: "Free · Original" },
  { cat: "Compliance", title: "Crypto Taxes Explained", badge: "Free · Original" },
];

export default function HomePage() {
  return (
    <>
      <Nav active="home" accent="brass" />

      <header className="hero">
        <div className="seal">
          <img src="/logo.jpg" alt="StudyBench" />
        </div>
        <p className="eyebrow">A library for two kinds of literacy</p>
        <h1 className="hero-title">
          Study what&apos;s taught.
          <br />
          <em>Understand</em> what&apos;s next.
        </h1>
        <p className="hero-sub">
          Free educational texts, a growing shelf on crypto &amp; Web3 - read straight from the site - plus an AI tutor that answers questions from either side of the room.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/ask-ai">
            Ask the AI something →
          </Link>
          <Link className="btn btn-ghost" href="/educational">
            Browse the shelves
          </Link>
        </div>
      </header>

      <section className="wing wing-edu">
        <div className="wing-head">
          <div>
            <p className="wing-eyebrow">Educational wing</p>
            <h2 className="wing-title">Math, science &amp; the core subjects</h2>
          </div>
          <Link className="wing-link" href="/educational">
            View all subjects →
          </Link>
        </div>
        <div className="shelf-row">
          {EDU_BOOKS.map((b, i) => (
            <Link key={b.title} className={`book b${(i % 4) + 1}`} href="/educational">
              <div>
                <div className="book-cat">{b.cat}</div>
                <div className="book-title">{b.title}</div>
              </div>
              <span className="book-free">{b.badge}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wing wing-web3">
        <div className="wing-head">
          <div>
            <p className="wing-eyebrow">Web3 wing</p>
            <h2 className="wing-title">Crypto, DeFi &amp; on-chain literacy</h2>
          </div>
          <Link className="wing-link" href="/web3">
            View all topics →
          </Link>
        </div>
        <div className="shelf-row">
          {WEB3_BOOKS.map((b, i) => (
            <Link key={b.title} className={`book w${(i % 4) + 1}`} href="/web3">
              <div>
                <div className="book-cat">{b.cat}</div>
                <div className="book-title">{b.title}</div>
              </div>
              <span className="book-free">{b.badge}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="ai-strip">
        <div className="ai-copy">
          <p className="ai-eyebrow">The reading desk</p>
          <h3 className="ai-title">One AI. Every subject on the shelf.</h3>
          <p className="ai-sub">
            Quiz yourself on derivatives, then ask what impermanent loss means - same tool, same tab, no context switch. 25 free questions a day, unlock unlimited any time.
          </p>
        </div>
        <Link className="btn btn-primary" href="/ask-ai">
          Open Ask AI →
        </Link>
      </section>

      <Footer />

      <style jsx>{`
        .hero {
          position: relative;
          padding: clamp(64px, 10vw, 110px) clamp(20px, 6vw, 64px) clamp(70px, 9vw, 100px);
          text-align: center;
          overflow: hidden;
        }
        .hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 900px 500px at 50% 0%, rgba(201, 162, 39, 0.1), transparent 60%),
            linear-gradient(180deg, var(--ink) 0%, var(--ink-deep) 100%);
          z-index: -1;
        }
        .seal {
          width: 130px;
          height: 130px;
          margin: 0 auto 22px;
        }
        .seal img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--brass-soft);
          margin-bottom: 18px;
        }
        .hero-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(2.3rem, 5.2vw, 4rem);
          line-height: 1.08;
          color: var(--parchment);
          margin: 0 0 22px;
          letter-spacing: -0.01em;
        }
        .hero-title :global(em) {
          font-style: italic;
          color: var(--brass-soft);
          font-weight: 500;
        }
        .hero-sub {
          max-width: 560px;
          margin: 0 auto 38px;
          font-size: 1.06rem;
          line-height: 1.65;
          color: var(--fog);
        }
        .hero-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        :global(.btn) {
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 13px 26px;
          border-radius: 3px;
          text-decoration: none;
          display: inline-block;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          border: none;
          cursor: pointer;
        }
        :global(.btn-primary) {
          background: var(--brass);
          color: var(--ink);
        }
        :global(.btn-primary:hover) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(201, 162, 39, 0.25);
        }
        :global(.btn-ghost) {
          border: 1px solid rgba(159, 176, 192, 0.35);
          color: var(--parchment);
          background: transparent;
        }
        :global(.btn-ghost:hover) {
          border-color: var(--teal-soft);
          color: var(--teal-soft);
        }

        .wing {
          padding: clamp(56px, 8vw, 80px) clamp(20px, 6vw, 64px);
        }
        .wing-edu {
          background: var(--ink);
        }
        .wing-web3 {
          background: #0f1e1b;
        }
        .wing-head {
          max-width: 1180px;
          margin: 0 auto 34px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .wing-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .wing-edu .wing-eyebrow {
          color: var(--brass-soft);
        }
        .wing-web3 .wing-eyebrow {
          color: var(--teal-soft);
        }
        .wing-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(1.5rem, 3vw, 2.1rem);
          color: var(--parchment);
          margin: 0;
        }
        .wing-link {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
          text-decoration: none;
          white-space: nowrap;
          padding-bottom: 2px;
          border-bottom: 1px solid currentColor;
        }
        .wing-edu .wing-link {
          color: var(--brass-soft);
        }
        .wing-web3 .wing-link {
          color: var(--teal-soft);
        }

        .shelf-row {
          max-width: 1180px;
          margin: 0 auto;
          position: relative;
          display: flex;
          gap: 22px;
          overflow-x: auto;
          padding: 10px 4px 34px;
          scrollbar-width: none;
        }
        .shelf-row::-webkit-scrollbar {
          display: none;
        }
        :global(.book) {
          flex: 0 0 148px;
          height: 210px;
          border-radius: 3px 6px 6px 3px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 16px 14px;
          position: relative;
          cursor: pointer;
          transform: rotate(-2.5deg);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 3px 6px 14px rgba(0, 0, 0, 0.4);
          text-decoration: none;
        }
        :global(.book:nth-child(2n)) {
          transform: rotate(1.8deg);
        }
        :global(.book:nth-child(3n)) {
          transform: rotate(-1.2deg);
        }
        :global(.book:nth-child(4n)) {
          transform: rotate(2.4deg);
        }
        :global(.book:hover) {
          transform: rotate(0deg) translateY(-6px);
          box-shadow: 5px 14px 26px rgba(0, 0, 0, 0.5);
        }
        :global(.book::before) {
          content: "";
          position: absolute;
          left: 10px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(255, 255, 255, 0.18);
        }
        :global(.book-cat) {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0.75;
        }
        :global(.book-title) {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 0.98rem;
          line-height: 1.22;
        }
        :global(.book-free) {
          align-self: flex-start;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.06em;
          padding: 3px 7px;
          border-radius: 2px;
          text-transform: uppercase;
        }
        :global(.b1) {
          background: linear-gradient(155deg, #3a2e17, #2a2110);
          color: var(--parchment);
        }
        :global(.b2) {
          background: linear-gradient(155deg, #4a3a1a, #33280f);
          color: var(--parchment);
        }
        :global(.b3) {
          background: linear-gradient(155deg, #5b4620, #3e3013);
          color: var(--parchment);
        }
        :global(.b4) {
          background: linear-gradient(155deg, #33260f, #231a0a);
          color: var(--parchment);
        }
        :global(.b1 .book-free),
        :global(.b2 .book-free),
        :global(.b3 .book-free),
        :global(.b4 .book-free) {
          background: rgba(201, 162, 39, 0.22);
          color: var(--brass-soft);
        }
        :global(.w1) {
          background: linear-gradient(155deg, #1b3a34, #122824);
          color: var(--parchment);
        }
        :global(.w2) {
          background: linear-gradient(155deg, #204840, #16302b);
          color: var(--parchment);
        }
        :global(.w3) {
          background: linear-gradient(155deg, #0f2c27, #0a1e1a);
          color: var(--parchment);
        }
        :global(.w4) {
          background: linear-gradient(155deg, #274f46, #1a362f);
          color: var(--parchment);
        }
        :global(.w1 .book-free),
        :global(.w2 .book-free),
        :global(.w3 .book-free),
        :global(.w4 .book-free) {
          background: rgba(111, 167, 154, 0.22);
          color: var(--teal-soft);
        }

        .ai-strip {
          padding: clamp(44px, 7vw, 64px) clamp(20px, 6vw, 64px);
          background: linear-gradient(120deg, #1b2c22, #16202c);
          border-top: 1px solid rgba(201, 162, 39, 0.12);
          border-bottom: 1px solid rgba(201, 162, 39, 0.12);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .ai-copy {
          max-width: 520px;
        }
        .ai-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--brass-soft);
          margin-bottom: 10px;
        }
        .ai-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(1.4rem, 2.6vw, 1.9rem);
          color: var(--parchment);
          margin: 0 0 10px;
        }
        .ai-sub {
          font-size: 0.92rem;
          line-height: 1.55;
          color: var(--fog);
          margin: 0;
        }
      `}</style>
    </>
  );
}
