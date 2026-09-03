"use client";

import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <>
      <Nav active="about" accent="brass" />

      <main className="wrap">
        <section className="intro">
          <p className="eyebrow">About StudyBench</p>
          <h1>Built from the need to learn better.</h1>
          <p className="lede">
            Studying is scattered by default: notes, resources, practice questions, and hard topics you&apos;re left to
            untangle alone. StudyBench exists to make that a little simpler, with one place to read, practice, ask,
            test yourself, and actually understand.
          </p>
        </section>

        <section className="founder-card" aria-labelledby="founder-title">
          <div className="founder-image-wrap">
            <img className="founder-image" src="/jerry-boi-founder.webp" alt="Jerry Boi, founder of StudyBench" />
          </div>

          <div className="founder-copy">
            <p className="founder-kicker">The person behind StudyBench</p>
            <h2 id="founder-title">Jerry Boi</h2>
            <p className="founder-role">Founder · Student · Builder</p>
            <p>
              I&apos;m a student and builder who&apos;s always been curious about what technology can make possible, from
              software and AI to Web3. I wanted to build something of my own, not just another project sitting in a
              repository. StudyBench became that.
            </p>
            <p>
              I built it from the perspective of someone who knows what it&apos;s like to stare at a hard problem and
              think: <em>okay, where do I even start?</em> I&apos;m building something I&apos;d genuinely want to use myself.
            </p>

            <a className="x-button" href="https://x.com/dfw_jerryboi" target="_blank" rel="noopener noreferrer" aria-label="Follow Jerry Boi on X">
              <span className="x-mark">𝕏</span>
              <span><strong>Follow on X</strong><small>@dfw_jerryboi</small></span>
              <span className="arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="content-section">
          <p className="section-kicker">The philosophy</p>
          <h2>Learn. Practice. Understand.</h2>
          <p>StudyBench is built around three simple ideas.</p>
          <div className="pillars">
            <article><span>01</span><h3>Learn</h3><p>Break difficult subjects into something easier to approach.</p></article>
            <article><span>02</span><h3>Practice</h3><p>Don&apos;t just read the answer. Try the problem yourself.</p></article>
            <article><span>03</span><h3>Understand</h3><p>Use explanations and worked solutions to see why something works.</p></article>
          </div>
        </section>

        <section className="split-section"><div><p className="section-kicker">Why AI?</p><h2>A study companion, not a shortcut.</h2></div><p>StudyBench uses AI to generate practice questions, build flashcards, and explain problems, but the learner should still be doing the thinking. The goal is practice and interaction, not simply handing over an answer.</p></section>
        <section className="split-section"><div><p className="section-kicker">The bigger idea</p><h2>One bench. Plenty to learn.</h2></div><p>StudyBench started with academics, but the idea is bigger than one subject. Mathematics, science, technology, finance, and Web3 all have something worth learning. The long-term goal is one place where all of it can live together without making learning feel complicated.</p></section>

        <blockquote className="quote-block"><p>“I didn&apos;t build StudyBench because I had everything figured out. I built it because I&apos;m still figuring things out too. And I think that&apos;s exactly who learning is for.”</p><cite>Jerry Boi, Founder of StudyBench</cite></blockquote>
      </main>

      <Footer />

      <style jsx>{`
        .wrap{width:min(1120px,calc(100% - 40px));margin:0 auto;padding:clamp(60px,8vw,96px) 0 clamp(72px,10vw,120px)}
        .intro{max-width:820px;margin-bottom:clamp(48px,7vw,78px)}
        .eyebrow,.section-kicker,.founder-kicker{margin:0 0 14px;font-family:'IBM Plex Mono',monospace;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--brass-soft)}
        h1,h2,h3{font-family:'Fraunces',serif;color:var(--parchment)}
        h1{margin:0;font-size:clamp(2.65rem,6vw,5rem);line-height:1;letter-spacing:-.035em;font-weight:600}
        .lede{max-width:760px;margin:24px 0 0;color:var(--fog);font-size:clamp(1rem,1.6vw,1.12rem);line-height:1.8}
        .founder-card{display:grid;grid-template-columns:minmax(300px,.9fr) minmax(0,1.1fr);gap:clamp(32px,6vw,72px);align-items:center;padding:clamp(22px,3vw,34px);border:1px solid rgba(201,162,39,.32);border-radius:16px;background:linear-gradient(145deg,rgba(201,162,39,.08),rgba(255,255,255,.018));box-shadow:0 28px 80px rgba(0,0,0,.2)}
        .founder-image-wrap{overflow:hidden;border-radius:12px;border:1px solid rgba(201,162,39,.42);background:#05090d;aspect-ratio:1/1}
        .founder-image{display:block;width:100%;height:100%;object-fit:cover}
        .founder-copy h2{margin:0;font-size:clamp(2.5rem,5vw,4.6rem);line-height:1;letter-spacing:-.03em;font-weight:600}
        .founder-role{margin:12px 0 24px;color:var(--brass-soft);font-family:'IBM Plex Mono',monospace;font-size:.76rem;letter-spacing:.08em;text-transform:uppercase}
        .founder-copy>p:not(.founder-kicker):not(.founder-role){margin:0 0 16px;color:var(--fog);line-height:1.75}
        .x-button{display:flex;align-items:center;gap:14px;width:min(100%,390px);margin-top:26px;padding:14px 16px;border:1px solid rgba(201,162,39,.7);border-radius:9px;color:var(--ink);background:linear-gradient(100deg,#c9a227,#e4c568);text-decoration:none;transition:transform .18s ease,box-shadow .18s ease}
        .x-button:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(201,162,39,.18)}
        .x-mark{display:grid;place-items:center;width:46px;height:46px;flex:0 0 46px;border-radius:8px;background:var(--ink);color:var(--brass-soft);font-size:1.5rem}
        .x-button strong,.x-button small{display:block}.x-button strong{font-size:.98rem}.x-button small{margin-top:2px;opacity:.78;font-size:.78rem}.arrow{margin-left:auto;font-size:1.2rem}
        .content-section{padding:clamp(70px,9vw,108px) 0 28px}.content-section>h2,.split-section h2{margin:0;font-size:clamp(2rem,4vw,3.2rem);line-height:1.08;font-weight:600}.content-section>p:not(.section-kicker){color:var(--fog);line-height:1.75}
        .pillars{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:28px}.pillars article{min-height:210px;padding:24px;border:1px solid rgba(111,167,154,.25);border-radius:10px;background:rgba(255,255,255,.022)}.pillars span{font-family:'IBM Plex Mono',monospace;font-size:.7rem;color:var(--brass-soft)}.pillars h3{margin:34px 0 10px;font-size:1.55rem}.pillars p{margin:0;color:var(--fog);line-height:1.65}
        .split-section{display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(28px,6vw,72px);align-items:start;margin-top:70px;padding:38px 0;border-top:1px solid rgba(201,162,39,.2)}.split-section>p{margin:0;color:var(--fog);line-height:1.8}
        .quote-block{margin:64px 0 0;padding:clamp(28px,5vw,48px);border-left:3px solid var(--brass);background:rgba(201,162,39,.055)}.quote-block p{margin:0;font-family:'Fraunces',serif;color:var(--parchment);font-size:clamp(1.35rem,2.6vw,2rem);line-height:1.45}.quote-block cite{display:block;margin-top:18px;color:var(--brass-soft);font-family:'IBM Plex Mono',monospace;font-size:.74rem;font-style:normal;letter-spacing:.08em;text-transform:uppercase}
        @media(max-width:760px){.wrap{width:min(100% - 32px,1120px);padding-top:48px}.founder-card{grid-template-columns:1fr;padding:18px}.founder-image-wrap{max-width:520px;width:100%;margin:0 auto}.pillars{grid-template-columns:1fr}.pillars article{min-height:0}.pillars h3{margin-top:18px}.split-section{grid-template-columns:1fr;gap:18px;margin-top:48px}.x-button{width:100%}}
      `}</style>
    </>
  );
}
