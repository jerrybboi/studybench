"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";

const CATEGORIES = ["All", "Fundamentals", "DeFi", "DAOs", "NFTs", "Compliance"];

export default function Web3Page() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function loadBooks() {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("wing", "web3")
        .eq("status", "published")
        .order("created_at", { ascending: true });

      if (error) setErrorMsg("Failed to load Web3 guides. Please try again.");
      else if (data) setBooks(data);
      setLoading(false);
    }
    loadBooks();
  }, []);

  const filtered = filter === "All" ? books : books.filter((b) => b.category === filter);

  return (
    <>
      <Nav active="web3" accent="teal" />
      <div className="page-head">
        <p className="eyebrow">Web3 wing</p>
        <h1 className="page-title">Crypto &amp; On-Chain Literacy</h1>
        <p className="page-sub">Original guides written for this library, covering fundamentals through DeFi, DAOs, NFTs, security, and compliance.</p>
        <div className="filters">{CATEGORIES.map((c) => <button key={c} className={`web3-filter ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>)}</div>
      </div>

      <div className="note"><div className="note-box"><strong>New chapters added regularly.</strong> This shelf grows as new guides are written and reviewed.</div></div>

      <div className="catalog">
        {loading ? <p className="empty">Loading titles...</p> : errorMsg ? <p className="empty">{errorMsg}</p> : filtered.length === 0 ? <p className="empty">No guides found in this category.</p> : filtered.map((b) => (
          <div className="card" key={b.id}>
            <div className="card-cat">{b.category}</div>
            <div className="card-title">{b.title}</div>
            <div className="card-desc">{b.description}</div>
            <div className="card-foot">
              <span className="badge">Free</span>
              <button onClick={() => router.push(`/book/${b.id}`)} className="card-btn">Read Now</button>
            </div>
          </div>
        ))}
      </div>
      <Footer />

      <style jsx>{`
        .page-head{padding:clamp(48px,7vw,72px) clamp(20px,6vw,64px) 30px;max-width:1180px;margin:0 auto}.eyebrow{font-family:'IBM Plex Mono',monospace;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--teal-soft);margin-bottom:14px}.page-title{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(2rem,4vw,3rem);color:var(--parchment);margin:0 0 14px}.page-sub{max-width:600px;font-size:1rem;line-height:1.6;color:var(--fog);margin:0 0 30px}.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:44px}.web3-filter{font-family:'IBM Plex Mono',monospace;font-size:.76rem;padding:8px 15px;border-radius:20px;border:1px solid rgba(111,167,154,.3);color:var(--fog);cursor:pointer;background:transparent}.web3-filter.active{background:var(--teal-soft);color:var(--ink);border-color:var(--teal-soft);font-weight:500}.note{max-width:1180px;margin:0 auto 40px;padding:0 clamp(20px,6vw,64px)}.note-box{background:rgba(111,167,154,.08);border:1px solid rgba(111,167,154,.2);border-radius:8px;padding:16px 20px;font-size:.85rem;color:var(--fog);max-width:640px}.note-box strong{color:var(--teal-soft)}.catalog{max-width:1180px;margin:0 auto;padding:0 clamp(20px,6vw,64px) 80px;display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:22px}.card{background:linear-gradient(155deg,#152c27,#0f1f1b);border:1px solid rgba(111,167,154,.16);border-radius:8px;padding:22px;display:flex;flex-direction:column;gap:12px;transition:transform .2s ease,box-shadow .2s ease}.card:hover{transform:translateY(-4px);box-shadow:0 14px 28px rgba(0,0,0,.35)}.card-cat{font-family:'IBM Plex Mono',monospace;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--teal-soft)}.card-title{font-family:'Fraunces',serif;font-weight:600;font-size:1.15rem;color:var(--parchment);line-height:1.25}.card-desc{font-size:.85rem;line-height:1.5;color:var(--fog);flex:1}.card-foot{display:flex;align-items:center;justify-content:space-between;margin-top:6px}.badge{font-family:'IBM Plex Mono',monospace;font-size:.62rem;letter-spacing:.05em;padding:4px 9px;border-radius:2px;text-transform:uppercase;background:rgba(111,167,154,.18);color:var(--teal-soft)}.card-btn{font-family:'Source Sans 3',sans-serif;font-size:.82rem;font-weight:600;padding:8px 14px;border-radius:3px;border:none;cursor:pointer;background:var(--teal-soft);color:var(--ink)}.empty{color:var(--fog);font-size:.9rem;grid-column:1/-1;text-align:center;padding:40px 0}
      `}</style>
    </>
  );
}
