"use client";

import Link from "next/link";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const AREAS = [
  {
    href: "/educational",
    label: "Educational",
    title: "Read and study core subjects",
    text: "Browse learning materials across mathematics, science, history, government, and more.",
    accent: "brass",
  },
  {
    href: "/web3",
    label: "Web3",
    title: "Understand crypto and on-chain ideas",
    text: "Learn blockchain, DeFi, DAOs, NFTs, wallets, governance, security, and related topics.",
    accent: "teal",
  },
  {
    href: "/ask-ai",
    label: "Ask AI",
    title: "Practice instead of only reading",
    text: "Generate quizzes, flashcards, and worked explanations when you want to test what you know.",
    accent: "brass",
  },
  {
    href: "/about",
    label: "About",
    title: "Why StudyBench exists",
    text: "See the idea behind the platform, how it approaches learning, and what it is growing into.",
    accent: "teal",
  },
];

export default function HomePage() {
  return (
    <>
      <Nav active="home" accent="brass" />

      <main>
        <section className="hero">
          <p className="eyebrow">A digital bench for learning</p>
          <h1>
            Learn it. Practice it.
            <span>Understand it.</span>
          </h1>
          <p className="hero-copy">
            One place to read, practice, ask questions, and build real understanding across school subjects and Web3.
          </p>
          <div className="hero-actions">
            <Link href="/educational" className="primary-btn">
              Start learning
            </Link>
            <Link href="/ask-ai" className="secondary-btn">
              Open Ask AI
            </Link>
          </div>
        </section>

        <section className="intro">
          <p className="section-kicker">Explore StudyBench</p>
          <h2>Everything has its place.</h2>
          <p className="section-copy">
            Pick a section and go straight to the kind of learning you need. Each part of StudyBench has its own focused space.
          </p>

          <div className="area-grid">
            {AREAS.map((area, index) => (
              <Link
                href={area.href}
                key={area.href}
                className={`area-card ${area.accent === "teal" ? "teal" : "brass"}`}
              >
                <div className="card-number">0{index + 1}</div>
                <div className="card-label">{area.label}</div>
                <h3>{area.title}</h3>
                <p>{area.text}</p>
                <span className="card-link">Open {area.label} →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="principle">
          <div>
            <p className="section-kicker">The idea</p>
            <h2>AI is a study companion, not the whole product.</h2>
          </div>
          <p>
            StudyBench is built around a simple flow: find something worth learning, work through it, test yourself, then ask for help when you get stuck.
          </p>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        main {
          overflow: hidden;
        }
        .hero {
          min-height: 68vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: clamp(70px, 10vw, 120px) 20px clamp(68px, 9vw, 110px);
          background:
            radial-gradient(circle at 50% 18%, rgba(201, 162, 39, 0.13), transparent 32%),
            radial-gradient(circle at 80% 70%, rgba(63, 115, 104, 0.12), transparent 30%);
          border-bottom: 1px solid rgba(201, 162, 39, 0.18);
        }
        .eyebrow,
        .section-kicker {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--brass-soft);
          margin: 0 0 16px;
        }
        .hero h1 {
          max-width: 820px;
          margin: 0;
          font-family: 'Fraunces', serif;
          font-size: clamp(2.8rem, 7vw, 5.6rem);
          line-height: 0.98;
          font-weight: 600;
          color: var(--parchment);
          letter-spacing: -0.035em;
        }
        .hero h1 span {
          display: block;
          color: var(--brass-soft);
          font-style: italic;
          margin-top: 8px;
        }
        .hero-copy {
          max-width: 650px;
          margin: 28px auto 0;
          color: var(--fog);
          font-size: clamp(1rem, 2vw, 1.12rem);
          line-height: 1.75;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 34px;
        }
        .primary-btn,
        .secondary-btn {
          text-decoration: none;
          padding: 13px 22px;
          border-radius: 4px;
          font-weight: 600;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }
        .primary-btn {
          background: var(--brass);
          color: var(--ink-deep);
          border: 1px solid var(--brass);
        }
        .secondary-btn {
          color: var(--parchment);
          border: 1px solid rgba(201, 162, 39, 0.45);
          background: rgba(255, 255, 255, 0.02);
        }
        .primary-btn:hover,
        .secondary-btn:hover {
          transform: translateY(-2px);
        }
        .intro {
          max-width: 1180px;
          margin: 0 auto;
          padding: clamp(64px, 8vw, 100px) clamp(20px, 5vw, 48px);
        }
        .intro > h2,
        .principle h2 {
          margin: 0;
          font-family: 'Fraunces', serif;
          color: var(--parchment);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 600;
        }
        .section-copy {
          max-width: 680px;
          margin: 16px 0 36px;
          font-size: 1rem;
          line-height: 1.75;
          color: var(--fog);
        }
        .area-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .area-card {
          position: relative;
          min-height: 280px;
          padding: 30px;
          text-decoration: none;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.025);
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .area-card.brass {
          border: 1px solid rgba(201, 162, 39, 0.26);
        }
        .area-card.teal {
          border: 1px solid rgba(111, 167, 154, 0.28);
        }
        .area-card:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.045);
        }
        .card-number {
          position: absolute;
          top: 22px;
          right: 24px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          color: rgba(159, 176, 192, 0.55);
        }
        .card-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }
        .brass .card-label,
        .brass .card-link {
          color: var(--brass-soft);
        }
        .teal .card-label,
        .teal .card-link {
          color: var(--teal-soft);
        }
        .area-card h3 {
          max-width: 430px;
          margin: 0 0 12px;
          color: var(--parchment);
          font-family: 'Fraunces', serif;
          font-size: 1.55rem;
          font-weight: 600;
        }
        .area-card p {
          max-width: 500px;
          color: var(--fog);
          line-height: 1.65;
          margin: 0 0 32px;
        }
        .card-link {
          position: absolute;
          left: 30px;
          bottom: 28px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
        }
        .principle {
          max-width: 1080px;
          margin: 0 auto clamp(70px, 9vw, 110px);
          padding: 40px clamp(20px, 4vw, 46px);
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 44px;
          align-items: center;
          border-top: 1px solid rgba(201, 162, 39, 0.25);
          border-bottom: 1px solid rgba(111, 167, 154, 0.22);
        }
        .principle p:last-child {
          margin: 0;
          color: var(--fog);
          font-size: 1rem;
          line-height: 1.8;
        }
        @media (max-width: 760px) {
          .hero {
            min-height: auto;
          }
          .area-grid,
          .principle {
            grid-template-columns: 1fr;
          }
          .area-card {
            min-height: 265px;
          }
          .principle {
            margin-left: 20px;
            margin-right: 20px;
            gap: 20px;
          }
        }
      `}</style>
    </>
  );
}
