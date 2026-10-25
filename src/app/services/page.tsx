import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ServicesGrid from "@/components/ServicesGrid";

export const metadata: Metadata = {
  title: "Services",
  description: "Full-service influencer marketing capabilities: YouTube sponsorships, TikTok/Reels blitzes, B2B thought leadership, performance UGC, FTC compliance, and ROAS telemetry.",
};

export default function ServicesPage() {
  return (
    <PageShell>
      <main className="min-h-screen bg-background pt-28">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Our Services</h1>
          <p className="text-gray-400 max-w-2xl">
            We offer a full suite of influencer marketing services tailored to your brand&apos;s needs.
            Explore our service offerings below.
          </p>
        </div>
        <ServicesGrid className="mt-6" />
      </main>
    </PageShell>
  );
}
