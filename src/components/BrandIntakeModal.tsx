"use client";

import { useRef, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { BrandModalPrefill } from "@/components/LeadModalProvider";
import { PLATFORM_LABELS, platformValue } from "@/lib/platforms";

interface BrandIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: BrandModalPrefill;
}

type BudgetBucket = "$10k-$25k" | "$25k-$50k" | "$50k-$150k" | "$150k+";

function budgetToBucket(budget?: number): BudgetBucket {
  if (budget == null) return "$25k-$50k";
  if (budget < 25000) return "$10k-$25k";
  if (budget < 50000) return "$25k-$50k";
  if (budget <= 150000) return "$50k-$150k";
  return "$150k+";
}

export default function BrandIntakeModal({ isOpen, onClose, prefill }: BrandIntakeModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorKind, setErrorKind] = useState<"generic" | "rate">("generic");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    contactName: "",
    email: "",
    platforms: ["youtube", "instagram"] as string[],
    budget: "$25k-$50k",
    timeline: "ASAP (Within 2 weeks)",
    goal: "sales",
  });

  // Apply prefill (ROI calculator budget, booked creator context) when the
  // modal opens. Adjusting state during render on a prop change is the
  // React-recommended pattern here (no effect, no cascading render).
  const [appliedPrefill, setAppliedPrefill] = useState<BrandModalPrefill | undefined>(undefined);
  if (isOpen && prefill !== appliedPrefill) {
    setAppliedPrefill(prefill);
    if (prefill) {
      setFormData((prev) => ({
        ...prev,
        budget: prefill.budget != null ? budgetToBucket(prefill.budget) : prev.budget,
        platforms: prefill.platforms?.length ? prefill.platforms : prev.platforms,
      }));
    }
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePlatform = (platform: string) => {
    setFormData((prev) => {
      const updated = prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms: updated.length > 0 ? updated : [platform] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);
    setErrorKind("generic");

    // Accept "acme.com" as well as "https://acme.com" — the field lives on
    // step 1 but submits from step 3, so browser URL validation never runs.
    const rawWebsite = formData.website.trim();
    const website = rawWebsite
      ? (/^https?:\/\//i.test(rawWebsite) ? rawWebsite : `https://${rawWebsite}`)
      : "";

    try {
      const res = await fetch("/api/leads/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          website: website || undefined,
          contactName: formData.contactName,
          email: formData.email,
          budget: formData.budget,
          platforms: formData.platforms,
          timeline: formData.timeline,
          goal: formData.goal,
          interestedCreator: prefill?.creatorName || undefined,
          companyLinkedInUrl: honeypotRef.current?.value.trim() || undefined,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        if (res.status === 429) setErrorKind("rate");
        setIsError(true);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsSuccess(false);
      setIsError(false);
      setErrorKind("generic");
      setStep(1);
    }, 300);
  };

  const inputClasses =
    "w-full px-4 py-3 bg-white/[0.03] text-white rounded-xl border border-white/[0.08] focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all placeholder:text-gray-600 text-sm";
  const selectClasses =
    "w-full px-4 py-3 bg-white/[0.03] text-white rounded-xl border border-white/[0.08] focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all text-sm";

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="bg-gray-950 rounded-2xl p-6 md:p-8 max-w-xl w-full border border-white/[0.1] relative shadow-2xl">
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-lg"
              onClick={handleClose}
              aria-label="Close modal"
            >
              ×
            </button>

            {isSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  ✓
                </div>
                <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                  Campaign Strategy Inbound Confirmed
                </DialogTitle>
                <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                  We&apos;ve received your brand campaign specifications. Our Head of Talent Partnerships will review your brand identity and match you with 3-5 high-fit creators within 24 hours.
                </p>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left text-xs font-mono space-y-1.5 text-gray-400">
                  <div><strong className="text-white">Target Platforms:</strong> {formData.platforms.join(", ").toUpperCase()}</div>
                  <div><strong className="text-white">Allocated Budget:</strong> {formData.budget}</div>
                  <div><strong className="text-white">Timeline:</strong> {formData.timeline}</div>
                  {prefill?.creatorName && (
                    <div><strong className="text-white">Creator Interest:</strong> {prefill.creatorName}</div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 px-8 h-11 bg-primary-500 hover:bg-primary-400 text-gray-950 font-semibold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(0,188,212,0.3)]"
                >
                  Done & Return to Site
                </button>
              </div>
            ) : isError ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center text-3xl mx-auto">
                  !
                </div>
                <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                  {errorKind === "rate" ? "Too Many Attempts" : "Submission Failed"}
                </DialogTitle>
                <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                  {errorKind === "rate"
                    ? "You've submitted several requests in a short window. Please wait about 15 minutes and try again, or reach us directly at "
                    : "Something went wrong while sending your campaign strategy. Please try again in a moment, or reach us directly at "}
                  <a href="mailto:info@danservices.in" className="text-primary-300 hover:text-primary-200 underline">
                    info@danservices.in
                  </a>
                  .
                </p>
                <div className="flex gap-3 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsError(false)}
                    className="px-8 h-11 bg-primary-500 hover:bg-primary-400 text-gray-950 font-semibold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(0,188,212,0.3)]"
                  >
                    Try Again
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-8 h-11 bg-white/[0.04] border border-white/[0.08] text-gray-300 font-medium rounded-xl hover:bg-white/[0.06] text-sm transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-6">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary-400">
                    Agency Brand Strategy Intake
                  </span>
                  <DialogTitle className="text-2xl font-bold text-white mt-1">
                    Launch Your Next Campaign
                  </DialogTitle>
                  {prefill?.creatorName && (
                    <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/15 border border-primary-500/30 text-primary-300">
                      Re: Booking {prefill.creatorName}
                    </span>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Step {step} of 3</p>
                  <div className="flex gap-1.5 mt-3">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          s <= step ? "bg-primary-500 shadow-[0_0_8px_rgba(0,188,212,0.5)]" : "bg-white/[0.06]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot: parked offscreen so humans never see or tab into
                      it, but bots that auto-fill every input will. */}
                  <input
                    ref={honeypotRef}
                    type="text"
                    name="companyLinkedInUrl"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] top-0 h-0 w-0 opacity-0"
                  />
                  {step === 1 && (
                    <>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label htmlFor="brand-company" className="text-xs font-semibold text-gray-300 mb-1.5 block">Company Name</label>
                          <input
                            id="brand-company"
                            type="text"
                            required
                            placeholder="Acme Corp"
                            value={formData.companyName}
                            onChange={(e) => handleChange("companyName", e.target.value)}
                            className={inputClasses}
                          />
                        </div>
                        <div>
                          <label htmlFor="brand-website" className="text-xs font-semibold text-gray-300 mb-1.5 block">Website URL</label>
                          <input
                            id="brand-website"
                            type="url"
                            placeholder="https://acme.com"
                            value={formData.website}
                            onChange={(e) => handleChange("website", e.target.value)}
                            className={inputClasses}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="brand-contact" className="text-xs font-semibold text-gray-300 mb-1.5 block">Contact Name</label>
                        <input
                          id="brand-contact"
                          type="text"
                          required
                          placeholder="Jane Doe (VP of Marketing)"
                          value={formData.contactName}
                          onChange={(e) => handleChange("contactName", e.target.value)}
                          className={inputClasses}
                        />
                      </div>

                      <div>
                        <label htmlFor="brand-email" className="text-xs font-semibold text-gray-300 mb-1.5 block">Work Email</label>
                        <input
                          id="brand-email"
                          type="email"
                          required
                          placeholder="jane@acme.com"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className={inputClasses}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={nextStep}
                        className="w-full h-11 bg-primary-500 hover:bg-primary-400 text-gray-950 font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(0,188,212,0.25)] text-sm mt-2"
                      >
                        Continue to Platforms & Budget →
                      </button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-gray-300 mb-2 block">Target Creator Platforms</label>
                        <div className="flex flex-wrap gap-2">
                          {PLATFORM_LABELS.map((p) => {
                            const val = platformValue(p);
                            const isSelected = formData.platforms.includes(val);
                            return (
                              <button
                                key={p}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => togglePlatform(val)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  isSelected
                                    ? "bg-primary-500/20 text-primary-300 border border-primary-500/40 shadow-[0_0_12px_rgba(0,188,212,0.15)]"
                                    : "bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:text-white"
                                }`}
                              >
                                {p}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="brand-budget" className="text-xs font-semibold text-gray-300 mb-1.5 block">Campaign Budget Allocation</label>
                        <select
                          id="brand-budget"
                          value={formData.budget}
                          onChange={(e) => handleChange("budget", e.target.value)}
                          className={selectClasses}
                        >
                          <option value="$10k-$25k">$10,000 – $25,000 (Emerging Test)</option>
                          <option value="$25k-$50k">$25,000 – $50,000 (Growth Sprint)</option>
                          <option value="$50k-$150k">$50,000 – $150,000 (Category Blitz)</option>
                          <option value="$150k+">$150,000+ (Omnichannel Dominance)</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="brand-timeline" className="text-xs font-semibold text-gray-300 mb-1.5 block">Launch Timeline</label>
                        <select
                          id="brand-timeline"
                          value={formData.timeline}
                          onChange={(e) => handleChange("timeline", e.target.value)}
                          className={selectClasses}
                        >
                          <option value="ASAP (Within 2 weeks)">ASAP (Within 2 weeks)</option>
                          <option value="Next 30 days">Next 30 days</option>
                          <option value="Next quarter">Next quarter</option>
                        </select>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex-1 h-11 bg-white/[0.04] border border-white/[0.08] text-gray-300 font-medium rounded-xl hover:bg-white/[0.06] text-sm"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          className="flex-1 h-11 bg-primary-500 hover:bg-primary-400 text-gray-950 font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(0,188,212,0.25)] text-sm"
                        >
                          Next: Goals & Finalize →
                        </button>
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div>
                        <label htmlFor="brand-goal" className="text-xs font-semibold text-gray-300 mb-1.5 block">Primary Business Objective</label>
                        <select
                          id="brand-goal"
                          value={formData.goal}
                          onChange={(e) => handleChange("goal", e.target.value)}
                          className={selectClasses}
                        >
                          <option value="sales">Direct Sales & Measurable ROAS</option>
                          <option value="app">App Installs & Product Activation</option>
                          <option value="awareness">Viral Brand Awareness & Social Sentiment</option>
                          <option value="b2b">B2B Founder Authority & Enterprise Pipeline</option>
                        </select>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-white">
                          <span>⚡</span>
                          <span>DAN SERVICES Guarantee</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Every campaign includes rigorous FTC disclosure review, dedicated usage rights clearance, and real-time dashboard analytics.
                        </p>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex-1 h-11 bg-white/[0.04] border border-white/[0.08] text-gray-300 font-medium rounded-xl hover:bg-white/[0.06] text-sm"
                        >
                          ← Back
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 h-11 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-gray-950 font-semibold rounded-xl transition-all shadow-[0_0_25px_rgba(0,188,212,0.3)] text-sm disabled:opacity-50"
                        >
                          {isSubmitting ? "Locking In Strategy..." : "Submit Campaign Strategy"}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
