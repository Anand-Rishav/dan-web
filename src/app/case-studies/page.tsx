import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import CampaignShowcase from "@/components/CampaignShowcase";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "See how DAN SERVICES has helped brands achieve explosive growth through strategic creator partnerships across YouTube, Instagram, X, and LinkedIn.",
};

export default function CaseStudiesPage() {
  return (
    <PageShell>
      <main className="min-h-screen bg-background pt-28">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Case Studies</h1>
          <p className="text-gray-400 max-w-2xl">
            See how we&apos;ve helped brands achieve explosive growth through strategic creator partnerships.
          </p>
        </div>
        <CampaignShowcase className="mt-6" />
      </main>
    </PageShell>
  );
}
