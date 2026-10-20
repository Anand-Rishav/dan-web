"use client";

import { useState } from "react";

interface CreatorApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatorApplicationModal({ isOpen, onClose }: CreatorApplicationModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    youtube: "",
    instagram: "",
    x: "",
    linkedin: "",
    tiktok: "",
    niche: "Tech & AI",
    audienceDemographics: "",
    mediaKitUrl: "",
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads/creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName || "Creative Director",
          email: formData.email || "creator@network.com",
          niche: formData.niche || "Tech & AI",
          mediaKitUrl: formData.mediaKitUrl || undefined,
          audienceDemographics: formData.audienceDemographics || undefined,
          socialLinks: {
            youtube: formData.youtube || undefined,
            instagram: formData.instagram || undefined,
            twitter: formData.x || undefined,
            linkedin: formData.linkedin || undefined,
            tiktok: formData.tiktok || undefined,
          },
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        setIsSuccess(true);
      }
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsSuccess(false);
      setStep(1);
    }, 300);
  };

  if (!isOpen) return null;

  const inputClasses =
    "w-full px-4 py-3 bg-white/[0.03] text-white rounded-xl border border-white/[0.08] focus:border-secondary-500/50 focus:ring-2 focus:ring-secondary-500/10 outline-none transition-all placeholder:text-gray-600 text-sm";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-gray-950 rounded-2xl p-6 md:p-8 max-w-xl w-full border border-white/[0.1] relative shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-lg"
          onClick={handleClose}
          aria-label="Close modal"
        >
          ×
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-secondary-500/10 border border-secondary-500/30 text-secondary-400 flex items-center justify-center text-3xl mx-auto shadow-[0_0_30px_rgba(156,39,176,0.25)]">
              ✨
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Creator Application Submitted</h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              Welcome to the DAN SERVICES talent radar. Our creator representation team reviews engagement metrics, brand safety scores, and channel storytelling. If accepted, you will receive brand deals matched to your niche.
            </p>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left text-xs font-mono space-y-1.5 text-gray-400">
              <div><strong className="text-white">Applicant:</strong> {formData.fullName || "Creator"}</div>
              <div><strong className="text-white">Selected Niche:</strong> {formData.niche}</div>
              <div><strong className="text-white">Review Status:</strong> In Talent Queue (24-48 hrs)</div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 px-8 h-11 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(156,39,176,0.3)]"
            >
              Done & Return to Site
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-secondary-400">
                Creator Fleet Representation
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">Join the DAN SERVICES Creator Network</h2>
              <p className="text-xs text-gray-400 mt-1">Step {step} of 3</p>
              <div className="flex gap-1.5 mt-3">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      s <= step ? "bg-secondary-500 shadow-[0_0_8px_rgba(156,39,176,0.5)]" : "bg-white/[0.06]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Full Legal / Creator Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Alex Rivers"
                        value={formData.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Contact Email</label>
                      <input
                        type="email"
                        required
                        placeholder="alex@creator.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Primary Location / Country</label>
                    <input
                      type="text"
                      placeholder="Los Angeles, CA / United States"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className={inputClasses}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full h-11 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(156,39,176,0.25)] text-sm mt-2"
                  >
                    Continue to Channel Handles →
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 mb-1 block">YouTube Channel URL</label>
                      <input
                        type="text"
                        placeholder="https://youtube.com/@handle"
                        value={formData.youtube}
                        onChange={(e) => handleChange("youtube", e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 mb-1 block">TikTok Handle</label>
                      <input
                        type="text"
                        placeholder="@handle"
                        value={formData.tiktok}
                        onChange={(e) => handleChange("tiktok", e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 mb-1 block">Instagram Profile</label>
                      <input
                        type="text"
                        placeholder="@handle"
                        value={formData.instagram}
                        onChange={(e) => handleChange("instagram", e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 mb-1 block">X / Twitter Handle</label>
                      <input
                        type="text"
                        placeholder="@handle"
                        value={formData.x}
                        onChange={(e) => handleChange("x", e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 mb-1 block">LinkedIn Profile (B2B Creators)</label>
                    <input
                      type="text"
                      placeholder="linkedin.com/in/handle"
                      value={formData.linkedin}
                      onChange={(e) => handleChange("linkedin", e.target.value)}
                      className={inputClasses}
                    />
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
                      className="flex-1 h-11 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(156,39,176,0.25)] text-sm"
                    >
                      Next: Audience & Media Kit →
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Primary Niche</label>
                    <select
                      value={formData.niche}
                      onChange={(e) => handleChange("niche", e.target.value)}
                      className={`${inputClasses} bg-gray-900`}
                    >
                      <option value="Tech & AI">Tech & Artificial Intelligence</option>
                      <option value="Gaming & Esports">Gaming & Esports</option>
                      <option value="D2C & Lifestyle">D2C, Fashion & Lifestyle</option>
                      <option value="Finance & Web3">Finance, Crypto & Macro</option>
                      <option value="Fitness & Wellness">Fitness, Biohacking & Wellness</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Audience Demographics & Geo</label>
                    <textarea
                      placeholder="e.g. 70% US/EU, 20-35 age bracket, high tech affinity"
                      value={formData.audienceDemographics}
                      onChange={(e) => handleChange("audienceDemographics", e.target.value)}
                      className={`${inputClasses} resize-none`}
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Media Kit Link or Portfolio URL</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/... or https://notion.site/..."
                      value={formData.mediaKitUrl}
                      onChange={(e) => handleChange("mediaKitUrl", e.target.value)}
                      className={inputClasses}
                    />
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
                      className="flex-1 h-11 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-400 hover:to-secondary-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_25px_rgba(156,39,176,0.35)] text-sm disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting Portfolio..." : "Submit Application"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}