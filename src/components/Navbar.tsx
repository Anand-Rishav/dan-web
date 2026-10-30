"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useLeadModals } from "@/components/LeadModalProvider";
import { scrollToSection } from "@/lib/scrollControl";

const sectionLinks = [
  { hash: "#services", label: "Services" },
  { hash: "#talent-roster", label: "Talent Roster" },
  { hash: "#case-studies", label: "Case Studies" },
  { hash: "#roi-calculator", label: "ROI Calculator" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openBrandModal, openCreatorModal } = useLeadModals();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    setIsMobileMenuOpen(false);
    // On the homepage, smooth-scroll; elsewhere, navigate to /#section.
    if (window.location.pathname === "/") {
      e.preventDefault();
      scrollToSection(hash);
    }
  };

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo: dan wordmark, dark-optimized variant (white "a"), floating */}
        <Link href="/" aria-label="dan Services — home" className="flex items-center">
          <Image src="/brand/dan-logo-dark.png" alt="dan" width={86} height={36} priority className="h-9 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {sectionLinks.map((link) => (
            <a
              key={link.hash}
              href={`/${link.hash}`}
              onClick={(e) => handleSectionClick(e, link.hash)}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            About
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => openBrandModal()}
            className="h-9 px-5 text-sm font-medium bg-primary-500 hover:bg-primary-400 text-gray-950 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,188,212,0.25)]"
          >
            Hire Creators
          </button>
          <button
            onClick={openCreatorModal}
            className="h-9 px-5 text-sm font-medium border border-secondary-500/50 text-secondary-300 hover:bg-secondary-500/10 rounded-lg transition-all duration-200"
          >
            Join Roster
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-2 bg-background/95 backdrop-blur-xl border-t border-white/[0.06] space-y-1">
          {sectionLinks.map((link) => (
            <a
              key={link.hash}
              href={`/${link.hash}`}
              onClick={(e) => handleSectionClick(e, link.hash)}
              className="block px-3 py-2.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            About
          </Link>
          <div className="flex flex-col gap-2 pt-4">
            <button
              onClick={() => { openBrandModal(); setIsMobileMenuOpen(false); }}
              className="w-full h-10 text-sm font-medium bg-primary-500 hover:bg-primary-400 text-gray-950 rounded-lg transition-colors"
            >
              Hire Creators
            </button>
            <button
              onClick={() => { openCreatorModal(); setIsMobileMenuOpen(false); }}
              className="w-full h-10 text-sm font-medium border border-secondary-500/50 text-secondary-300 hover:bg-secondary-500/10 rounded-lg transition-colors"
            >
              Join Roster
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
