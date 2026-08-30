"use client";

import { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const CATEGORIES = ["All", "Fundamentals", "DeFi", "DAOs", "NFTs", "Compliance"];

const BOOKS = [
  { cat: "Fundamentals", title: "Understanding Blockchain Technology", desc: "How blocks, hashing, and consensus actually work." },
  { cat: "Fundamentals", title: "Introduction to Cryptocurrency", desc: "Wallets, transactions, and the major coins explained." },
  { cat: "Fundamentals", title: "Wallet Types & Security", desc: "Hot vs cold storage, seed phrases, and staying safe." },
  { cat: "DAOs", title: "DAOs: The Future of Organizations", desc: "How decentralized governance actually functions." },
  { cat: "DAOs", title: "The Architecture of Decentralized Governance", desc: "Voting models, proposal lifecycles, and treasuries." },
  { cat: "DAOs", title: "Finding Your DAO Community", desc: "How to evaluate and join a DAO the right way." },
  { cat: "DeFi", title: "What is DeFi?", desc: "Decentralized finance, explained from first principles." },
  { cat: "DeFi", title: "DeFi Lending & Borrowing", desc: "Supplying assets, collateral, and liquidation risk." },
  { cat: "DeFi", title: "Automated Market Makers", desc: "How Uniswap-style pools actually price trades." },
  { cat: "DeFi", title: "Yield Farming: Maximizing Returns", desc: "Strategies, risk tiers, and calculating real APY." },
  { cat: "NFTs", title: "The NFT Revolution", desc: "What actually makes an NFT valuable, beyond the art." },
  { cat: "NFTs", title: "Creating Compelling NFT Art", desc: "Styles, tools, and generative collection design." },
  { cat: "Compliance", title: "Crypto Taxes: What You Need to Know", desc: "Taxable events, cost basis, and common mistakes." },
  { cat: "Compliance", title: "Tools for Crypto Tax Compliance", desc: "Software options and manual record-keeping methods." },
];

export default function Web3Page() {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? BOOKS : BOOKS.filter((b) => b.cat === filter);

  return (
    <>
      <Nav active="web3" accent="teal" />

      <div className="page-head">
        <p className="eyebrow">Web3 wing</p>
        <h1 className="page-title">Crypto &amp; On-Chain Literacy</h1>
        <p className="page-sub">
          Original guides written for this library - covering the fundamentals through advanced DeFi, DAOs, and NFTs. All free, all hosted here.
        </p>
        <div className="filters">
          {CATEGORIES.map((c) => (
            <button key={c} className={`filter ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="note">
        <div className="note-box">
          <strong>New chapters added regularly.</strong> This shelf grows as new guides are written and reviewed - check back often.
        </div>
      </div>

      <div className="catalog">
        {filtered.map((b) => (
          <div className="card" key={b.title}>
            <div className="card-cat">{b.cat}</div>
            <div className="card-title">{b.title}</div>
            <div className="card-desc">{b.desc}</div>
            <div className="card-foot">
              <span className="badge">Free</span>
              <button className="card-btn">Read Now</button>
            </div>
          </div>
        ))}
      </div>

      <Footer />

      <style jsx>{`
        .page-head {
          padding: clamp(48px, 7vw, 72px) clamp(20px, 6vw, 64px) 30px;
          max-width: 1180px;
          margin: 0 auto;
        }
        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--teal-soft);
          margin-bottom: 14px;
        }
        .page-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(2rem, 4vw, 3rem);
          color: var(--parchment);
          margin: 0 0 14px;
        }
        .page-sub {
          max-width: 600px;
          font-size: 1rem;
          line-height: 1.6;
          color: var(--fog);
          margin: 0 0 30px;
        }
        .filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 44px;
        }
        :global(.filter) {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.76rem;
          padding: 8px 15px;
          border-radius: 20px;
          border: 1px solid rgba(111, 167, 154, 0.3);
          color: var(--fog);
          cursor: pointer;
          background: transparent;
        }
        :global(.filter.active) {
          background: var(--teal-soft);
          color: var(--ink);
          border-color: var(--teal-soft);
          font-weight: 500;
        }
        .note {
          max-width: 1180px;
          margin: 0 auto 40px;
          padding: 0 clamp(20px, 6vw, 64px);
        }
        .note-box {
          background: rgba(111, 167, 154, 0.08);
          border: 1px solid rgba(111, 167, 154, 0.2);
          border-radius: 8px;
          padding: 16px 20px;
          font-size: 0.85rem;
          color: var(--fog);
          max-width: 640px;
        }
        .note-box :global(strong) {
          color: var(--teal-soft);
        }
        .catalog {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 clamp(20px, 6vw, 64px) 80px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 22px;
        }
        .card {
          background: linear-gradient(155deg, #152c27, #0f1f1b);
          border: 1px solid rgba(111, 167, 154, 0.16);
          border-radius: 8px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.35);
        }
        .card-cat {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--teal-soft);
        }
        .card-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.15rem;
          color: var(--parchment);
          line-height: 1.25;
        }
        .card-desc {
          font-size: 0.85rem;
          line-height: 1.5;
          color: var(--fog);
          flex: 1;
        }
        .card-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 6px;
        }
        .badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.05em;
          padding: 4px 9px;
          border-radius: 2px;
          text-transform: uppercase;
          background: rgba(111, 167, 154, 0.18);
          color: var(--teal-soft);
        }
        .card-btn {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 3px;
          border: none;
          cursor: pointer;
          background: var(--teal-soft);
          color: var(--ink);
        }
      `}</style>
    </>
  );
}
