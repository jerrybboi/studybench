import Link from "next/link";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const AREAS = [
  {
    href: "/educational",
    label: "Educational",
    title: "Read and study core subjects",
    text: "Mathematics, science, history, government, and more in one focused library.",
    accent: "brass",
  },
  {
    href: "/web3",
    label: "Web3",
    title: "Understand crypto and on-chain ideas",
    text: "Blockchain, DeFi, DAOs, NFTs, wallets, governance, security, and related topics.",
    accent: "teal",
  },
  {
    href: "/ask-ai",
    label: "Ask AI",
    title: "Practice instead of only reading",
    text: "Generate quizzes, flashcards, and worked explanations when you want to test yourself.",
    accent: "brass",
  },
  {
    href: "/about",
    label: "About",
    title: "Why StudyBench exists",
    text: "Learn the idea behind the platform and what StudyBench is growing into.",
    accent: "teal",
  },
];

const HOME_CRITICAL_CSS = `
  .home-shell{overflow:hidden}.home-hero{max-width:1180px;margin:0 auto;padding:clamp(68px,9vw,108px) clamp(20px,5vw,56px) clamp(62px,8vw,92px);display:grid;grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr);gap:clamp(34px,6vw,82px);align-items:center}.home-kicker,.home-section-kicker{font-family:'IBM Plex Mono',monospace;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:#E4C568;margin:0 0 16px}.home-hero h1{margin:0;max-width:720px;font-family:'Fraunces',serif;font-size:clamp(3rem,6.4vw,5.4rem);line-height:.98;font-weight:600;letter-spacing:-.035em;color:#F1E8D6}.home-hero h1 span{display:block;color:#E4C568;font-style:italic;margin-top:8px}.home-copy{max-width:620px;margin:26px 0 0;color:#9FB0C0;font-size:clamp(1rem,1.8vw,1.12rem);line-height:1.75}.home-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}.home-btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:12px 20px;border-radius:4px;text-decoration:none;font-weight:600}.home-btn.primary{background:#C9A227;color:#0B131C;border:1px solid #C9A227}.home-btn.secondary{color:#F1E8D6;border:1px solid rgba(201,162,39,.45);background:rgba(255,255,255,.02)}.home-note{padding:26px;border:1px solid rgba(111,167,154,.28);border-radius:10px;background:linear-gradient(155deg,rgba(63,115,104,.12),rgba(255,255,255,.015));box-shadow:0 20px 55px rgba(0,0,0,.16)}.home-note-label{font-family:'IBM Plex Mono',monospace;font-size:.68rem;letter-spacing:.15em;text-transform:uppercase;color:#6FA79A;margin-bottom:16px}.home-note strong{display:block;font-family:'Fraunces',serif;font-size:clamp(1.45rem,3vw,2rem);line-height:1.18;color:#F1E8D6}.home-note p{margin:14px 0 0;color:#9FB0C0;line-height:1.7}.home-explore{border-top:1px solid rgba(201,162,39,.18);background:rgba(11,19,28,.18)}.home-explore-inner{max-width:1180px;margin:0 auto;padding:clamp(58px,8vw,88px) clamp(20px,5vw,56px) clamp(72px,9vw,108px)}.home-explore-head{display:flex;justify-content:space-between;gap:36px;align-items:end;margin-bottom:30px}.home-explore-head h2{margin:0;font-family:'Fraunces',serif;font-size:clamp(2rem,4vw,3rem);line-height:1.08;font-weight:600;color:#F1E8D6}.home-explore-copy{max-width:520px;margin:0;color:#9FB0C0;line-height:1.7}.home-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.home-card{position:relative;display:flex;flex-direction:column;min-height:248px;padding:26px 26px 24px;border-radius:9px;text-decoration:none;background:rgba(255,255,255,.025);overflow:hidden}.home-card.brass{border:1px solid rgba(201,162,39,.25)}.home-card.teal{border:1px solid rgba(111,167,154,.28)}.home-card-top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:34px}.home-card-label,.home-card-number,.home-card-link{font-family:'IBM Plex Mono',monospace;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase}.home-card.brass .home-card-label,.home-card.brass .home-card-link{color:#E4C568}.home-card.teal .home-card-label,.home-card.teal .home-card-link{color:#6FA79A}.home-card-number{color:rgba(159,176,192,.55)}.home-card h3{margin:0 0 10px;font-family:'Fraunces',serif;font-size:1.48rem;line-height:1.18;color:#F1E8D6}.home-card p{margin:0 0 24px;color:#9FB0C0;line-height:1.62}.home-card-link{margin-top:auto}.home-principle{max-width:1080px;margin:0 auto clamp(70px,9vw,110px);padding:38px clamp(20px,4vw,44px);display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;border-top:1px solid rgba(201,162,39,.24);border-bottom:1px solid rgba(111,167,154,.22)}.home-principle h2{margin:0;font-family:'Fraunces',serif;font-size:clamp(1.9rem,4vw,2.8rem);line-height:1.12;color:#F1E8D6}.home-principle>p{margin:0;color:#9FB0C0;line-height:1.8}@media(max-width:760px){.home-hero{grid-template-columns:1fr;padding:58px 20px 62px;gap:30px}.home-hero h1{font-size:clamp(2.7rem,13vw,4.15rem)}.home-copy{margin-top:20px}.home-actions{width:100%}.home-btn{flex:1 1 145px}.home-note{padding:22px}.home-explore-inner{padding:58px 20px 72px}.home-explore-head{display:block;margin-bottom:24px}.home-explore-copy{margin-top:14px}.home-grid{grid-template-columns:1fr}.home-card{min-height:220px;padding:22px}.home-card-top{margin-bottom:26px}.home-principle{grid-template-columns:1fr;margin-left:20px;margin-right:20px;gap:18px;padding-top:32px;padding-bottom:32px}}`;

