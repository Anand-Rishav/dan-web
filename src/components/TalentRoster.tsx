"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useLeadModals } from "@/components/LeadModalProvider";
import { platformValue } from "@/lib/platforms";

interface Creator {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  platforms: { name: string; followers: string }[];
  niche: string;
  engagementRate: number;
  avgViews: string;
  demographics: string;
  recentBrands: string[];
}

const creators: Creator[] = [
  {
    id: 1,
    name: "Alex Chen",
    handle: "@techpulse_alex",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces",
    verified: true,
    platforms: [
      { name: "YouTube", followers: "1.4M" },
      { name: "X / Twitter", followers: "620K" },
    ],
    niche: "Tech & AI",
    engagementRate: 6.4,
    avgViews: "340K / video",
    demographics: "68% Male, 22-38 yrs, US/UK/DE",
    recentBrands: ["Notion", "Linear", "Raycast", "Vercel"],
  },
  {
    id: 2,
    name: "Maria Garcia",
    handle: "@mariaglows",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=faces",
    verified: true,
    platforms: [
      
      { name: "Instagram", followers: "1.9M" },
    ],
    niche: "D2C & Lifestyle",
    engagementRate: 8.1,
    avgViews: "850K / reel",
    demographics: "78% Female, 18-34 yrs, US/CA/AU",
    recentBrands: ["Glossier", "Gymshark", "Liquid I.V.", "Cider"],
  },
  {
    id: 3,
    name: "James Wilson",
    handle: "@jwilson_macro",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces",
    verified: true,
    platforms: [
      { name: "X / Twitter", followers: "780K" },
      { name: "LinkedIn", followers: "420K" },
    ],
    niche: "Finance & Web3",
    engagementRate: 5.2,
    avgViews: "180K / thread",
    demographics: "82% Professionals, 25-45 yrs, Global Fintech",
    recentBrands: ["Stripe", "Kraken", "Brex", "Carta"],
  },
  {
    id: 4,
    name: "Priya Patel",
    handle: "@priya_fitfuel",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&crop=faces",
    verified: true,
    platforms: [
      { name: "YouTube", followers: "950K" },
      { name: "Instagram", followers: "710K" },
    ],
    niche: "Fitness",
    engagementRate: 7.0,
    avgViews: "410K / video",
    demographics: "58% Female, 20-35 yrs, US/UK/IN",
    recentBrands: ["Gymshark", "MyProtein", "WHOOP", "Oura"],
  },
  {
    id: 5,
    name: "Marcus Vance",
    handle: "@vancegaming",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces",
    verified: true,
    platforms: [
      
      { name: "YouTube", followers: "1.8M" },
    ],
    niche: "Gaming",
    engagementRate: 8.9,
    avgViews: "1.2M / short",
    demographics: "74% Gen Z, 16-28 yrs, US/EU",
    recentBrands: ["Electronic Arts", "Razer", "Discord", "GFUEL"],
  },
  {
    id: 6,
    name: "Sophie Laurent",
    handle: "@sophieluxe",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=faces",
    verified: true,
    platforms: [
      { name: "Instagram", followers: "2.4M" },
      
    ],
    niche: "D2C & Lifestyle",
    engagementRate: 6.9,
    avgViews: "620K / reel",
    demographics: "72% Female, 22-38 yrs, US/FR/UK",
    recentBrands: ["Dior Beauty", "Shopify", "Revolve", "Anine Bing"],
  },
];

interface TalentRosterProps {
  className?: string;
}

