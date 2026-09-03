"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabaseClient";

export default function BookReaderPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBook() {
      const { data, error: fetchError } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .eq("status", "published")
        .maybeSingle();

      if (fetchError) setError("This book could not be loaded.");
      else if (!data) setError("This book is unavailable or not published.");
      else setBook(data);
      setLoading(false);
    }

    if (id) loadBook();
  }, [id]);

  const accent = book?.wing === "web3" ? "teal" : "brass";
  const backHref = book?.wing === "web3" ? "/web3" : "/educational";

  if (loading) return <main className="state">Loading book...</main>;

  if (error) {
    return (
      <main className="state">
        <p>{error}</p>
        <Link href="/">Back to StudyBench</Link>
      </main>
    );
  }

  if (!book.is_free) {
    const amazonUrl = book.amazon_query
      ? `https://www.amazon.com/s?k=${encodeURIComponent(book.amazon_query)}`
      : null;

    return (
      <>
        <Nav accent={accent} />
        <main className="state">
          <p>This title is listed for purchase and is not hosted on StudyBench.</p>
          {amazonUrl && <a href={amazonUrl} target="_blank" rel="noreferrer">View on Amazon</a>}
          <Link href={backHref}>Back to library</Link>
        </main>
      </>
    );
  }

  const hasHostedContent = Boolean(book.content?.trim());
  const hasOpenSource = Boolean(book.source_url);

  return (
    <>
      <Nav accent={accent} />
      <main className={`reader ${book.wing === "web3" ? "web3" : "educational"}`}>
        <Link href={backHref} className="back">← Back to {book.wing === "web3" ? "Web3" : "Educational"}</Link>
        <header>
          <p className="meta">{book.category} · Free</p>
          <h1>{book.title}</h1>
          {book.description && <p className="description">{book.description}</p>}
        </header>

        {hasOpenSource && !hasHostedContent && (
          <section className="source-box">
            <div>
              <p className="source-label">Open textbook source</p>
              <strong>{book.source_name || "Open textbook"}</strong>
              {book.license_name && <span>Licensed under {book.license_name}</span>}
            </div>
            <a href={book.source_url} target="_blank" rel="noreferrer">Open full textbook</a>
          </section>
        )}

        <article className={hasOpenSource && !hasHostedContent ? "open-reader" : ""}>
          {hasHostedContent ? (
            book.content.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph.trim()}</p>)
          ) : hasOpenSource ? (
            <>
              <div className="open-intro">
                <h2>Read this open textbook</h2>
                <p>
                  This free title is provided from its openly licensed source. StudyBench keeps the source and license visible so the original authors and publisher remain properly credited.
                </p>
                <a className="read-source" href={book.source_url} target="_blank" rel="noreferrer">Start reading the full book</a>
              </div>
              <div className="attribution">
                <strong>Attribution</strong>
                <span>{book.title} · {book.source_name || "Open textbook"}</span>
                {book.license_name && (
                  book.license_url
                    ? <a href={book.license_url} target="_blank" rel="noreferrer">{book.license_name}</a>
                    : <span>{book.license_name}</span>
                )}
                <a href={book.source_url} target="_blank" rel="noreferrer">Original free edition</a>
              </div>
            </>
          ) : (
            <div className="empty-content">
              <h2>Content coming soon</h2>
              <p>This title is published in the library, but its reading content has not been added yet.</p>
            </div>
          )}
        </article>
      </main>
      <Footer />

      <style jsx>{`
        .reader{max-width:860px;margin:0 auto;padding:44px clamp(20px,5vw,54px) 90px}.back{display:inline-block;margin-bottom:32px;color:var(--fog);text-decoration:none;font-family:'IBM Plex Mono',monospace;font-size:.78rem}header{padding-bottom:28px;border-bottom:1px solid rgba(201,162,39,.18)}.web3 header{border-color:rgba(111,167,154,.2)}.meta{font-family:'IBM Plex Mono',monospace;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--brass-soft)}.web3 .meta{color:var(--teal-soft)}h1{font-family:'Fraunces',serif;color:var(--parchment);font-size:clamp(2.1rem,6vw,3.6rem);line-height:1.08;margin:10px 0 14px}.description{color:var(--fog);font-size:1rem;line-height:1.7;max-width:700px}.source-box{margin-top:26px;padding:18px 20px;border:1px solid rgba(201,162,39,.24);border-radius:8px;background:rgba(255,255,255,.025);display:flex;align-items:center;justify-content:space-between;gap:18px}.source-box div{display:grid;gap:4px}.source-label{margin:0;font-family:'IBM Plex Mono',monospace;font-size:.64rem;letter-spacing:.1em;text-transform:uppercase;color:var(--brass-soft)}.source-box strong{color:var(--parchment)}.source-box span{font-size:.8rem;color:var(--fog)}.source-box>a,.read-source{font-family:'IBM Plex Mono',monospace;font-size:.76rem;text-decoration:none;color:var(--ink-deep);background:var(--brass);padding:10px 13px;border-radius:4px;font-weight:600;white-space:nowrap}article{margin-top:34px;background:#f1e7cf;color:#1b1b18;border-radius:10px;padding:clamp(24px,5vw,48px);box-shadow:0 18px 44px rgba(0,0,0,.24)}article p{font-family:Georgia,serif;font-size:1.06rem;line-height:1.85;margin:0 0 1.35em;white-space:pre-wrap}.open-reader{display:grid;gap:28px}.open-intro{text-align:left}.open-intro h2,.empty-content h2{font-family:'Fraunces',serif;margin:0 0 12px}.open-intro p{margin-bottom:22px}.read-source{display:inline-flex}.attribution{padding-top:22px;border-top:1px solid rgba(36,28,16,.18);display:grid;gap:7px;font-size:.78rem;color:#534a3a}.attribution strong{font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:.08em;font-size:.68rem}.attribution a{color:#405b53}.empty-content{text-align:center;padding:28px 10px}.state{min-height:70vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:30px;color:var(--fog);text-align:center}.state a{color:var(--brass-soft)}@media(max-width:640px){.source-box{align-items:flex-start;flex-direction:column}.source-box>a{width:100%;text-align:center}}
      `}</style>
    </>
  );
}
