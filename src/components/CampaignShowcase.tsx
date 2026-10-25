"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface Campaign {
  id: number;
  brand: string;
  category: string;
  creatorFleet: string;
  headline: string;
  deliverables: string[];
  results: {
    roas: string;
    impressions: string;
    conversions: string;
    highlight: string;
  };
  thumbnail: string;
  overview: string;
  platforms: string[];
}

const campaigns: Campaign[] = [
  {
    id: 1,
    brand: "Apex Legends (EA)",
    category: "Gaming & Esports",
    creatorFleet: "28 Top Gaming Streamers & YouTubers",
    headline: "Season Launch Creator Takeover",
    deliverables: ["Dedicated YouTube Integrations", "Twitch Drops Activation", "TikTok Sound Trend Blitz"],
    results: {
      roas: "+420% ROAS",
      impressions: "18.4M Organic Views",
      conversions: "320K New Player Installs",
      highlight: "#1 Trending on YouTube for 48 Hours",
    },
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop",
    overview:
      "Orchestrated a synchronized 48-hour launch blitz across 28 tier-1 gaming creators. By combining custom Twitch Drops with dedicated YouTube gameplay deep dives, we drove unprecedented viral velocity and record player acquisition.",
    platforms: ["YouTube", "Twitch", "TikTok"],
  },
  {
    id: 2,
    brand: "Shopify",
    category: "SaaS & Enterprise B2B",
    creatorFleet: "45 Founder & E-Commerce Influencers",
    headline: "Global Founder Narrative on X & LinkedIn",
    deliverables: ["Viral Thought Leadership Threads", "Executive Founder Interviews", "Interactive Store Teardowns"],
    results: {
      roas: "5.4x Attributed Pipeline",
      impressions: "12.8M Targeted Views",
      conversions: "14,200 New Merchant Trials",
      highlight: "+85% Increase in Enterprise Inquiries",
    },
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    overview:
      "Activated an elite network of tech founders, angel investors, and e-commerce moguls to publish authentic case studies explaining why high-volume brands migrate to Shopify Plus. The campaign generated viral traction among C-suite decision-makers.",
    platforms: ["X (Twitter)", "LinkedIn", "YouTube"],
  },
  {
    id: 3,
    brand: "NordVPN",
    category: "Consumer Tech & Security",
    creatorFleet: "60 Tech & Education Creators",
    headline: "High-Converting Dedicated Mid-Roll Blitz",
    deliverables: ["60s Custom Creative Mid-Rolls", "Pinned Affiliate Offers", "Shorts Repurposing"],
    results: {
      roas: "+380% Direct ROAS",
      impressions: "24.5M Verified Views",
      conversions: "48,500 Subscriptions Sold",
      highlight: "Lowest CPA in Brand History ($14.20)",
    },
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop",
    overview:
      "Replaced generic promo reads with bespoke narrative-driven sketches tailored to each creator's unique audience lore. Resulted in a 4.2x higher click-through rate compared to industry benchmarks.",
    platforms: ["YouTube", "Instagram", "TikTok"],
  },
  {
    id: 4,
    brand: "Notion",
    category: "Productivity & AI SaaS",
    creatorFleet: "35 Aesthetic & Workspace Creators",
    headline: "TikTok & Reels Workspace Aesthetic Blitz",
    deliverables: ["Template Distribution Blitz", "Before/After Workflow Reels", "UGC Spark Ads Whitelisting"],
    results: {
      roas: "+490% Attributed ROAS",
      impressions: "31.2M Video Views",
      conversions: "94,000 Template Downloads",
      highlight: "Top 3 Most Shared Productivity App on TikTok",
    },
    thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=500&fit=crop",
    overview:
      "Tapped into the 'aesthetic desk setup' cultural trend. Creators shared downloadable Notion life-organizer templates directly in bio links, converting casual scrollers into lifetime software subscribers.",
    platforms: ["TikTok", "Instagram", "YouTube"],
  },
  {
    id: 5,
    brand: "Gymshark",
    category: "Athleisure & Fitness",
    creatorFleet: "20 Pro Athletes & Fitness Icons",
    headline: "Black Friday Direct-Response Campaign",
    deliverables: ["Athlete Workout Series", "Exclusive Early-Access Codes", "Instagram Stories Countdown"],
    results: {
      roas: "6.1x E-Commerce ROAS",
      impressions: "45.0M Reach",
      conversions: "$2.4M Direct Attributed Revenue",
      highlight: "Sold Out Core Collection in 4 Hours",
    },
    thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&h=500&fit=crop",
    overview:
      "Timed exclusive athlete capsule codes across 20 high-energy fitness creators on Instagram and TikTok right at the drop hour. Created an online frenzy that generated over $2.4M in tracked revenue within 24 hours.",
    platforms: ["Instagram", "TikTok", "YouTube"],
  },
];

