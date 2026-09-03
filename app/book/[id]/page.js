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

  if (loading) {
    return <main className="state">Loading book...</main>;
  }

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

        <article>
          {book.content?.trim() ? (
            book.content.split(/\n{2,}/).map((paragraph, index) => (
              <p key={index}>{paragraph.trim()}</p>
            ))
          ) : (
            <div className="empty-content">
              <h2>Content coming soon</h2>
              <p>This title is published in the library, but its full reading content has not been added yet.</p>
            </div>
          )}
        </article>
      </main>
      <Footer />

      <style jsx>{`
        .reader {
          max-width: 860px;
          margin: 0 auto;
          padding: 44px clamp(20px, 5vw, 54px) 90px;
        }
        .back {
          display: inline-block;
          margin-bottom: 32px;
          color: var(--fog);
          text-decoration: none;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
        }
        header {
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(201, 162, 39, 0.18);
        }
        .web3 header {
          border-color: rgba(111, 167, 154, 0.2);
        }
        .meta {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--brass-soft);
        }
        .web3 .meta {
          color: var(--teal-soft);
        }
        h1 {
          font-family: 'Fraunces', serif;
          color: var(--parchment);
          font-size: clamp(2.1rem, 6vw, 3.6rem);
          line-height: 1.08;
          margin: 10px 0 14px;
        }
        .description {
          color: var(--fog);
          font-size: 1rem;
          line-height: 1.7;
          max-width: 700px;
        }
        article {
          margin-top: 34px;
          background: #f1e7cf;
          color: #1b1b18;
          border-radius: 10px;
          padding: clamp(24px, 5vw, 48px);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.24);
        }
        article p {
          font-family: Georgia, serif;
          font-size: 1.06rem;
          line-height: 1.85;
          margin: 0 0 1.35em;
          white-space: pre-wrap;
        }
        .empty-content {
          text-align: center;
          padding: 28px 10px;
        }
        .empty-content h2 {
          font-family: 'Fraunces', serif;
          margin-bottom: 10px;
        }
        .state {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 30px;
          color: var(--fog);
          text-align: center;
        }
        .state a {
          color: var(--brass-soft);
        }
      `}</style>
    </>
  );
}
