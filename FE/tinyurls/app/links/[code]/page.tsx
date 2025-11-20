import Link from "next/link";

type PageProps = {
  params: Promise<{ code: string }>;
};

export default async function LinkDetailsPage({ params }: PageProps) {
  const { code } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }

  const res = await fetch(`${baseUrl}/links/${code}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-sm text-slate-600">Link not found</div>
      </main>
    );
  }

  const { data } = await res.json();

  const createdAt = data.created_at ? new Date(data.created_at) : null;
  const formattedDate = createdAt
    ? createdAt.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'shortOffset',
      })
    : '';

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || '';
  const shortUrlDisplay = appDomain
    ? `${appDomain}/${data.code}`
    : data.short_url ?? data.shortUrl ?? data.code;

  const originalUrl = data.original_url ?? data.originalUrl ?? '';

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
          {/* Top row: icon + title + actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  {data.title || `${new URL(originalUrl).hostname} – untitled`}
                </h1>
              </div>
            </div>
          </div>

          {/* Short URL */}
          <div className="flex items-center gap-2">
            <a
              href={shortUrlDisplay.startsWith('http') ? shortUrlDisplay : `https://${shortUrlDisplay}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              {shortUrlDisplay}
            </a>
            <button
              type="button"
              className="inline-flex items-center rounded-full border cursor-pointer border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500 hover:bg-slate-50"
            >
              📋 Copy
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

          {/* Footer row: date + tags */}
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
