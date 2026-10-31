"use client";

import { useState } from "react";

interface ServicesGridProps {
  className?: string;
}

export default function ServicesGrid({ className = "" }: ServicesGridProps) {
  const [activeTab, setActiveTab] = useState<"services" | "tiers">("services");

  const services = [
    {
      id: 1,
      title: "YouTube Sponsorships & Dedicated Integrations",
      description:
        "High-converting 60-90s dedicated segments and integrated sponsorships with verified creators boasting 80%+ audience retention.",
      icon: "▶",
      deliverables: ["60-90s Dedicated Segment", "Pinned Comment & Description Link", "Usage Rights (60 Days)"],
      cpm: "$20 – $35 CPM",
      accent: "primary" as const,
    },
    {
      id: 2,
      title: "Reels Viral Blitz",
      description:
        "Rapid algorithmic wave orchestration across dozens of creators to dominate sound trends, Spark Ads, and vertical video feeds.",
      icon: "♪",
      deliverables: ["Custom Hook Testing", "Native Spark Ad Whitelisting", "Sound Trend Seeding"],
      cpm: "$8 – $16 CPM",
      accent: "secondary" as const,
    },
    {
      id: 3,
      title: "B2B & Founder Authority on X & LinkedIn",
      description:
        "High-signal narrative shaping and thought leadership campaigns designed to drive enterprise conversions, pipeline, and talent attraction.",
      icon: "𝕏",
      deliverables: ["Viral Thread Architecture", "Founder Quote Retweets", "LinkedIn Newsletter Feature"],
      cpm: "$45 – $80 CPM",
      accent: "primary" as const,
    },
    {
      id: 4,
      title: "Performance UGC for Meta & Google Ads",
      description:
        "Raw, authentic creator video assets engineered specifically for paid acquisition teams with hook-rate optimization.",
      icon: "🎬",
      deliverables: ["3x Hook Variations per Video", "Direct Response CTA Outros", "Full Raw B-Roll Access"],
      cpm: "$3.50 – $6.50 CPC",
      accent: "secondary" as const,
    },
    {
      id: 5,
      title: "FTC Compliance & Ironclad Contracting",
      description:
        "End-to-end legal clearance, exclusivity clauses, perpetual digital rights negotiation, and automated escrow payout protection.",
      icon: "🛡️",
      deliverables: ["FTC / Clear Disclosure Auditing", "Strict Exclusivity Windows", "Milestone-Based Escrow"],
      cpm: "100% Risk Protected",
      accent: "primary" as const,
    },
    {
      id: 6,
      title: "Real-Time Attribution & ROAS Telemetry",
      description:
        "Proprietary multi-touch tracking, creator promo code governance, and incrementality lift testing to measure true revenue impact.",
      icon: "📊",
      deliverables: ["UTM & Server-Side Pixel Tracking", "Incrementality Lift Report", "Live Client Dashboard"],
      cpm: "Live 24/7 Portal",
      accent: "secondary" as const,
    },
  ];

  const creatorTiers = [
    {
      tier: "Nano Creators",
      reach: "10K – 50K Followers",
      engagement: "6.5% – 11.2% Avg Engagement",
      pricing: "$500 – $2,500 / post",
      useCase: "Grassroots community trust, hyper-niche hyper-local conversion, massive authentic comment sentiment.",
      bestFor: "D2C launches, early adopter acquisition, niche B2B tools.",
    },
    {
      tier: "Micro Creators",
      reach: "50K – 250K Followers",
      engagement: "4.2% – 7.8% Avg Engagement",
      pricing: "$2,500 – $8,500 / integration",
      useCase: "The sweet spot of high ROI, dependable reach, and audience intimacy with strong CPM efficiency.",
      bestFor: "Scalable performance marketing, SaaS trials, app installs.",
    },
    {
      tier: "Macro Creators",
      reach: "250K – 1M Followers",
      engagement: "2.8% – 5.1% Avg Engagement",
      pricing: "$8,500 – $30,000 / deal",
      useCase: "Broad cultural awareness, instant social proof, mass category authority, and multi-channel reach.",
      bestFor: "Product launches, funding announcements, viral momentum.",
    },
    {
      tier: "Celebrity & A-List",
      reach: "1M+ Followers",
      engagement: "1.9% – 4.0% Avg Engagement",
      pricing: "$30,000+ / campaign",
      useCase: "Mainstream cultural dominance, nationwide PR pickups, brand-defining partnerships.",
      bestFor: "Flagship global brand campaigns, Super Bowl alternatives.",
    },
  ];

  return (
    <section className={`py-20 relative ${className}`} id="services">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary-400 mb-3">
            Platform Capabilities & Economics
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Engineered For Scale.{" "}
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Built For ROI.
            </span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Full-service campaign orchestration spanning talent scouting, script writing, creative direction, legal contracting, and real-time conversion telemetry.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] mt-8">
            <button
              onClick={() => setActiveTab("services")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "services"
                  ? "bg-primary-500 text-gray-950 shadow-[0_0_20px_rgba(0,188,212,0.3)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Agency Capabilities
            </button>
            <button
              onClick={() => setActiveTab("tiers")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "tiers"
                  ? "bg-secondary-500 text-white shadow-[0_0_20px_rgba(156,39,176,0.3)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Creator Tiers & CPM Benchmarks
            </button>
          </div>
        </div>

        {activeTab === "services" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className={`group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 ${
                  service.accent === "primary"
                    ? "hover:border-primary-500/30 hover:shadow-[0_10px_30px_rgba(0,188,212,0.1)]"
                    : "hover:border-secondary-500/30 hover:shadow-[0_10px_30px_rgba(156,39,176,0.1)]"
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                      service.accent === "primary"
                        ? "bg-primary-500/10 border border-primary-500/20 text-primary-400"
                        : "bg-secondary-500/10 border border-secondary-500/20 text-secondary-400"
                    }`}
                  >
                    {service.icon}
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-300">
                    {service.cpm}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-primary-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Key Deliverables</p>
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                      <span className="text-primary-400">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {creatorTiers.map((t, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl hover:border-secondary-500/30 transition-all duration-300"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h3 className="text-xl font-bold text-white">{t.tier}</h3>
                  <span className="text-xs font-mono font-semibold text-secondary-300 bg-secondary-500/10 border border-secondary-500/30 px-3 py-1 rounded-full">
                    {t.pricing}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-400 mb-5">
                  <span className="text-primary-400">{t.reach}</span>
                  <span>•</span>
                  <span className="text-emerald-400">{t.engagement}</span>
                </div>
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                  {t.useCase}
                </p>
                <div className="pt-4 border-t border-white/[0.06] text-xs text-gray-400">
                  <strong className="text-white">Ideal Strategy:</strong> {t.bestFor}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}