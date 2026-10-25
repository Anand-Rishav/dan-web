"use client";

import LeadModalProvider from "@/components/LeadModalProvider";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <LeadModalProvider>
      <SmoothScroll />
      <CustomCursor />
      <Navbar />
      {children}
      <SiteFooter />
    </LeadModalProvider>
  );
}
