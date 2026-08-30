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
          <img className="portrait" src="data:image/jpeg;base64,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" alt="Founder of StudyBench" />
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