interface CampaignShowcaseProps {
  className?: string;
}

export default function CampaignShowcase({ className = "" }: CampaignShowcaseProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  return (
    <section className={`py-20 relative ${className}`} id="case-studies">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary-400 mb-3">
            Proven Cultural Impact
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Case Studies & Proof of Performance
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
            Detailed breakdowns of how our data-engineered creator campaigns deliver record ROAS and category-defining cultural moments.
          </p>
        </div>

        {/* Campaign Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              onClick={() => setSelectedCampaign(camp)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={camp.thumbnail}
                    alt={`${camp.brand} campaign showcase`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/60 backdrop-blur-md text-primary-300 border border-white/[0.1]">
                      {camp.category}
                    </span>
                  </div>

                  {/* Headline & ROAS badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">
                        {camp.brand}
                      </h3>
                      <p className="text-xs text-gray-300">{camp.headline}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {camp.results.roas}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {camp.overview}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-xs">
                    <div>
                      <span className="text-gray-500 block text-[11px]">Impressions</span>
                      <span className="font-mono font-semibold text-white">{camp.results.impressions}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[11px]">Outcome</span>
                      <span className="font-mono font-semibold text-cyan-300">{camp.results.conversions}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2">
                <div className="flex items-center justify-between text-xs text-primary-400 font-medium group-hover:underline">
                  <span>Explore Full Breakdown</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Modal */}
        <Dialog
          open={selectedCampaign !== null}
          onClose={() => setSelectedCampaign(null)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" aria-hidden="true" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel className="bg-gray-950 rounded-2xl max-w-2xl w-full border border-white/[0.1] relative shadow-2xl p-6 md:p-8">
                <button
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-lg"
                  onClick={() => setSelectedCampaign(null)}
                  aria-label="Close modal"
                >
                  ×
                </button>

                {selectedCampaign && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-md bg-primary-500/10 text-primary-300 border border-primary-500/20">
                        {selectedCampaign.category}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                        {selectedCampaign.results.roas}
                      </span>
                    </div>

                    <DialogTitle className="text-2xl md:text-3xl font-bold text-white mt-2">
                      {selectedCampaign.brand}
                    </DialogTitle>
                    <p className="text-sm text-gray-400 font-medium mt-1">
                      {selectedCampaign.headline}
                    </p>

              {/* Highlight Banner */}
              <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-transparent border border-white/[0.08] flex items-center gap-3">
                <span className="text-xl">🏆</span>
                <span className="text-sm font-semibold text-white">
                  {selectedCampaign.results.highlight}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 my-6">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                  <span className="text-[11px] text-gray-500 uppercase block">Total Reach</span>
                  <span className="font-mono text-base md:text-lg font-bold text-white mt-0.5 block">
                    {selectedCampaign.results.impressions}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                  <span className="text-[11px] text-gray-500 uppercase block">Total ROAS</span>
                  <span className="font-mono text-base md:text-lg font-bold text-emerald-400 mt-0.5 block">
                    {selectedCampaign.results.roas}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                  <span className="text-[11px] text-gray-500 uppercase block">Conversions</span>
                  <span className="font-mono text-base md:text-lg font-bold text-cyan-300 mt-0.5 block">
                    {selectedCampaign.results.conversions}
                  </span>
                </div>
              </div>

              {/* Overview */}
              <div className="space-y-4 text-xs md:text-sm text-gray-300 leading-relaxed">
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-2">Campaign Strategy & Execution</h4>
                  <p>{selectedCampaign.overview}</p>
                </div>

                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-2">Key Deliverables</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-400">
                    {selectedCampaign.deliverables.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-2">Creator Fleet Activated</h4>
                  <p className="text-gray-400">{selectedCampaign.creatorFleet}</p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCampaign(null)}
                  className="flex-1 h-11 bg-white/[0.05] text-gray-300 rounded-xl hover:bg-white/[0.1] font-medium transition-all text-sm"
                >
                  Close Case Study
                </button>
                <Link
                  href="/#roi-calculator"
                  onClick={() => setSelectedCampaign(null)}
                  className="flex-1 h-11 flex items-center justify-center bg-primary-500 hover:bg-primary-400 text-gray-950 font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(0,188,212,0.3)] text-sm"
                >
                  Calculate Your Campaign ROI →
                </Link>
              </div>
                  </>
                )}
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>
    </section>
  );
}