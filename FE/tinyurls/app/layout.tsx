// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "TinyUrls",
  description: "Simple URL shortener dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <header className="sticky top-0 z-20 flex h-14 items-center border-b border-slate-200 bg-white px-6 shadow-sm">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-slate-900"
          >
            TinyUrls
          </Link>
        </header>

        <main className="mx-auto max-w-screen px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
