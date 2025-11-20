// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  const [targetUrl, setTargetUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<UrlRow[]>([]);
  const [error, setError] = useState("");
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUrls();
  }, []);

  async function fetchUrls() {
    if (!API_URL) return;
    setError("");
    try {
      const res = await fetch(`${API_URL}/urls`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setUrls(json.data || []);
    } catch (e) {
      console.error(e);
      setError("Could not load links. Please try again.");
    }
  }

  async function handleCreateLink(e: React.FormEvent) {
    e.preventDefault();
    if (!API_URL) {
      setError("API URL not configured");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessUrl(null);
    setSuccessCode(null);

    try {
      const res = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: targetUrl,
          shortcode: customCode || undefined,
        }),
      });

      if (res.status === 409) {
        const errJson = await res.json();
        setError(errJson.error || "This shortcode is already in use.");
      } else if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        setError(errJson.error || "Failed to create link.");
      } else {
        const data = await res.json();
        const code = data.shortcode || data.code;
        const shortUrl = data.shortUrl || `${window.location.origin}/${code}`;

        setSuccessUrl(shortUrl);
        setSuccessCode(code);
        setTargetUrl("");
        setCustomCode("");
        setShowModal(true);
        await fetchUrls();
      }
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!successUrl) return;
    try {
      await navigator.clipboard.writeText(successUrl);
      alert("Copied to clipboard!");
    } catch {
      alert("Failed to copy. Copy manually.");
    }
  }

  return (
    <>
    <div className="text-3xl font-bold text-emerald-400">
      Hello Tailwind
    </div>
      {/* Add new link */}
      <section className="mb-6 rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Add new link</h1>
        </div>

        <form
          className="grid gap-4 md:grid-cols-[2fr,1fr,auto]"
          onSubmit={handleCreateLink}
        >
          <div className="flex flex-col gap-1 md:col-span-1">
            <label className="text-sm font-medium text-slate-700">
              Target URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://open.spotify.com/search/karan"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-700/10 focus:border-slate-500 focus:ring-2"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-1">
            <label className="text-sm font-medium text-slate-700">
              Optional code
            </label>
            <input
              type="text"
              placeholder="fyu323bf"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-700/10 focus:border-slate-500 focus:ring-2"
            />
          </div>

          <div className="flex items-end md:col-span-1">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-70 md:w-auto"
            >
              {loading ? "Creating…" : "Create link"}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </section>

      {/* Table of all links */}
      <section className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-tight">All links</h2>
        </div>

        {urls.length === 0 ? (
          <p className="text-sm text-slate-600">No links created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <th className="border-b border-slate-200 px-3 py-2">
                    Short code
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2">
                    Target URL
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2">
                    Total clicks
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2">
                    Last click
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {urls.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80"
                  >
                    <td className="px-3 py-2 align-middle font-mono text-xs text-slate-800">
                      <a
                        href={`${API_URL}/${u.shortcode}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline-offset-2 hover:underline"
                      >
                        {u.shortcode}
                      </a>
                    </td>
                    <td className="max-w-xs px-3 py-2 align-middle text-slate-700">
                      <a
                        href={u.original_url}
                        target="_blank"
                        rel="noreferrer"
                        className="line-clamp-1 break-all text-xs underline-offset-2 hover:underline"
                      >
                        {u.original_url}
                      </a>
                    </td>
                    <td className="px-3 py-2 align-middle">
                      {u.click_count ?? 0}
                    </td>
                    <td className="px-3 py-2 align-middle text-xs text-slate-600">
                      {u.last_clicked_at
                        ? new Date(u.last_clicked_at).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <Link
                        href={`/links/${u.shortcode}`}
                        className="text-xs font-medium text-slate-900 underline-offset-2 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal */}
      {showModal && successUrl && successCode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold tracking-tight">
              Your link is ready
            </h2>

            <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-800 break-all">
              {successUrl}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              >
                Copy link
              </button>

              <Link
                href={`/links/${successCode}`}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
                onClick={() => setShowModal(false)}
              >
                View details
              </Link>
            </div>

            <button
              className="mt-3 text-xs font-medium text-slate-500 hover:text-slate-700"
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
