import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <PageShell>
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-28">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary-400 font-mono">
            Error 404 — Signal Lost
          </p>

          <h1 className="text-6xl sm:text-8xl font-extrabold text-white tracking-tight leading-none">
            <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-secondary-400 bg-clip-text text-transparent">
              404
            </span>
          </h1>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            This Campaign Didn&apos;t Convert.
          </h2>

          <p className="text-base text-gray-400 max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for went dark — moved, deleted, or never
            existed. Let&apos;s get you back to content that actually performs.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/"
              className="inline-flex h-11 items-center px-8 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-gray-950 font-semibold rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(0,188,212,0.35)] text-sm"
            >
              Return to Homepage
            </Link>
            <Link
              href="/services"
              className="inline-flex h-11 items-center px-8 border border-white/[0.1] bg-white/[0.04] text-gray-200 hover:bg-white/[0.08] font-semibold rounded-xl transition-all duration-300 text-sm"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