export default function TalentRoster({ className = "" }: TalentRosterProps) {
  const { openBrandModal } = useLeadModals();
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [nicheFilter, setNicheFilter] = useState<string>("all");
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  const bookCreator = (creator: Creator) => {
    openBrandModal({
      creatorName: creator.name,
      platforms: creator.platforms.map((p) => platformValue(p.name)),
    });
  };

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const platformMatch =
        platformFilter === "all" ||
        creator.platforms.some((p) => p.name.toLowerCase().includes(platformFilter));
      const nicheMatch =
        nicheFilter === "all" || creator.niche.toLowerCase() === nicheFilter;
      return platformMatch && nicheMatch;
    });
  }, [platformFilter, nicheFilter]);

  const platformButtons = [
    { label: "All Platforms", value: "all" },
    { label: "YouTube", value: "youtube" },
    { label: "Instagram", value: "instagram" },
    { label: "X / LinkedIn", value: "x" },

  ];

  const nicheButtons = [
    { label: "All Niches", value: "all" },
    { label: "Tech & AI", value: "tech & ai" },
    { label: "D2C & Lifestyle", value: "d2c & lifestyle" },
    { label: "Finance & Web3", value: "finance & web3" },
    { label: "Fitness", value: "fitness" },
    { label: "Gaming", value: "gaming" },
  ];

  return (
    <section className={`py-20 relative ${className}`} id="talent-roster">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-secondary-300 mb-3">
            Elite Creator Fleet
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Curated Talent Roster
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
            Hand-vetted creators with authentic followings, high brand safety ratings, and proven direct response performance.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="grid gap-6 md:grid-cols-2 mb-10 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 block">
              Platform Filter
            </label>
            <div className="flex flex-wrap gap-2">
              {platformButtons.map((btn) => (
                <button
                  key={btn.value}
                  type="button"
                  onClick={() => setPlatformFilter(btn.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                    platformFilter === btn.value
                      ? "bg-primary-500/20 text-primary-300 border-primary-500/40 shadow-[0_0_12px_rgba(0,188,212,0.15)]"
                      : "bg-white/[0.02] text-gray-400 border-white/[0.06] hover:text-white"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 block">
              Niche Filter
            </label>
            <div className="flex flex-wrap gap-2">
              {nicheButtons.map((btn) => (
                <button
                  key={btn.value}
                  type="button"
                  onClick={() => setNicheFilter(btn.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                    nicheFilter === btn.value
                      ? "bg-secondary-500/20 text-secondary-300 border-secondary-500/40 shadow-[0_0_12px_rgba(156,39,176,0.15)]"
                      : "bg-white/[0.02] text-gray-400 border-white/[0.06] hover:text-white"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Creator Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCreators.map((creator) => (
            <div
              key={creator.id}
              className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl hover:border-primary-500/30 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <Image
                      src={creator.avatar}
                      alt={creator.name}
                      width={112}
                      height={112}
                      sizes="56px"
                      className="w-14 h-14 rounded-full border-2 border-white/[0.1] object-cover"
                    />
                    {creator.verified && (
                      <span
                        title="DAN Verified Partner"
                        className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-400 rounded-full flex items-center justify-center text-[10px] text-black font-bold border-2 border-background"
                      >
                        ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight group-hover:text-primary-300 transition-colors">
                      {creator.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{creator.handle}</p>
                    <span className="inline-block mt-1 text-[11px] font-semibold uppercase tracking-wider text-secondary-400">
                      {creator.niche}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 py-3 border-y border-white/[0.06] text-xs">
                  {creator.platforms.map((platform) => (
                    <div key={platform.name} className="flex items-center justify-between text-gray-400">
                      <span>{platform.name}</span>
                      <span className="font-mono text-white font-semibold">{platform.followers}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-gray-400">Avg Retention / Views</span>
                    <span className="font-mono text-cyan-300 font-semibold">{creator.avgViews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Engagement Rate</span>
                    <span className="font-mono text-emerald-400 font-semibold">{creator.engagementRate}%</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {creator.recentBrands.map((b) => (
                    <span key={b} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-gray-400 border border-white/[0.06]">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCreator(creator)}
                  className="flex-1 h-9 text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-gray-200 rounded-xl hover:bg-white/[0.08] transition-all"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => bookCreator(creator)}
                  className="flex-1 h-9 text-xs font-semibold bg-primary-500/20 border border-primary-500/40 text-primary-300 rounded-xl hover:bg-primary-500 hover:text-white transition-all shadow-[0_0_15px_rgba(0,188,212,0.15)]"
                >
                  Book Creator
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCreators.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No creators match your selected filters.</p>
            <button
              onClick={() => { setPlatformFilter("all"); setNicheFilter("all"); }}
              className="mt-3 text-sm text-primary-400 hover:text-primary-300 underline font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Creator Profile Modal */}
        <Dialog
          open={selectedCreator !== null}
          onClose={() => setSelectedCreator(null)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" aria-hidden="true" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel className="bg-gray-950 rounded-2xl p-6 md:p-8 max-w-lg w-full border border-white/[0.1] relative shadow-2xl">
                <button
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-lg"
                  onClick={() => setSelectedCreator(null)}
                  aria-label="Close modal"
                >
                  ×
                </button>

                {selectedCreator && (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <Image
                        src={selectedCreator.avatar}
                        alt={selectedCreator.name}
                        width={64}
                        height={64}
                        sizes="64px"
                        className="w-16 h-16 rounded-full border-2 border-primary-500/50 object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <DialogTitle className="text-xl font-bold text-white">{selectedCreator.name}</DialogTitle>
                          <span className="w-4 h-4 bg-primary-400 rounded-full flex items-center justify-center text-[9px] text-black font-bold">✓</span>
                        </div>
                        <p className="text-xs font-mono text-gray-400">{selectedCreator.handle}</p>
                        <p className="text-xs text-secondary-400 font-semibold mt-1">{selectedCreator.niche}</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Audience Demographics:</span>
                          <span className="text-white font-medium text-right">{selectedCreator.demographics}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Average Performance:</span>
                          <span className="text-cyan-300 font-mono font-semibold">{selectedCreator.avgViews}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Verified Engagement:</span>
                          <span className="text-emerald-400 font-mono font-semibold">{selectedCreator.engagementRate}%</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-400 font-semibold block mb-2">Previous Brand Collaborations</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedCreator.recentBrands.map((b) => (
                            <span key={b} className="px-3 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white font-medium">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedCreator(null)}
                        className="flex-1 h-11 bg-white/[0.05] text-gray-300 rounded-xl hover:bg-white/[0.1] font-medium transition-all"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const creator = selectedCreator;
                          setSelectedCreator(null);
                          bookCreator(creator);
                        }}
                        className="flex-1 h-11 bg-primary-500 hover:bg-primary-400 text-gray-950 font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(0,188,212,0.3)]"
                      >
                        Inquire For Campaign →
                      </button>
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