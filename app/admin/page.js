"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [stats, setStats] = useState({
    users: "-",
    generations: "-",
    unlimited: "-",
    published: "-",
  });
  const [books, setBooks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    wing: "educational",
    description: "",
    is_free: true,
    amazon_query: "",
    content: "",
  });
  const [busy, setBusy] = useState(false);

  async function getAuthHeaders() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return null;
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  }

  useEffect(() => {
    async function init() {
      try {
        const headers = await getAuthHeaders();
        if (!headers) {
          router.push("/");
          return;
        }

        const checkRes = await fetch("/api/admin/check", { headers });
        if (!checkRes.ok) {
          router.push("/");
          return;
        }

        const checkData = await checkRes.json();
        if (!checkData.isAdmin) {
          router.push("/");
          return;
        }

        await Promise.all([loadBooks(headers), loadLogs(headers)]);
      } catch (err) {
        router.push("/");
      } finally {
        setChecking(false);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function loadBooks(headers) {
    try {
      const res = await fetch("/api/admin/books/list", { headers });
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books || []);
      }
    } catch (err) {
      console.error("Failed to fetch books", err);
    }
  }

  async function loadLogs(headers) {
    try {
      const res = await fetch("/api/admin/logs", { headers });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  }

  async function handleStatus(id, status) {
    setBusy(true);
    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        router.push("/");
        return;
      }
      const res = await fetch("/api/admin/books/update", {
        method: "POST",
        headers,
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this book permanently?")) return;
    setBusy(true);
    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        router.push("/");
        return;
      }
      const res = await fetch("/api/admin/books/delete", {
        method: "POST",
        headers,
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setBooks((prev) => prev.filter((b) => b.id !== id));
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        router.push("/");
        return;
      }
      const res = await fetch("/api/admin/books/create", {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setBooks((prev) => [data.book, ...prev]);
        setShowForm(false);
        setForm({
          title: "",
          category: "",
          wing: "educational",
          description: "",
          is_free: true,
          amazon_query: "",
          content: "",
        });
      }
    } finally {
      setBusy(false);
    }
  }

  if (checking) {
    return (
      <div style={{ padding: 80, textAlign: "center", color: "var(--fog)" }}>
        Checking admin access…
      </div>
    );
  }

  return (
    <>
      <nav>
        <Link href="/" className="brand">
          <img className="brand-mark" src="/logo.jpg" alt="StudyBench" />
          <span className="brand-name">StudyBench</span>
          <span className="admin-badge">Admin</span>
        </Link>
        <Link href="/" className="exit">
          ← Back to site
        </Link>
      </nav>

      <div className="wrap">
        <h1 className="page-title">Admin overview</h1>
        <p className="page-sub warn">Protected by is_admin flag. Only users with profiles.is_admin = true can see this page.</p>

        <div className="stats">
          <div className="stat">
            <div className="stat-label">Signed-up users</div>
            <div className="stat-value">{stats.users}</div>
            <div className="stat-sub">profiles table</div>
          </div>
          <div className="stat">
            <div className="stat-label">AI generations today</div>
            <div className="stat-value">{stats.generations}</div>
            <div className="stat-sub">usage_log (24h window)</div>
          </div>
          <div className="stat">
            <div className="stat-label">Unlimited members</div>
            <div className="stat-value">{stats.unlimited}</div>
            <div className="stat-sub">unlimited_until &gt; now</div>
          </div>
          <div className="stat">
            <div className="stat-label">Books published</div>
            <div className="stat-value">{stats.published}</div>
            <div className="stat-sub">status = published</div>
          </div>
        </div>

        <div className="section-head">
          <h2 className="section-title">Book manager</h2>
          <button className="upload-btn" onClick={() => setShowForm(!showForm)} disabled={busy}>
            {showForm ? "Cancel" : "+ Upload new book"}
          </button>
        </div>

        {showForm && (
          <form className="upload-form" onSubmit={handleCreate}>
            <div className="form-row">
              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <input
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              />
              <select value={form.wing} onChange={(e) => setForm({ ...form, wing: e.target.value })}>
                <option value="educational">educational</option>
                <option value="web3">web3</option>
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={2}
            />
            <div className="form-row">
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={form.is_free}
                  onChange={(e) => setForm({ ...form, is_free: e.target.checked })}
                />
                Free (hosted)
              </label>
              {!form.is_free && (
                <input
                  placeholder="Amazon search query"
                  value={form.amazon_query}
                  onChange={(e) => setForm({ ...form, amazon_query: e.target.value })}
                />
              )}
            </div>
            {form.is_free && (
              <textarea
                placeholder="Full book content (optional for now)"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
              />
            )}
            <button type="submit" className="upload-btn" disabled={busy}>
              Create as draft
            </button>
          </form>
        )}

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Wing</th>
              <th>Status</th>
              <th>Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td className="book-title-cell">{b.title}</td>
                <td>
                  {b.wing} · {b.category}
                </td>
                <td>
                  <span className={`status ${b.status === "published" ? "status-published" : "status-draft"}`}>
                    {b.status}
                  </span>
                </td>
                <td className="mono">{b.created_at ? new Date(b.created_at).toLocaleDateString() : "-"}</td>
                <td className="row-actions">
                  {b.status === "draft" ? (
                    <button className="action-btn publish" onClick={() => handleStatus(b.id, "published")} disabled={busy}>
                      Publish
                    </button>
                  ) : (
                    <button className="action-btn" onClick={() => handleStatus(b.id, "draft")} disabled={busy}>
                      Unpublish
                    </button>
                  )}
                  <button className="action-btn" disabled>
                    Preview
                  </button>
                  <button className="action-btn danger" onClick={() => handleDelete(b.id)} disabled={busy}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan={5} style={{ color: "var(--fog)", textAlign: "center" }}>
                  No books yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="section-head">
          <h2 className="section-title">Usage &amp; payment log</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>User</th>
              <th>Detail</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((row, i) => (
              <tr key={i}>
                <td>{row.type}</td>
                <td className="mono">{row.user}</td>
                <td>{row.detail}</td>
                <td className="mono">{row.when}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} style={{ color: "var(--fog)", textAlign: "center" }}>
                  No recent activity.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px clamp(20px, 5vw, 64px);
          background: #0b131c;
          border-bottom: 1px solid rgba(201, 162, 39, 0.16);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .brand-mark {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
        .brand-name {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1rem;
          color: var(--parchment);
        }
        .admin-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--danger);
          border: 1px solid rgba(196, 84, 74, 0.4);
          padding: 3px 9px;
          border-radius: 3px;
          margin-left: 6px;
        }
        .exit {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
          text-decoration: none;
          color: var(--fog);
          border: 1px solid rgba(159, 176, 192, 0.3);
          padding: 8px 14px;
          border-radius: 3px;
        }
        .wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 36px clamp(20px, 5vw, 64px) 80px;
        }
        .page-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.7rem;
          color: var(--parchment);
          margin: 0 0 6px;
        }
        .page-sub {
          font-size: 0.88rem;
          color: var(--fog);
          margin: 0 0 20px;
        }
        .warn {
          color: var(--danger);
          background: rgba(196, 84, 74, 0.1);
          border: 1px solid rgba(196, 84, 74, 0.3);
          padding: 10px 16px;
          border-radius: 6px;
          margin-bottom: 32px;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 44px;
        }
        .stat {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(201, 162, 39, 0.15);
          border-radius: 8px;
          padding: 18px 20px;
        }
        .stat-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.66rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--brass-soft);
          margin-bottom: 8px;
        }
        .stat-value {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.7rem;
          color: var(--parchment);
        }
        .stat-sub {
          font-size: 0.76rem;
          color: var(--fog);
          margin-top: 4px;
        }
        .section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .section-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.2rem;
          color: var(--parchment);
          margin: 0;
        }
        .upload-btn {
          background: var(--brass);
          color: var(--ink);
          border: none;
          padding: 10px 18px;
          border-radius: 4px;
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 600;
          font-size: 0.86rem;
          cursor: pointer;
        }
        .upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .upload-form {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(201, 162, 39, 0.2);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .form-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }
        .upload-form input,
        .upload-form select,
        .upload-form textarea {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(159, 176, 192, 0.25);
          color: var(--parchment);
          padding: 10px 12px;
          border-radius: 4px;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 0.9rem;
          flex: 1;
          min-width: 140px;
        }
        .check-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--fog);
          font-size: 0.9rem;
          white-space: nowrap;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
        }
        th {
          text-align: left;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--brass-soft);
          padding: 10px 14px;
          border-bottom: 1px solid rgba(201, 162, 39, 0.2);
        }
        td {
          padding: 14px;
          font-size: 0.86rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          vertical-align: middle;
        }
        .book-title-cell {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          color: var(--parchment);
        }
        .status {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .status-draft {
          background: rgba(159, 176, 192, 0.15);
          color: var(--fog);
        }
        .status-published {
          background: rgba(201, 162, 39, 0.18);
          color: var(--brass-soft);
        }
        .row-actions {
          display: flex;
          gap: 8px;
        }
        .action-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          padding: 6px 12px;
          border-radius: 3px;
          border: 1px solid rgba(159, 176, 192, 0.3);
          background: transparent;
          color: var(--fog);
          cursor: pointer;
        }
        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .action-btn.publish {
          border-color: rgba(201, 162, 39, 0.4);
          color: var(--brass-soft);
        }
        .action-btn.danger {
          border-color: rgba(196, 84, 74, 0.4);
          color: var(--danger);
        }
        .mono {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
        }
      `}</style>
    </>
  );
}
