"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";

const CATEGORIES = ["All", "Mathematics", "Physics", "Biology", "Chemistry", "History", "Government"];

export default function EducationalPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function loadBooks() {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("wing", "educational")
        .eq("status", "published")
        .order("created_at", { ascending: true });

      if (error) setErrorMsg("Failed to load textbooks. Please try again.");
      else if (data) setBooks(data);
      setLoading(false);
    }
    loadBooks();
  }, []);

  const handleAction = (book) => {
    if (book.is_free) {
      router.push(`/book/${book.id}`);
      return;
    }

    if (book.amazon_query) {
      const url = `https://www.amazon.com/s?k=${encodeURIComponent(book.amazon_query)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const filtered = books.filter((b) => {
    const matchesCat = filter === "All" || b.category === filter;
    const matchesSearch = `${b.title || ""}${b.description || ""}${b.category || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      <Nav active="educational" accent="brass" />
      <div className="page-head">
        <p className="eyebrow">Educational wing</p>
        <h1 className="page-title">The Core Subjects Shelf</h1>
        <p className="page-sub">Free titles come from openly licensed textbook sources and keep their attribution visible. Paid titles remain catalog listings and take you to Amazon when selected.</p>
        <div className="searchbar"><input type="text" placeholder="Search subjects, titles, topics..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className="filters">{CATEGORIES.map((c) => <button key={c} className={`edu-filter ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>)}</div>
      </div>

      <div className="catalog">
        {loading ? <p className="empty">Loading titles...</p> : errorMsg ? <p className="empty">{errorMsg}</p> : <>
          {filtered.map((b) => (
            <div className={`card ${!b.is_free ? "paid-card" : ""}`} key={b.id} onClick={() => handleAction(b)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleAction(b); }}>
              {!b.is_free && <span className="paid-marker" aria-label="Paid title">$ Paid</span>}
              <div className="card-cat">{b.category}</div>
              <div className="card-title">{b.title}</div>
              {b.is_free && b.source_name && <div className="source">{b.source_name}{b.license_name ? ` · ${b.license_name}` : ""}</div>}
              <div className="card-desc">{b.description}</div>
              <div className="card-foot">
                <span className={`badge ${b.is_free ? "badge-free" : "badge-buy"}`}>{b.is_free ? "Open / Free" : "Amazon"}</span>
                <button onClick={(e) => { e.stopPropagation(); handleAction(b); }} className={`card-btn ${b.is_free ? "read" : "buy"}`}>
                  {b.is_free ? "Read Now" : "View on Amazon"}
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="empty">No titles match that search yet.</p>}
        </>}
      </div>
      <Footer />

      <style jsx>{`
        .page-head{padding:clamp(48px,7vw,72px) clamp(20px,6vw,64px) 30px;max-width:1180px;margin:0 auto}.eyebrow{font-family:'IBM Plex Mono',monospace;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--brass-soft);margin-bottom:14px}.page-title{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(2rem,4vw,3rem);color:var(--parchment);margin:0 0 14px}.page-sub{max-width:650px;font-size:1rem;line-height:1.6;color:var(--fog);margin:0 0 30px}.searchbar{max-width:520px;margin-bottom:26px}.searchbar input{width:100%;padding:12px 16px;border-radius:3px;border:1px solid rgba(201,162,39,.25);background:rgba(255,255,255,.03);color:var(--parchment);font-family:'Source Sans 3',sans-serif;font-size:.9rem}.searchbar input::placeholder{color:var(--fog)}.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:44px}.edu-filter{font-family:'IBM Plex Mono',monospace;font-size:.76rem;padding:8px 15px;border-radius:20px;border:1px solid rgba(201,162,39,.3);color:var(--fog);cursor:pointer;background:transparent}.edu-filter.active{background:var(--brass);color:var(--ink);border-color:var(--brass);font-weight:500}.catalog{max-width:1180px;margin:0 auto;padding:0 clamp(20px,6vw,64px) 80px;display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:22px}.card{position:relative;background:linear-gradient(155deg,#241c10,#1a1409);border:1px solid rgba(201,162,39,.14);border-radius:8px;padding:22px;display:flex;flex-direction:column;gap:12px;transition:transform .2s ease,box-shadow .2s ease;cursor:pointer}.card:hover{transform:translateY(-4px);box-shadow:0 14px 28px rgba(0,0,0,.35)}.card:focus-visible{outline:2px solid var(--brass);outline-offset:3px}.paid-card{padding-top:52px}.paid-marker{position:absolute;top:14px;left:14px;font-family:'IBM Plex Mono',monospace;font-size:.62rem;letter-spacing:.06em;text-transform:uppercase;padding:5px 9px;border-radius:3px;background:rgba(159,176,192,.14);border:1px solid rgba(159,176,192,.35);color:var(--parchment)}.card-cat{font-family:'IBM Plex Mono',monospace;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--brass-soft)}.card-title{font-family:'Fraunces',serif;font-weight:600;font-size:1.15rem;color:var(--parchment);line-height:1.25}.source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;line-height:1.45;color:#bda96a}.card-desc{font-size:.85rem;line-height:1.5;color:var(--fog);flex:1}.card-foot{display:flex;align-items:center;justify-content:space-between;margin-top:6px;gap:10px}.badge{font-family:'IBM Plex Mono',monospace;font-size:.6rem;letter-spacing:.04em;padding:4px 8px;border-radius:2px;text-transform:uppercase}.badge-free{background:rgba(201,162,39,.18);color:var(--brass-soft)}.badge-buy{background:rgba(159,176,192,.14);color:var(--fog)}.card-btn{font-family:'Source Sans 3',sans-serif;font-size:.82rem;font-weight:600;padding:8px 14px;border-radius:3px;border:none;cursor:pointer}.card-btn.read{background:var(--brass);color:var(--ink)}.card-btn.buy{border:1px solid rgba(159,176,192,.4);color:var(--parchment);background:transparent}.empty{color:var(--fog);font-size:.9rem;grid-column:1/-1;text-align:center;padding:40px 0}
      `}</style>
    </>
  );
}
