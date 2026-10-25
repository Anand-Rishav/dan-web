"use client";

import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';
import { useLeadModals } from '@/components/LeadModalProvider';

const ClientHero = dynamic(() => import('@/components/ClientHero'), { ssr: false });

// The 3D hero pulls a ~240KB three.js bundle. Phones and low-core devices
// never show it anyway, so gate it here — the chunk isn't even requested
// unless the device is a capable desktop (>=4 cores, viewport >= md).
const SMALL_SCREEN = '(max-width: 767px)';

function subscribeToScreen(cb: () => void) {
  const mq = window.matchMedia(SMALL_SCREEN);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function getCapableOf3D() {
  return navigator.hardwareConcurrency >= 4 && !window.matchMedia(SMALL_SCREEN).matches;
}

export default function Hero() {
  const { openBrandModal, openCreatorModal } = useLeadModals();
  const capableOf3D = useSyncExternalStore(subscribeToScreen, getCapableOf3D, () => false);
  const platformBadges = [
    { platform: "YouTube", stat: "500M+ Views", icon: "▶", color: "hover:border-red-500/40" },
    { platform: "TikTok", stat: "820M+ Views", icon: "♪", color: "hover:border-cyan-500/40" },
    { platform: "Instagram", stat: "340M+ Reach", icon: "📷", color: "hover:border-pink-500/40" },
    { platform: "X (Twitter)", stat: "160M+ Impr", icon: "𝕏", color: "hover:border-white/40" },
    { platform: "LinkedIn", stat: "45M+ B2B", icon: "in", color: "hover:border-blue-500/40" },
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between" id="hero">
      {/* 3D Canvas Background — desktop-class devices only (see gate above) */}
      {capableOf3D && <ClientHero />}

      {/* Atmospheric gradient overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/40 via-background/20 to-background pointer-events-none" />

      {/* Radial neon glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px] pointer-events-none z-[1]" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-secondary-500/10 rounded-full blur-[130px] pointer-events-none z-[1]" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-32 pb-16 text-center">
        <div className="max-w-4xl space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            <span className="text-xs font-mono font-medium tracking-widest uppercase text-gray-300">
              Elite Influencer Marketing Agency
            </span>
          </div>

          {/* Punchy Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
            Engineering Viral Cultural Moments &{" "}
            <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-secondary-400 bg-clip-text text-transparent">
              High-ROI Creator Campaigns.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-normal">
            We partner with hyper-scaling tech, gaming, SaaS, and direct-to-consumer brands to orchestrate high-converting creator campaigns that dominate cultural feeds and convert audiences into pipeline.
          </p>

          {/* Dynamic Platform Badges */}
          <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
            {platformBadges.map((badge) => (
              <div
                key={badge.platform}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06] backdrop-blur-md text-xs font-mono transition-all duration-300 ${badge.color}`}
              >
                <span className="text-primary-400 text-xs">{badge.icon}</span>
                <span className="text-gray-300 font-medium">{badge.platform}</span>
                <span className="text-gray-500">•</span>
                <span className="text-emerald-400 font-semibold">{badge.stat}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => openBrandModal()}
              className="inline-flex h-13 items-center justify-center px-8 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-gray-950 font-semibold rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(0,188,212,0.35)] hover:shadow-[0_0_45px_rgba(0,188,212,0.5)] hover:-translate-y-0.5 text-sm md:text-base"
            >
              Launch Campaign →
            </button>
            <button
              type="button"
              onClick={openCreatorModal}
              className="inline-flex h-13 items-center justify-center px-8 border border-secondary-500/50 bg-secondary-500/5 text-secondary-300 hover:bg-secondary-500/15 hover:border-secondary-500 font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(156,39,176,0.15)] hover:-translate-y-0.5 text-sm md:text-base"
            >
              Join Creator Network
            </button>
          </div>
        </div>
      </div>

      {/* Live Stats Ticker */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Creator Payouts Delivered", value: "$45M+", change: "+140% YoY", color: "text-emerald-400" },
            { label: "Total Impressions Generated", value: "1.2B+", change: "Across 5 Channels", color: "text-cyan-400" },
            { label: "Campaign Client Retention", value: "98.4%", change: "Industry Benchmark", color: "text-primary-300" },
            { label: "Verified Creator Fleet", value: "450+", change: "Vetted & Exclusive", color: "text-secondary-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl text-center hover:border-white/[0.12] transition-all duration-300"
            >
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-mono tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 font-medium mt-1">{stat.label}</p>
              <span className={`inline-block mt-2 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/[0.03] ${stat.color}`}>
                {stat.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}