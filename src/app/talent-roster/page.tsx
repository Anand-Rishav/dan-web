import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import TalentRoster from "@/components/TalentRoster";

export const metadata: Metadata = {
  title: "Talent Roster",
  description: "Browse the curated DAN SERVICES roster of top-tier creators across multiple platforms and niches.",
};

export default function TalentRosterPage() {
  return (
    <PageShell>
      <main className="min-h-screen bg-background pt-28">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Talent Roster</h1>
          <p className="text-gray-400 max-w-2xl">
            Browse our curated roster of top-tier creators across multiple platforms and niches.
          </p>
        </div>
        <TalentRoster className="mt-6" />
      </main>
    </PageShell>
  );
}
