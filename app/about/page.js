"use client";

import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <>
      <Nav active="about" accent="brass" />

      <div className="wrap">
        <div className="intro">
          <p className="eyebrow">About StudyBench</p>
          <h1 className="title">Built from the need to learn better.</h1>
          <p className="lede">
            Studying is scattered by default: notes, resources, practice questions, and hard topics you&apos;re left to
            untangle alone. StudyBench exists to make that a little simpler - one place to practice, ask, test yourself,
            and actually understand.
          </p>
        </div>

        <div className="portrait-block">
          <img className="portrait" src="/founder.jpg" alt="Founder of StudyBench" />
          <div>
            <p className="portrait-name">The person behind it</p>
            <p className="portrait-role">Student · Builder</p>
          </div>
        </div>

        <p className="body-text">
          I&apos;m a student and builder who&apos;s always been curious about what technology can make possible - from
          software and AI to Web3. I wanted to build something of my own, not just another project sitting in a
          repository. StudyBench became that.
        </p>
        <p className="body-text">
          I built it from the perspective of someone who knows what it&apos;s like to stare at a hard problem and
          think: <em>okay, where do I even start?</em> I&apos;m not trying to build the world&apos;s biggest
          education platform overnight. I&apos;m building something I&apos;d genuinely want to use myself.
        </p>

        <h2 className="section-title">Learn. Practice. Understand.</h2>
        <p className="body-text">StudyBench is built around three simple ideas.</p>
        <div className="pillars">
          <div className="pillar">
            <div className="pillar-title">Learn</div>
            <div className="pillar-desc">Break difficult subjects into something easier to approach.</div>
          </div>
          <div className="pillar">
            <div className="pillar-title">Practice</div>
            <div className="pillar-desc">Don&apos;t just read the answer. Try the problem yourself.</div>
          </div>
          <div className="pillar">
            <div className="pillar-title">Understand</div>
            <div className="pillar-desc">Use explanations and worked solutions to see why something works.</div>
          </div>
        </div>

        <h2 className="section-title">Why AI?</h2>
        <p className="body-text">
          AI is useful as a learning tool, not a shortcut. StudyBench uses it to generate practice questions, build
          flashcards, and explain problems - but the student should still be doing the thinking. That&apos;s why the
          site is built around practice and interaction, not just handing you an answer.
        </p>

        <h2 className="section-title">The bigger idea</h2>
        <p className="body-text">
          StudyBench started with academics, but the idea is bigger than one subject. Mathematics, physics,
          technology, finance, Web3 - there&apos;s always something worth learning. The long-term goal is one place
          where all of it can live together without making learning feel complicated. One bench. Plenty to learn.
        </p>

        <div className="quote-block">
          <p className="quote-text">
            &quot;I didn&apos;t build StudyBench because I had everything figured out. I built it because I&apos;m
            still figuring things out too. And I think that&apos;s exactly who learning is for.&quot;
          </p>
          <p className="quote-attr">- The founder of StudyBench</p>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .wrap {
          max-width: 680px;
          margin: 0 auto;
          padding: clamp(50px, 8vw, 80px) clamp(20px, 6vw, 64px) 100px;
        }
        .intro {
          text-align: center;
          margin-bottom: 56px;
        }
        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--brass-soft);
          margin-bottom: 16px;
        }
        .title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(1.8rem, 3.6vw, 2.4rem);
          color: var(--parchment);
          margin: 0 0 14px;
        }
        .lede {
          font-size: 1.02rem;
          line-height: 1.7;
          color: var(--fog);
          max-width: 520px;
          margin: 0 auto;
        }
        .portrait-block {
          display: flex;
          align-items: center;
          gap: 22px;
          margin: 44px 0 20px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(201, 162, 39, 0.15);
          border-radius: 12px;
        }
        .portrait {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--brass);
          flex-shrink: 0;
        }
        .portrait-name {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--parchment);
          margin: 0 0 4px;
        }
        .portrait-role {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          color: var(--brass-soft);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .section-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.35rem;
          color: var(--parchment);
          margin: 44px 0 14px;
        }
        .body-text {
          font-size: 0.98rem;
          line-height: 1.75;
          color: var(--fog);
          margin: 0 0 14px;
        }
        .body-text :global(em) {
          font-style: italic;
          color: var(--brass-soft);
        }
        .pillars {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin: 24px 0 8px;
        }
        .pillar {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(201, 162, 39, 0.15);
          border-radius: 8px;
          padding: 18px 14px;
          text-align: center;
        }
        .pillar-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          color: var(--brass-soft);
          font-size: 1rem;
          margin-bottom: 6px;
        }
        .pillar-desc {
          font-size: 0.8rem;
          color: var(--fog);
          line-height: 1.5;
        }
        @media (max-width: 560px) {
          .pillars {
            grid-template-columns: 1fr;
          }
        }
        .quote-block {
          margin: 48px 0;
          padding: 26px 28px;
          border-left: 2px solid var(--brass);
          background: rgba(201, 162, 39, 0.05);
          border-radius: 0 8px 8px 0;
        }
        .quote-text {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 1.1rem;
          color: var(--parchment);
          line-height: 1.6;
          margin: 0 0 12px;
        }
        .quote-attr {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.76rem;
          color: var(--brass-soft);
        }
      `}</style>
    </>
  );
}
