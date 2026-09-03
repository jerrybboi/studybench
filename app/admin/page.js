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
  const [stats, setStats] = useState({ users: "-", generations: "-", unlimited: "-", published: "-" });
  const [books, setBooks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formOpen, setFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
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

        await loadDashboard();
      } catch {
        router.replace("/");
      } finally {
        setChecking(false);
      }
    }
    init();
  }, [router]);

  async function loadDashboard() {
    setMessage("");
    const now = new Date().toISOString();
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [booksRes, profilesRes, usageRes, unlimitedRes, publishedRes] = await Promise.all([
      supabase.from("books").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("usage_log").select("user_id,count,window_start").gte("window_start", since).order("window_start", { ascending: false }),
      supabase.from("profiles").select("id", { count: "exact", head: true }).gt("unlimited_until", now),
      supabase.from("books").select("id", { count: "exact", head: true }).eq("status", "published"),
    ]);

    const firstError = [booksRes.error, profilesRes.error, usageRes.error, unlimitedRes.error, publishedRes.error].find(Boolean);
    if (firstError) {
      setMessage(`Dashboard data error: ${firstError.message}`);
      return;
    }

    setBooks(booksRes.data || []);
    const usageRows = usageRes.data || [];
    setStats({
      users: profilesRes.count ?? 0,
      generations: usageRows.reduce((sum, row) => sum + (row.count || 0), 0),
      unlimited: unlimitedRes.count ?? 0,
      published: publishedRes.count ?? 0,
    });
    setLogs(usageRows.map((row) => ({
      type: "AI usage",
      user: row.user_id,
      detail: `${row.count || 0} generation${row.count === 1 ? "" : "s"}`,
      when: row.window_start ? new Date(row.window_start).toLocaleString() : "-",
    })));
  }

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

    const payload = {
      title: form.title.trim(),
      category: form.category.trim(),
      wing: form.wing,
      description: form.description.trim(),
      is_free: form.is_free,
      amazon_query: form.is_free ? null : (form.amazon_query.trim() || null),
      content: form.is_free ? form.content : null,
      status: form.status,
    };

    const result = form.id
      ? await supabase.from("books").update(payload).eq("id", form.id).select("*").single()
      : await supabase.from("books").insert(payload).select("*").single();

    if (result.error) {
      setMessage(result.error.message);
      setBusy(false);
      return;
    }

    setFormOpen(false);
    setForm(EMPTY_FORM);
    setMessage("Saved successfully.");
    await loadDashboard();
    setBusy(false);
  }

  async function setStatus(book, status) {
    setBusy(true);
    const { error } = await supabase.from("books").update({ status }).eq("id", book.id);
    if (error) setMessage(error.message);
    else await loadDashboard();
    setBusy(false);
  }

  async function deleteBook(id) {
    if (!window.confirm("Delete this book permanently?")) return;
    setBusy(true);
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) setMessage(error.message);
    else await loadDashboard();
    setBusy(false);
  }

  if (checking) return <main className="checking">Checking admin access...</main>;

  return (
    <>
      <nav>
        <Link href="/" className="brand">
          <img className="brand-mark" src="/studybench-logo.svg" alt="StudyBench logo" />
          <span className="brand-name">StudyBench</span>
          <span className="admin-badge">Admin</span>
        </Link>
        <Link href="/" className="exit">← Back to site</Link>
      </nav>

      <main className="wrap">
        <h1 className="page-title">Admin overview</h1>
        <p className="page-sub warn">Protected admin area. Only authorized StudyBench admins can access these tools.</p>

        {message && <div className="message">{message}</div>}

        <div className="stats">
          <Stat label="Signed-up users" value={stats.users} sub="profiles table" />
          <Stat label="AI generations today" value={stats.generations} sub="usage_log (24h window)" />
          <Stat label="Unlimited members" value={stats.unlimited} sub="unlimited_until > now" />
          <Stat label="Books published" value={stats.published} sub="status = published" />
        </div>

        <div className="section-head">
          <h2 className="section-title">Book manager</h2>
          <button className="upload-btn" onClick={openCreate}>+ Upload new book</button>
        </div>

        {formOpen && (
          <form className="upload-form" onSubmit={saveBook}>
            <div className="form-head">
              <h3>{form.id ? "Edit book" : "New book"}</h3>
              <button type="button" className="action-btn" onClick={() => setFormOpen(false)}>Close</button>
            </div>
            <div className="form-row">
              <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              <select value={form.wing} onChange={(e) => setForm({ ...form, wing: e.target.value })}>
                <option value="educational">educational</option>
                <option value="web3">web3</option>
              </select>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </div>
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} />
            <label className="check-label">
              <input type="checkbox" checked={form.is_free} onChange={(e) => setForm({ ...form, is_free: e.target.checked })} />
              Free hosted title
            </label>
            {form.is_free ? (
              <textarea className="content-input" placeholder="Full licensed or original reading content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={14} />
            ) : (
              <input placeholder="Amazon search query" value={form.amazon_query} onChange={(e) => setForm({ ...form, amazon_query: e.target.value })} />
            )}
            <button type="submit" className="upload-btn" disabled={busy}>{busy ? "Saving..." : "Save book"}</button>
          </form>
        )}

        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Wing</th><th>Status</th><th>Added</th><th>Actions</th></tr></thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id}>
                  <td className="book-title-cell">{b.title}</td>
                  <td>{b.wing} · {b.category}</td>
                  <td><span className={`status ${b.status === "published" ? "status-published" : "status-draft"}`}>{b.status}</span></td>
                  <td className="mono">{b.created_at ? new Date(b.created_at).toLocaleDateString() : "-"}</td>
                  <td className="row-actions">
                    <button className="action-btn" onClick={() => openEdit(b)}>Edit</button>
                    {b.is_free && b.status === "published" && <Link className="action-btn" href={`/book/${b.id}`} target="_blank">Preview</Link>}
                    <button className={`action-btn ${b.status === "draft" ? "publish" : ""}`} onClick={() => setStatus(b, b.status === "published" ? "draft" : "published")} disabled={busy}>{b.status === "published" ? "Unpublish" : "Publish"}</button>
                    <button className="action-btn danger" onClick={() => deleteBook(b.id)} disabled={busy}>Delete</button>
                  </td>
                </tr>
              ))}
              {books.length === 0 && <tr><td colSpan={5} className="empty-cell">No books found.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="section-head log-head"><h2 className="section-title">Usage &amp; payment log</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Type</th><th>User</th><th>Detail</th><th>When</th></tr></thead>
            <tbody>
              {logs.map((row, i) => <tr key={i}><td>{row.type}</td><td className="mono">{row.user}</td><td>{row.detail}</td><td className="mono">{row.when}</td></tr>)}
              {logs.length === 0 && <tr><td colSpan={4} className="empty-cell">No recent activity.</td></tr>}
            </tbody>
          </table>
        </div>
      </main>

      <style jsx>{`
        nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:16px clamp(20px,5vw,64px);background:#0b131c;border-bottom:1px solid rgba(201,162,39,.16)}
        .brand{display:flex;align-items:center;gap:8px;text-decoration:none}.brand-mark{width:44px;height:44px;border-radius:50%;object-fit:cover}.brand-name{font-family:'Fraunces',serif;font-weight:600;font-size:1rem;color:var(--parchment)}
        .admin-badge{font-family:'IBM Plex Mono',monospace;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--danger);border:1px solid rgba(196,84,74,.4);padding:3px 9px;border-radius:3px;margin-left:6px}.exit{font-family:'IBM Plex Mono',monospace;font-size:.78rem;text-decoration:none;color:var(--fog);border:1px solid rgba(159,176,192,.3);padding:8px 14px;border-radius:3px}
        .wrap{max-width:1180px;margin:0 auto;padding:36px clamp(20px,5vw,64px) 80px}.page-title{font-family:'Fraunces',serif;font-weight:600;font-size:1.7rem;color:var(--parchment);margin:0 0 6px}.page-sub{font-size:.88rem;color:var(--fog);margin:0 0 20px}.warn{color:var(--danger);background:rgba(196,84,74,.1);border:1px solid rgba(196,84,74,.3);padding:10px 16px;border-radius:6px;margin-bottom:32px}.message{margin:0 0 22px;padding:11px 14px;border:1px solid rgba(111,167,154,.35);color:var(--teal-soft);border-radius:5px}
        .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:44px}.section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px}.section-title{font-family:'Fraunces',serif;font-weight:600;font-size:1.35rem;color:var(--parchment);margin:0}.upload-btn{font-family:'IBM Plex Mono',monospace;font-size:.72rem;border:0;border-radius:4px;padding:10px 15px;background:var(--brass);color:var(--ink);font-weight:600;cursor:pointer}
        .upload-form{display:grid;gap:12px;padding:18px;margin:0 0 22px;border:1px solid rgba(201,162,39,.2);border-radius:8px;background:rgba(255,255,255,.025)}.form-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.form-head h3{font-family:'Fraunces',serif;color:var(--parchment);margin:0}.form-row{display:grid;grid-template-columns:2fr 1.2fr 1fr 1fr;gap:10px}.upload-form input,.upload-form textarea,.upload-form select{width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid rgba(159,176,192,.25);border-radius:4px;background:#0f1b27;color:var(--parchment);font-family:'Source Sans 3',sans-serif}.content-input{line-height:1.55}.check-label{display:flex;align-items:center;gap:8px;color:var(--fog);font-size:.82rem}.check-label input{width:auto}
        .table-wrap{overflow-x:auto;border:1px solid rgba(201,162,39,.12);border-radius:7px}table{width:100%;border-collapse:collapse;min-width:760px;background:rgba(255,255,255,.015)}th{font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:.08em;font-size:.64rem;color:var(--brass-soft);text-align:left;padding:12px 14px;border-bottom:1px solid rgba(201,162,39,.2)}td{padding:13px 14px;color:var(--fog);font-size:.82rem;border-bottom:1px solid rgba(159,176,192,.09);vertical-align:middle}tr:last-child td{border-bottom:0}.book-title-cell{font-family:'Fraunces',serif;color:var(--parchment);font-size:.92rem}.mono{font-family:'IBM Plex Mono',monospace;font-size:.7rem}.status{font-family:'IBM Plex Mono',monospace;font-size:.6rem;text-transform:uppercase;padding:4px 8px;border-radius:3px}.status-published{background:rgba(111,167,154,.15);color:var(--teal-soft)}.status-draft{background:rgba(159,176,192,.12);color:var(--fog)}.row-actions{display:flex;gap:6px;flex-wrap:wrap}.action-btn{font-family:'IBM Plex Mono',monospace;font-size:.64rem;padding:6px 8px;border-radius:3px;border:1px solid rgba(159,176,192,.3);background:transparent;color:var(--parchment);cursor:pointer;text-decoration:none}.action-btn.publish{color:var(--teal-soft);border-color:rgba(111,167,154,.4)}.action-btn.danger{color:#e88b82;border-color:rgba(196,84,74,.4)}.empty-cell{text-align:center;padding:34px;color:var(--fog)}.log-head{margin-top:42px}.checking{min-height:60vh;display:grid;place-items:center;color:var(--fog)}
        @media(max-width:720px){.brand-name{display:none}.brand-mark{width:42px;height:42px}.form-row{grid-template-columns:1fr}.wrap{padding-top:28px}}
      `}</style>
    </>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-sub">{sub}</div>
      <style jsx>{`
        .stat{background:rgba(255,255,255,.03);border:1px solid rgba(201,162,39,.15);border-radius:8px;padding:18px 20px}.stat-label{font-family:'IBM Plex Mono',monospace;font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;color:var(--brass-soft);margin-bottom:8px}.stat-value{font-family:'Fraunces',serif;font-weight:600;font-size:1.7rem;color:var(--parchment)}.stat-sub{font-size:.76rem;color:var(--fog);margin-top:4px}
      `}</style>
    </div>
  );
}
