"use client";

import PageShell from "@/components/PageShell";
import Hero from "@/components/Hero";
import PlatformMarquee from "@/components/PlatformMarquee";
import ROICalculator from "@/components/ROICalculator";
import TalentRoster from "@/components/TalentRoster";
import CampaignShowcase from "@/components/CampaignShowcase";
import ServicesGrid from "@/components/ServicesGrid";

export default function Home() {
  return (
    <PageShell>
      <main className="min-h-screen bg-background relative selection:bg-primary-500 selection:text-white">
        <Hero />
        <PlatformMarquee />
        <ServicesGrid />
        <ROICalculator />
        <TalentRoster />
        <CampaignShowcase />
      </main>
    </PageShell>
  );
}
