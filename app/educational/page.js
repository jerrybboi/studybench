"use client";

import { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const CATEGORIES = ["All", "Mathematics", "Physics", "Biology", "Chemistry", "History", "Government"];

const BOOKS = [
  { cat: "Mathematics", title: "Calculus Volume 1", desc: "Limits, derivatives, integrals - the full first-year sequence, openly licensed.", free: true },
  { cat: "Mathematics", title: "Introduction to Linear Algebra", desc: "Vectors, matrices, and transformations for beginning students.", free: true },
  { cat: "Physics", title: "University Physics Vol. 1", desc: "Mechanics, waves, and thermodynamics with worked examples.", free: true },
  { cat: "Biology", title: "Concepts of Biology", desc: "A full introductory course covering cells to ecosystems.", free: true },
  { cat: "Chemistry", title: "General Chemistry", desc: "Atomic structure through reaction kinetics, university level.", free: true },
  { cat: "Government", title: "American Government 3e", desc: "Institutions, civil liberties, and the political process.", free: true },
  { cat: "History", title: "The Penguin History of Europe", desc: "A widely respected single-volume survey - not openly licensed.", free: false },
  { cat: "History", title: "A People's History, Vol. 2", desc: "Modern era coverage with primary source excerpts.", free: false },
];

export default function EducationalPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = BOOKS.filter((b) => {
    const matchesCat = filter === "All" || b.cat === filter;
    const matchesSearch = (b.title + b.desc + b.cat).toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      <Nav active="educational" accent="brass" />

      <div className="page-head">
        <p className="eyebrow">Educational wing</p>
        <h1 className="page-title">The Core Subjects Shelf</h1>
        <p className="page-sub">
          Openly licensed textbooks you can read right here - no redirects, no downloads required. A few specialty titles link out to Amazon where no free equivalent exists.
        </p>
        <div className="searchbar">
          <input
            type="text"
            placeholder="Search subjects, titles, topics…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters">
          {CATEGORIES.map((c) => (
            <button key={c} className={`filter ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog">
        {filtered.map((b) => (
          <div className="card" key={b.title}>
            <div className="card-cat">{b.cat}</div>
            <div className="card-title">{b.title}</div>
            <div className="card-desc">{b.desc}</div>
            <div className="card-foot">
              <span className={`badge ${b.free ? "badge-free" : "badge-buy"}`}>{b.free ? "Free" : "Amazon"}</span>
              <button className={`card-btn ${b.free ? "read" : "buy"}`}>{b.free ? "Read Now" : "Buy →"}</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="empty">No titles match that search yet.</p>}
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
          color: var(--brass-soft);
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
        .searchbar {
          max-width: 520px;
          margin-bottom: 26px;
        }
        .searchbar input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 3px;
          border: 1px solid rgba(201, 162, 39, 0.25);
          background: rgba(255, 255, 255, 0.03);
          color: var(--parchment);
          font-family: 'Source Sans 3', sans-serif;
          font-size: 0.9rem;
        }
        .searchbar input::placeholder {
          color: var(--fog);
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
          border: 1px solid rgba(201, 162, 39, 0.3);
          color: var(--fog);
          cursor: pointer;
          background: transparent;
        }
        :global(.filter.active) {
          background: var(--brass);
          color: var(--ink);
          border-color: var(--brass);
          font-weight: 500;
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
          background: linear-gradient(155deg, #241c10, #1a1409);
          border: 1px solid rgba(201, 162, 39, 0.14);
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
          color: var(--brass-soft);
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
        }
        .badge-free {
          background: rgba(201, 162, 39, 0.18);
          color: var(--brass-soft);
        }
        .badge-buy {
          background: rgba(159, 176, 192, 0.14);
          color: var(--fog);
        }
        .card-btn {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 3px;
          border: none;
          cursor: pointer;
        }
        .card-btn.read {
          background: var(--brass);
          color: var(--ink);
        }
        .card-btn.buy {
          border: 1px solid rgba(159, 176, 192, 0.4);
          color: var(--parchment);
          background: transparent;
        }
        .empty {
          color: var(--fog);
          font-size: 0.9rem;
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px 0;
        }
      `}</style>
    </>
  );
}
