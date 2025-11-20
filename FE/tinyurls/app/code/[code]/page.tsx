"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type LinkData = {
  code: string;
  original_url?: string;
  originalUrl?: string;
  short_url?: string;
  shortUrl?: string;
  title?: string;
  created_at?: string;
  click_count?: number;
};

export default function LinkDetailsPage() {
  const params = useParams<{ code: string }>();
  const code = params.code;

  const [data, setData] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "";

  useEffect(() => {
    if (!baseUrl) {
      setError("NEXT_PUBLIC_API_URL is not set");
      setLoading(false);
      return;
    }
    if (!code) {
      setError("No code provided");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/api/links/${code}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          setError("Link not found");
          setData(null);
        } else {
          const json = await res.json();
          setData(json.data);
          setError(null);
        }
      } catch (e) {
        console.error("Error fetching link details:", e);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl, code]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          <span>Loading link details…</span>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-sm text-slate-600">{error || "Link not found"}</div>
      </main>
    );
  }

  const createdAt = data.created_at ? new Date(data.created_at) : null;
  const formattedDate = createdAt
    ? createdAt.toLocaleString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "shortOffset",
      })
    : "";

  const originalUrl = data.original_url ?? data.originalUrl ?? "";
  const shortUrlDisplay = `${process.env.NEXT_PUBLIC_API_URL}/${data.code}`

  let hostnameTitle = "Untitled link";
  if (originalUrl) {
    try {
      hostnameTitle = `${new URL(originalUrl).hostname} – untitled`;
    } catch {
      hostnameTitle = "Untitled link";
    }
  }

  const fullShortUrl = shortUrlDisplay;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Back link */}
        <Link
          href="/"
          className="
            inline-flex items-center gap-2
            mb-4
            rounded-full
            border border-slate-200
            bg-white/70
            px-3 py-1.5
            text-xs font-medium
            text-slate-600
            shadow-sm
            hover:bg-slate-50 hover:text-slate-800
            hover:border-slate-300
            focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1
            transition-colors
          "
        >
          <span
            className="
              inline-flex h-4 w-4 items-center justify-center
              rounded-full
              bg-slate-100
              text-[10px] leading-none text-slate-500
            "
          >
            ←
          </span>
          <span>Back to list</span>
        </Link>

        {/* Card */}
        <section className="rounded-2xl bg-white shadow-sm border border-slate-100 px-6 py-5 flex flex-col gap-4">
          {/* Top: title */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  {data.title || hostnameTitle}
                </h1>
              </div>
            </div>
          </div>

          {/* Short URL + copy */}
          <div className="flex items-center gap-2">
            <a
              href={fullShortUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              {shortUrlDisplay}
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center rounded-full border cursor-pointer border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500 hover:bg-slate-50"
            >
              {copied ? "✅ Copied" : "📋 Copy"}
            </button>
          </div>

          {/* Original URL */}
          <div className="flex items-start gap-2 text-sm text-slate-700">
            <span className="mt-0.5 text-slate-400">↪</span>
            <a
              href={originalUrl}
              target="_blank"
              rel="noreferrer"
              className="break-all hover:underline"
            >
              {originalUrl}
            </a>
          </div>

          {/* Divider */}
          <hr className="border-slate-100" />

          {/* Footer row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="inline-flex items-center gap-2">
              <span className="text-slate-400">📅</span>
              <span>{formattedDate}</span>
            </div>

            <div className="inline-flex items-center gap-2">
              <span className="text-slate-400">🏷️</span>
              <span>No tags</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
