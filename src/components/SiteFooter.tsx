"use client";

import Link from "next/link";
import Image from "next/image";
import { useLeadModals } from "@/components/LeadModalProvider";
import { scrollToSection } from "@/lib/scrollControl";

const footerNav = [
  { name: "Services & Capabilities", hash: "#services" },
  { name: "Curated Talent Fleet", hash: "#talent-roster" },
  { name: "Verified Case Studies", hash: "#case-studies" },
  { name: "ROI Forecasting Engine", hash: "#roi-calculator" },
  { name: "About DAN Services", href: "/about" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Agency Engagement", href: "/terms" },
  { name: "FTC Compliance Disclosure", href: "/ftc-disclosure" },
];

export default function SiteFooter() {
  const { openBrandModal, openCreatorModal } = useLeadModals();

  return (
    <footer className="border-t border-white/[0.06] py-16 bg-background relative z-10" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center">
              <Image src="/brand/dan-logo-dark.png" alt="dan" width={86} height={36} className="h-9 w-auto" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Engineering viral cultural moments & high-ROI creator campaigns across YouTube, Instagram, X (Twitter), and LinkedIn.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-mono text-gray-400">
              <span>NEW YORK</span>
              <span>•</span>
              <span>LOS ANGELES</span>
              <span>•</span>
              <span>LONDON</span>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-200 mb-3 tracking-wide">Agency Navigation</h2>
            <div className="space-y-2.5">
              {footerNav.map((item) =>
                item.hash ? (
                  <a
                    key={item.name}
                    href={`/${item.hash}`}
                    onClick={(e) => {
                      // On the homepage, smooth-scroll instead of a full navigation.
                      if (window.location.pathname === "/") {
                        e.preventDefault();
                        scrollToSection(item.hash!);
                      }
                    }}
                    className="block text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href!}
                    className="block text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-200 mb-3 tracking-wide">Client & Creator Action</h2>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => openBrandModal()}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-primary-500/10 border border-primary-500/30 text-xs font-semibold text-primary-300 hover:bg-primary-500 hover:text-white transition-all shadow-[0_0_15px_rgba(0,188,212,0.15)]"
              >
                Hire Creators & Launch Campaign →
              </button>
              <button
                type="button"
                onClick={openCreatorModal}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-secondary-500/10 border border-secondary-500/30 text-xs font-semibold text-secondary-300 hover:bg-secondary-500 hover:text-white transition-all shadow-[0_0_15px_rgba(156,39,176,0.15)]"
              >
                Join Creator Fleet Application →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 DAN SERVICES LLC. All rights reserved. FTC Compliant & Certified Partner.</p>
          <div className="flex items-center gap-6">
            {legalLinks.map((item) => (
              <Link key={item.name} href={item.href} className="hover:text-gray-200 transition-colors">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
