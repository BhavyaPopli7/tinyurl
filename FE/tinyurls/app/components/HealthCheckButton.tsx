"use client";

import { useState } from "react";

type HealthResponse =
  | { status: string; time?: string }
  | { error: string };

export function HealthCheckButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthResponse | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleOpen = async () => {
    if (!baseUrl) {
      setResult({ error: "NEXT_PUBLIC_API_URL is not set" });
      setOpen(true);
      return;
    }

    setOpen(true);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${baseUrl}/health`, { cache: "no-store" });
      const data = (await res.json()) as HealthResponse;
      setResult(data);
    } catch (e) {
      console.error("Health check failed:", e);
      setResult({ error: "Failed to reach health endpoint" });
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setOpen(false);
    setResult(null);
    setLoading(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="
          ml-auto
          inline-flex items-center gap-1
          rounded-full border border-emerald-200
          bg-emerald-50
          px-3 py-1.5
          text-xs font-medium
          text-emerald-700
          hover:bg-emerald-100 hover:border-emerald-300
          focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-1
          transition
        "
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span>Health check</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
          onClick={close}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">
                App health
              </h2>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xs"
              >
                ✕
              </button>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                <span>Checking database…</span>
              </div>
            ) : result ? (
              <div className="space-y-2 text-xs text-slate-700">
                {"status" in result && (
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={
                        result.status === "ok"
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }
                    >
                      {result.status}
                    </span>
                  </p>
                )}
                {"time" in result && result.time && (
                  <p>
                    <span className="font-medium">DB time:</span>{" "}
                    <span>{result.time}</span>
                  </p>
                )}
                {"error" in result && (
                  <p className="text-red-600">
                    <span className="font-medium">Error:</span>{" "}
                    {result.error}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No data.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
