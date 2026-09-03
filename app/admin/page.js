"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

const EMPTY_FORM = {
  id: null,
  title: "",
  category: "",
  wing: "educational",
  description: "",
  is_free: true,
  amazon_query: "",
  content: "",
  status: "draft",
};

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [stats, setStats] = useState({ users: 0, generations: 0, unlimited: 0, published: 0 });
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formOpen, setFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function getHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return null;
    return { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" };
  }

  async function loadDashboard(headers) {
    const [booksRes, logsRes] = await Promise.all([
      fetch("/api/admin/books/list", { headers, cache: "no-store" }),
      fetch("/api/admin/logs", { headers, cache: "no-store" }),
    ]);

    if (booksRes.ok) {
      const data = await booksRes.json();
      setBooks(data.books || []);
    }
    if (logsRes.ok) {
      const data = await logsRes.json();
      if (data.stats) setStats(data.stats);
    }
  }

  useEffect(() => {
    async function init() {
      const headers = await getHeaders();
      if (!headers) return router.replace("/");

      const check = await fetch("/api/admin/check", { headers, cache: "no-store" });
      if (!check.ok) return router.replace("/");

      await loadDashboard(headers);
      setChecking(false);
    }
    init().catch(() => router.replace("/"));
  }, [router]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setMessage("");
    setFormOpen(true);
  }

  function openEdit(book) {
    setForm({
      id: book.id,
      title: book.title || "",
      category: book.category || "",
      wing: book.wing || "educational",
      description: book.description || "",
      is_free: book.is_free !== false,
      amazon_query: book.amazon_query || "",
      content: book.content || "",
      status: book.status || "draft",
    });
    setMessage("");
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveBook(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const headers = await getHeaders();
      if (!headers) return router.replace("/");

      const endpoint = form.id ? "/api/admin/books/update" : "/api/admin/books/create";
      const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save book");

      if (form.id) setBooks((prev) => prev.map((b) => b.id === data.book.id ? data.book : b));
      else setBooks((prev) => [data.book, ...prev]);

      setFormOpen(false);
      setForm(EMPTY_FORM);
      setMessage("Saved successfully.");
    } catch (err) {
      setMessage(err.message || "Could not save book.");
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(book, status) {
    const headers = await getHeaders();
    if (!headers) return router.replace("/");
    setBusy(true);
    const res = await fetch("/api/admin/books/update", {
      method: "POST",
      headers,
      body: JSON.stringify({ id: book.id, status }),
    });
    if (res.ok) {
      const data = await res.json();
      setBooks((prev) => prev.map((b) => b.id === data.book.id ? data.book : b));
    }
    setBusy(false);
  }

  async function deleteBook(id) {
    if (!window.confirm("Delete this book permanently?")) return;
    const headers = await getHeaders();
    if (!headers) return router.replace("/");
    setBusy(true);
    const res = await fetch("/api/admin/books/delete", { method: "POST", headers, body: JSON.stringify({ id }) });
    if (res.ok) setBooks((prev) => prev.filter((b) => b.id !== id));
    setBusy(false);
  }

  if (checking) return <main className="checking">Checking admin access...</main>;

  return (
    <>
      <nav>
        <Link href="/" className="brand"><span className="brand-mark">SB</span><span className="brand-name">StudyBench</span><span className="admin-badge">Admin</span></Link>
        <Link href="/" className="exit">← Back to site</Link>
      </nav>

      <main className="wrap">
        <section className="topline">
          <div><p className="eyebrow">Founder tools</p><h1>Admin overview</h1></div>
          <button className="primary" onClick={openCreate}>+ New book</button>
        </section>

        {message && <div className="message">{message}</div>}

        {formOpen && (
          <form className="editor" onSubmit={saveBook}>
            <div className="editor-head"><h2>{form.id ? "Edit book" : "Create book"}</h2><button type="button" className="ghost" onClick={() => setFormOpen(false)}>Close</button></div>
            <div className="grid two">
              <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
              <label>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></label>
              <label>Wing<select value={form.wing} onChange={(e) => setForm({ ...form, wing: e.target.value })}><option value="educational">Educational</option><option value="web3">Web3</option></select></label>
              <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option></select></label>
            </div>
            <label>Description<textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></label>
            <label className="check"><input type="checkbox" checked={form.is_free} onChange={(e) => setForm({ ...form, is_free: e.target.checked })} /> Free hosted title</label>
            {form.is_free ? (
              <label>Full reading content<textarea className="content" rows="16" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Paste the complete licensed/original text here." /></label>
            ) : (
              <label>Amazon search query<input value={form.amazon_query} onChange={(e) => setForm({ ...form, amazon_query: e.target.value })} placeholder="Book title author" /></label>
            )}
            <button className="primary" type="submit" disabled={busy}>{busy ? "Saving..." : "Save book"}</button>
          </form>
        )}

        <section className="stats">
          <Stat label="Profiles" value={stats.users} />
          <Stat label="AI generations, 24h" value={stats.generations} />
          <Stat label="Unlimited members" value={stats.unlimited} />
          <Stat label="Published books" value={stats.published} />
        </section>

        <section>
          <div className="section-head"><h2>Book manager</h2><span>{books.length} total</span></div>
          <div className="book-list">
            {books.map((book) => (
              <article className="book" key={book.id}>
                <div className="book-main"><p className="meta">{book.wing} · {book.category}</p><h3>{book.title}</h3><p>{book.description}</p><span className={`status ${book.status}`}>{book.status}</span></div>
                <div className="actions">
                  <button onClick={() => openEdit(book)}>Edit</button>
                  {book.is_free && book.status === "published" && <Link href={`/book/${book.id}`} target="_blank">Preview</Link>}
                  <button onClick={() => setStatus(book, book.status === "published" ? "draft" : "published")} disabled={busy}>{book.status === "published" ? "Unpublish" : "Publish"}</button>
                  <button className="danger" onClick={() => deleteBook(book.id)} disabled={busy}>Delete</button>
                </div>
              </article>
            ))}
            {books.length === 0 && <p className="empty">No books found.</p>}
          </div>
        </section>
      </main>

      <style jsx>{`
        nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:16px clamp(18px,5vw,64px);background:#0b131c;border-bottom:1px solid rgba(201,162,39,.2)}.brand{display:flex;align-items:center;gap:9px;text-decoration:none}.brand-mark{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--parchment);color:var(--ink);border:2px solid var(--brass);font-family:'Fraunces',serif;font-weight:700}.brand-name{font-family:'Fraunces',serif;color:var(--parchment);font-size:1.05rem}.admin-badge{font-family:'IBM Plex Mono',monospace;font-size:.62rem;color:var(--danger);border:1px solid rgba(196,84,74,.5);padding:3px 8px;border-radius:3px}.exit{font-family:'IBM Plex Mono',monospace;color:var(--fog);font-size:.78rem;text-decoration:none}.wrap{max-width:1180px;margin:0 auto;padding:40px clamp(18px,5vw,64px) 90px}.topline,.section-head,.editor-head{display:flex;align-items:center;justify-content:space-between;gap:16px}.eyebrow,.meta{font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:.1em;color:var(--brass-soft);font-size:.68rem}h1,h2,h3{font-family:'Fraunces',serif;color:var(--parchment)}h1{font-size:clamp(2rem,5vw,3rem);margin:6px 0 0}.primary,.ghost,.actions button,.actions a{font-family:'IBM Plex Mono',monospace;border-radius:4px;cursor:pointer;text-decoration:none}.primary{border:0;background:var(--brass);color:var(--ink);padding:11px 16px;font-weight:600}.ghost,.actions button,.actions a{border:1px solid rgba(159,176,192,.28);background:transparent;color:var(--parchment);padding:8px 11px}.message{margin:18px 0;padding:11px 14px;border:1px solid rgba(111,167,154,.35);color:var(--teal-soft);border-radius:5px}.editor{margin:28px 0 36px;padding:24px;background:rgba(255,255,255,.03);border:1px solid rgba(201,162,39,.2);border-radius:10px}.editor h2{margin:0}.grid.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}.editor label{display:grid;gap:7px;margin:14px 0;color:var(--fog);font-size:.8rem;font-family:'IBM Plex Mono',monospace}.editor input,.editor textarea,.editor select{width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid rgba(159,176,192,.25);border-radius:4px;background:#0f1b27;color:var(--parchment);font:inherit}.editor textarea.content{font-family:'Source Sans 3',sans-serif;line-height:1.6}.editor .check{display:flex;align-items:center;gap:9px}.editor .check input{width:auto}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:34px 0 48px}.section-head{margin-bottom:16px}.section-head h2{margin:0}.section-head span{color:var(--fog);font-family:'IBM Plex Mono',monospace;font-size:.75rem}.book-list{display:grid;gap:14px}.book{display:flex;justify-content:space-between;gap:20px;padding:20px;border:1px solid rgba(201,162,39,.14);border-radius:8px;background:rgba(255,255,255,.025)}.book-main h3{margin:5px 0 8px}.book-main>p:not(.meta){color:var(--fog);font-size:.86rem;line-height:1.5;margin:0 0 10px}.status{font-family:'IBM Plex Mono',monospace;font-size:.62rem;text-transform:uppercase;padding:4px 8px;border-radius:3px}.status.published{background:rgba(111,167,154,.15);color:var(--teal-soft)}.status.draft{background:rgba(159,176,192,.12);color:var(--fog)}.actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}.actions .danger{color:#e88b82;border-color:rgba(196,84,74,.4)}.checking,.empty{min-height:60vh;display:grid;place-items:center;color:var(--fog)}@media(max-width:800px){.grid.two,.stats{grid-template-columns:1fr 1fr}.book{flex-direction:column}.actions{justify-content:flex-start}.topline{align-items:flex-start}.brand-name{display:none}}@media(max-width:520px){.stats{grid-template-columns:1fr}.grid.two{grid-template-columns:1fr}}
      `}</style>
    </>
  );
}

function Stat({ label, value }) {
  return <div className="stat"><p>{label}</p><strong>{value}</strong><style jsx>{`.stat{padding:18px;border:1px solid rgba(201,162,39,.15);border-radius:8px;background:rgba(255,255,255,.025)}p{font-family:'IBM Plex Mono',monospace;color:var(--brass-soft);font-size:.64rem;text-transform:uppercase;letter-spacing:.08em;margin:0 0 8px}strong{font-family:'Fraunces',serif;color:var(--parchment);font-size:1.8rem}`}</style></div>;
}
