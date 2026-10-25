"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import BrandIntakeModal from "@/components/BrandIntakeModal";
import CreatorApplicationModal from "@/components/CreatorApplicationModal";
import { startScroll, stopScroll } from "@/lib/scrollControl";

export interface BrandModalPrefill {
  /** Numeric budget (e.g. from the ROI calculator slider) mapped onto the intake form's budget buckets. */
  budget?: number;
  /** Creator the brand is interested in booking (e.g. from the "Book Creator" button). */
  creatorName?: string;
  /** Platform values to preselect, matching BrandIntakeModal's option values. */
  platforms?: string[];
}

interface LeadModalContextValue {
  openBrandModal: (prefill?: BrandModalPrefill) => void;
  openCreatorModal: () => void;
}

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function useLeadModals(): LeadModalContextValue {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error("useLeadModals must be used within <LeadModalProvider>");
  return ctx;
}

export default function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [brandPrefill, setBrandPrefill] = useState<BrandModalPrefill | undefined>(undefined);

  const openBrandModal = useCallback((prefill?: BrandModalPrefill) => {
    setBrandPrefill(prefill);
    setIsBrandModalOpen(true);
  }, []);

  const openCreatorModal = useCallback(() => {
    setIsCreatorModalOpen(true);
  }, []);

  // Pause the Lenis smooth scroller while any modal is open, otherwise wheel
  // input keeps scrolling the page behind the dialog.
  useEffect(() => {
    if (isBrandModalOpen || isCreatorModalOpen) {
      stopScroll();
    } else {
      startScroll();
    }
  }, [isBrandModalOpen, isCreatorModalOpen]);

  const value = useMemo(
    () => ({ openBrandModal, openCreatorModal }),
    [openBrandModal, openCreatorModal]
  );

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      <BrandIntakeModal
        isOpen={isBrandModalOpen}
        prefill={brandPrefill}
        onClose={() => setIsBrandModalOpen(false)}
      />
      <CreatorApplicationModal
        isOpen={isCreatorModalOpen}
        onClose={() => setIsCreatorModalOpen(false)}
      />
    </LeadModalContext.Provider>
  );
}
