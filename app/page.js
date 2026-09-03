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

      <main className="hp-main">
        <section className="hp-hero">
          <p className="hp-eyebrow">A digital bench for learning</p>
          <h1>
            Learn it. Practice it.
            <span>Understand it.</span>
          </h1>
          <p className="hp-hero-copy">
            One place to read, practice, ask questions, and build real understanding across school subjects and Web3.
          </p>
          <div className="hp-hero-actions">
            <Link href="/educational" className="hp-primary-btn">Start learning</Link>
            <Link href="/ask-ai" className="hp-secondary-btn">Open Ask AI</Link>
          </div>
        </section>

        <section className="hp-intro">
          <p className="hp-section-kicker">Explore StudyBench</p>
          <h2>Everything has its place.</h2>
          <p className="hp-section-copy">
            Pick a section and go straight to the kind of learning you need. Each part of StudyBench has its own focused space.
          </p>

          <div className="hp-area-grid">
            {AREAS.map((area, index) => (
              <Link
                href={area.href}
                key={area.href}
                className={`hp-area-card ${area.accent === "teal" ? "hp-teal" : "hp-brass"}`}
              >
                <div className="hp-card-number">0{index + 1}</div>
                <div className="hp-card-label">{area.label}</div>
                <h3>{area.title}</h3>
                <p>{area.text}</p>
                <span className="hp-card-link">Open {area.label} →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="hp-principle">
          <div>
            <p className="hp-section-kicker">The idea</p>
            <h2>AI is a study companion, not the whole product.</h2>
          </div>
          <p>
            StudyBench is built around a simple flow: find something worth learning, work through it, test yourself, then ask for help when you get stuck.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
