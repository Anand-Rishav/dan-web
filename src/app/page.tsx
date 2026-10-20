"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PlatformMarquee from "@/components/PlatformMarquee";
import ROICalculator from "@/components/ROICalculator";
import TalentRoster from "@/components/TalentRoster";
import CampaignShowcase from "@/components/CampaignShowcase";
import ServicesGrid from "@/components/ServicesGrid";
import BrandIntakeModal from "@/components/BrandIntakeModal";
import CreatorApplicationModal from "@/components/CreatorApplicationModal";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);

  const openBrandModalWithContext = () => {
    setIsBrandModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-background relative selection:bg-primary-500 selection:text-white">
      <SmoothScroll />
      <CustomCursor />

      <Navbar
        onOpenBrandModal={() => setIsBrandModalOpen(true)}
        onOpenCreatorModal={() => setIsCreatorModalOpen(true)}
      />

      <Hero
        onOpenBrandModal={() => setIsBrandModalOpen(true)}
        onOpenCreatorModal={() => setIsCreatorModalOpen(true)}
      />

      <PlatformMarquee />

      <ServicesGrid />

      <ROICalculator
        onOpenBrandModal={openBrandModalWithContext}
      />

      <TalentRoster
        onOpenBrandModal={openBrandModalWithContext}
      />

      <CampaignShowcase />

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-16 bg-background relative z-10" id="about">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-white tracking-tight">DAN SERVICES</span>
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                Engineering viral cultural moments & high-ROI creator campaigns across YouTube, Instagram, X (Twitter), LinkedIn, and TikTok.
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs font-mono text-gray-500">
                <span>NEW YORK</span>
                <span>•</span>
                <span>LOS ANGELES</span>
                <span>•</span>
                <span>LONDON</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-200 mb-3 tracking-wide">Agency Navigation</h4>
              <div className="space-y-2.5">
                {[
                  { name: "Services & Capabilities", href: "#services" },
                  { name: "Curated Talent Fleet", href: "#talent-roster" },
                  { name: "Verified Case Studies", href: "#case-studies" },
                  { name: "ROI Forecasting Engine", href: "#roi-calculator" },
                  { name: "About DAN Services", href: "/about" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-200 mb-3 tracking-wide">Client & Creator Action</h4>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(true)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-primary-500/10 border border-primary-500/30 text-xs font-semibold text-primary-300 hover:bg-primary-500 hover:text-white transition-all shadow-[0_0_15px_rgba(0,188,212,0.15)]"
                >
                  Hire Creators & Launch Campaign →
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatorModalOpen(true)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-secondary-500/10 border border-secondary-500/30 text-xs font-semibold text-secondary-300 hover:bg-secondary-500 hover:text-white transition-all shadow-[0_0_15px_rgba(156,39,176,0.15)]"
                >
                  Join Creator Fleet Application →
                </button>
              </div>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© 2026 DAN SERVICES LLC. All rights reserved. FTC Compliant & Certified Partner.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-gray-400 cursor-pointer">Terms of Agency Engagement</span>
              <span className="hover:text-gray-400 cursor-pointer">FTC Compliance Disclosure</span>
            </div>
          </div>
        </div>
      </footer>

      <BrandIntakeModal isOpen={isBrandModalOpen} onClose={() => setIsBrandModalOpen(false)} />
      <CreatorApplicationModal isOpen={isCreatorModalOpen} onClose={() => setIsCreatorModalOpen(false)} />
    </main>
  );
}