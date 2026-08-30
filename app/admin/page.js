import Link from "next/link";

export default function AdminPage() {
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
        <p className="page-sub warn">
          ⚠ UI only right now - this route has no real access control yet. Do not treat this as protected until the
          backend auth check is added.
        </p>

        <div className="stats">
          <div className="stat">
            <div className="stat-label">Signed-up users</div>
            <div className="stat-value">-</div>
            <div className="stat-sub">connect to Supabase</div>
          </div>
          <div className="stat">
            <div className="stat-label">AI generations today</div>
            <div className="stat-value">-</div>
            <div className="stat-sub">connect to Supabase</div>
          </div>
          <div className="stat">
            <div className="stat-label">Unlimited members</div>
            <div className="stat-value">-</div>
            <div className="stat-sub">connect to Supabase</div>
          </div>
          <div className="stat">
            <div className="stat-label">Books published</div>
            <div className="stat-value">-</div>
            <div className="stat-sub">connect to Supabase</div>
          </div>
        </div>

        <div className="section-head">
          <h2 className="section-title">Book manager</h2>
          <button className="upload-btn">+ Upload new book</button>
        </div>
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
            <tr>
              <td className="book-title-cell">Yield Farming: Maximizing Returns</td>
              <td>Web3 · DeFi</td>
              <td>
                <span className="status status-draft">Draft</span>
              </td>
              <td className="mono">-</td>
              <td className="row-actions">
                <button className="action-btn publish">Publish</button>
                <button className="action-btn">Preview</button>
                <button className="action-btn danger">Delete</button>
              </td>
            </tr>
            <tr>
              <td className="book-title-cell">Understanding Blockchain Technology</td>
              <td>Web3 · Fundamentals</td>
              <td>
                <span className="status status-published">Published</span>
              </td>
              <td className="mono">-</td>
              <td className="row-actions">
                <button className="action-btn">Unpublish</button>
                <button className="action-btn">Preview</button>
                <button className="action-btn danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="note">Table shows placeholder rows - wire to a real `books` table in phase 3.</p>

        <div className="section-head">
          <h2 className="section-title">Usage &amp; payment log</h2>
        </div>
        <p className="note">Wire to `usage_log` / `profiles` tables in phase 3.</p>
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
        .action-btn.publish {
          border-color: rgba(201, 162, 39, 0.4);
          color: var(--brass-soft);
        }
        .action-btn.danger {
          border-color: rgba(196, 84, 74, 0.4);
          color: var(--danger);
        }
        .note {
          font-size: 0.78rem;
          color: var(--fog);
          font-family: 'IBM Plex Mono', monospace;
          margin: 0 0 40px;
        }
      `}</style>
    </>
  );
}
