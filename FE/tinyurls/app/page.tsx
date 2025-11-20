// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type UrlRow = {
  id: number;
  shortcode: string;
  original_url: string;
  created_at: string | null;
  click_count: number | null;
  last_clicked_at: string | null;
};

export default function HomePage() {
  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<UrlRow[]>([]);
  const [error, setError] = useState('');
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUrls();
  }, []);

  async function fetchUrls() {
    if (!API_URL) return;
    setError('');
    try {
      const res = await fetch(`${API_URL}/urls`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      setUrls(json.data || []);
    } catch (e) {
      console.error(e);
      setError('Could not load links. Please try again.');
    }
  }

  async function handleCreateLink(e: React.FormEvent) {
    e.preventDefault();
    if (!API_URL) {
      setError('API URL not configured');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessUrl(null);
    setSuccessCode(null);

    try {
      const res = await fetch(`${API_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalUrl: targetUrl,
          shortcode: customCode || undefined,
        }),
      });

      if (res.status === 409) {
        const errJson = await res.json();
        setError(errJson.error || 'This shortcode is already in use.');
      } else if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        setError(errJson.error || 'Failed to create link.');
      } else {
        const data = await res.json();
        // assuming backend returns { shortcode, shortUrl }
        const code = data.shortcode || data.code;
        const shortUrl =
          data.shortUrl ||
          `${window.location.origin}/${code}`;

        setSuccessUrl(shortUrl);
        setSuccessCode(code);
        setTargetUrl('');
        setCustomCode('');
        setShowModal(true);
        await fetchUrls();
      }
    } catch (e) {
      console.error(e);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!successUrl) return;
    try {
      await navigator.clipboard.writeText(successUrl);
      alert('Copied to clipboard!');
    } catch {
      alert('Failed to copy. You can copy manually.');
    }
  }

  return (
    <>
      {/* Add new link section */}
      <section className="card">
        <div className="card-header">
          <h1>Add new link</h1>
        </div>

        <form className="form" onSubmit={handleCreateLink}>
          <div className="form-group">
            <label>Target URL *</label>
            <input
              type="url"
              required
              placeholder="https://open.spotify.com/search/karan"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Optional code</label>
            <input
              type="text"
              placeholder="fyu323bf"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create link'}
          </button>

          {error && <p className="error-text">{error}</p>}
        </form>
      </section>

      {/* Table of all links */}
      <section className="card card-table">
        <div className="card-header">
          <h2>All links</h2>
        </div>

        {urls.length === 0 ? (
          <p>No links created yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Short code</th>
                  <th>Target URL</th>
                  <th>Total clicks</th>
                  <th>Last click</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <a
                        href={`${API_URL}/${u.shortcode}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {u.shortcode}
                      </a>
                    </td>
                    <td className="cell-url">
                      <a
                        href={u.original_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {u.original_url}
                      </a>
                    </td>
                    <td>{u.click_count ?? 0}</td>
                    <td>
                      {u.last_clicked_at
                        ? new Date(u.last_clicked_at).toLocaleString()
                        : '—'}
                    </td>
                    <td>
                      <Link href={`/links/${u.shortcode}`}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal / popup */}
      {showModal && successUrl && successCode && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()} // prevent close on inner click
          >
            <h2>Your link is ready</h2>

            <p className="modal-link">{successUrl}</p>

            <div className="modal-actions">
              <button onClick={handleCopy}>Copy link</button>

              <Link
                href={`/links/${successCode}`}
                className="secondary-button"
                onClick={() => setShowModal(false)}
              >
                View details
              </Link>
            </div>

            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
