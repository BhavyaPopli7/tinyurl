export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">
          URL not found
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          The link you are looking for doesn’t exist or may have expired.
        </p>
        <a
          href="/"
          className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
        >
          ← Go back home
        </a>
      </div>
    </main>
  );
}