export default function HomePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HOME_CRITICAL_CSS }} />
      <Nav active="home" accent="brass" />

      <main className="home-shell">
        <section className="home-hero">
          <div>
            <p className="home-kicker">A digital bench for learning</p>
            <h1>Learn it. Practice it.<span>Understand it.</span></h1>
            <p className="home-copy">One place to read, practice, ask questions, and build real understanding across school subjects and Web3.</p>
            <div className="home-actions">
              <Link href="/educational" className="home-btn primary">Start learning</Link>
              <Link href="/ask-ai" className="home-btn secondary">Open Ask AI</Link>
            </div>
          </div>

          <aside className="home-note">
            <div className="home-note-label">One bench. Plenty to learn.</div>
            <strong>Reading, practice, and help when you need it.</strong>
            <p>StudyBench keeps each part of learning in its own space, so the homepage stays simple and you can go straight where you need to go.</p>
          </aside>
        </section>

        <section className="home-explore">
          <div className="home-explore-inner">
            <div className="home-explore-head">
              <div>
                <p className="home-section-kicker">Explore StudyBench</p>
                <h2>Everything has its place.</h2>
              </div>
              <p className="home-explore-copy">Choose a section and go straight to the kind of learning you need.</p>
            </div>

            <div className="home-grid">
              {AREAS.map((area, index) => (
                <Link href={area.href} key={area.href} className={`home-card ${area.accent}`}>
                  <div className="home-card-top">
                    <span className="home-card-label">{area.label}</span>
                    <span className="home-card-number">0{index + 1}</span>
                  </div>
                  <h3>{area.title}</h3>
                  <p>{area.text}</p>
                  <span className="home-card-link">Open {area.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="home-principle">
          <div>
            <p className="home-section-kicker">The idea</p>
            <h2>AI is a study companion, not the whole product.</h2>
          </div>
          <p>Find something worth learning, work through it, test yourself, then ask for help when you get stuck.</p>
        </section>
      </main>

      <Footer />
    </>
  );
}
