"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function TextbookHostingPage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return router.replace("/");

        const check = await fetch("/api/admin/check", {
          headers: { Authorization: `Bearer ${session.access_token}` },
          cache: "no-store",
        });
        if (!check.ok) return router.replace("/");

        await loadBooks(session.access_token);
      } catch (error) {
        setMessage(error?.message || "Could not load textbook hosting.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  async function loadBooks(accessToken) {
    let token = accessToken;
    if (!token) {
      const { data: { session } } = await supabase.auth.getSession();
      token = session?.access_token;
    }
    if (!token) throw new Error("Your admin session expired. Sign in again.");

    const res = await fetch("/api/admin/books/list", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not load books.");

    const educationalBooks = (data.books || [])
      .filter((book) => book.wing === "educational" && book.is_free === true)
      .sort((a, b) => (a.title || "").localeCompare(b.title || ""));

    setBooks(educationalBooks);
  }

  async function mirrorBook(book) {
    setBusyId(book.id);
    setMessage(`Copying ${book.title} into StudyBench storage...`);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Your admin session expired. Sign in again.");

      const res = await fetch("/api/admin/books/mirror", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id: book.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not mirror this PDF.");

      await loadBooks(session.access_token);
      const mb = data.bytes ? (data.bytes / 1024 / 1024).toFixed(1) : null;
      setMessage(`${book.title} is now hosted on StudyBench${mb ? ` (${mb} MB)` : ""}.`);
    } catch (error) {
      setMessage(error?.message || "Could not mirror this PDF.");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <main className="state">Checking textbook hosting...</main>;

  return (
    <main className="wrap">
      <div className="top">
        <div>
          <p className="kicker">Admin · Educational library</p>
          <h1>Textbook hosting</h1>
          <p className="sub">Copy approved open-license PDFs into StudyBench Storage. Run them one at a time so large books do not compete for upload time.</p>
        </div>
        <Link href="/admin" className="back">Back to admin</Link>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="list">
        {books.map((book) => (
          <section className="book" key={book.id}>
            <div className="info">
              <div className="meta">{book.category} · {book.license_name || "Open license"}</div>
              <h2>{book.title}</h2>
              <p>{book.source_name || "Open textbook source"}</p>
              <div className="status">
                {book.hosted_file_url ? <span className="hosted">Hosted on StudyBench</span> : <span className="pending">Not mirrored yet</span>}
              </div>
            </div>
            <div className="actions">
              {book.source_file_url ? (
                <button type="button" disabled={Boolean(busyId)} onClick={() => mirrorBook(book)}>
                  {busyId === book.id ? "Mirroring..." : book.hosted_file_url ? "Re-mirror PDF" : "Mirror PDF"}
                </button>
              ) : <span className="no-source">Source PDF missing</span>}
              {book.hosted_file_url && <a href={book.hosted_file_url} target="_blank" rel="noreferrer">Open hosted PDF</a>}
              {book.status === "published" && <Link href={`/book/${book.id}`} target="_blank">Preview reader</Link>}
            </div>
          </section>
        ))}
      </div>

      <style jsx>{`
        .wrap{max-width:980px;margin:0 auto;padding:48px clamp(20px,5vw,54px) 90px}.top{display:flex;align-items:flex-start;justify-content:space-between;gap:28px;margin-bottom:30px}.kicker{font-family:'IBM Plex Mono',monospace;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--brass-soft);margin:0 0 10px}h1{font-family:'Fraunces',serif;color:var(--parchment);font-size:clamp(2rem,5vw,3rem);margin:0}.sub{max-width:650px;color:var(--fog);line-height:1.65}.back,.actions a{font-family:'IBM Plex Mono',monospace;font-size:.72rem;text-decoration:none;color:var(--parchment);border:1px solid rgba(201,162,39,.3);padding:9px 12px;border-radius:4px}.message{padding:12px 14px;margin-bottom:20px;border:1px solid rgba(111,167,154,.4);border-radius:6px;color:var(--teal-soft);background:rgba(111,167,154,.06)}.list{display:grid;gap:14px}.book{display:flex;justify-content:space-between;gap:22px;padding:20px;border:1px solid rgba(201,162,39,.16);border-radius:8px;background:rgba(255,255,255,.025)}.meta{font-family:'IBM Plex Mono',monospace;font-size:.64rem;text-transform:uppercase;letter-spacing:.08em;color:var(--brass-soft)}h2{font-family:'Fraunces',serif;color:var(--parchment);font-size:1.3rem;margin:7px 0 5px}.info>p{margin:0;color:var(--fog);font-size:.85rem}.status{margin-top:10px;font-family:'IBM Plex Mono',monospace;font-size:.65rem}.hosted{color:var(--teal-soft)}.pending{color:var(--fog)}.actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap;max-width:360px}.actions button{font-family:'IBM Plex Mono',monospace;font-size:.72rem;border:0;border-radius:4px;padding:10px 13px;background:var(--brass);color:var(--ink-deep);font-weight:600;cursor:pointer}.actions button:disabled{opacity:.55;cursor:wait}.no-source{font-size:.76rem;color:var(--danger)}.state{min-height:70vh;display:grid;place-items:center;color:var(--fog)}@media(max-width:700px){.top,.book{flex-direction:column}.top{gap:16px}.actions{justify-content:flex-start;max-width:none}.actions button,.actions a{flex:1 1 140px;text-align:center}}
      `}</style>
    </main>
  );
}
