"use client";

import { useState, useMemo } from "react";

interface ROICalculatorProps {
  className?: string;
  onOpenBrandModal?: (budget?: number) => void;
}

export default function ROICalculator({ className = "", onOpenBrandModal }: ROICalculatorProps) {
  const [budget, setBudget] = useState(35000);
  const [platforms, setPlatforms] = useState<string[]>(["youtube", "tiktok"]);
  const [niche, setNiche] = useState<string>("saas");
  const [goal, setGoal] = useState<string>("sales");

  const platformOptions = [
    { label: "YouTube", value: "youtube", icon: "▶" },
    { label: "TikTok", value: "tiktok", icon: "♪" },
    { label: "Instagram", value: "instagram", icon: "📷" },
    { label: "X / Twitter", value: "x", icon: "𝕏" },
    { label: "LinkedIn", value: "linkedin", icon: "in" },
  ];

  const nicheOptions = [
    { label: "SaaS & B2B", value: "saas", roasMultiplier: 1.15 },
    { label: "E-Commerce & D2C", value: "ecom", roasMultiplier: 1.25 },
    { label: "Gaming & Apps", value: "gaming", roasMultiplier: 1.1 },
    { label: "FinTech & Web3", value: "fintech", roasMultiplier: 1.3 },
    { label: "Health & Fitness", value: "fitness", roasMultiplier: 1.2 },
  ];

  const goalOptions = [
    { label: "Direct Sales & Revenue", value: "sales" },
    { label: "App Installs & Growth", value: "app" },
    { label: "Brand Awareness Blitz", value: "awareness" },
    { label: "B2B Pipeline & Leads", value: "b2b" },
  ];

  const calculations = useMemo(() => {
    const selectedNicheObj = nicheOptions.find((n) => n.value === niche) || nicheOptions[0];

    const platformFactor = platforms.reduce((acc, p) => {
      switch (p) {
        case "youtube": return acc + 1.6;
        case "tiktok": return acc + 2.1;
        case "instagram": return acc + 1.4;
        case "x": return acc + 1.0;
        case "linkedin": return acc + 0.85;
        default: return acc;
      }
    }, 1.2);

    const goalFactor = goal === "sales" ? 0.85 : goal === "app" ? 1.05 : goal === "b2b" ? 0.75 : 1.3;

    // Projected Impressions
    const baseImpressions = budget * 85 * (platformFactor / 2.5) * goalFactor;
    const impressionsLow = Math.round(baseImpressions * 0.8);
    const impressionsHigh = Math.round(baseImpressions * 1.25);

    // Estimated Reach (Unique)
    const reachLow = Math.round(impressionsLow * 0.72);
    const reachHigh = Math.round(impressionsHigh * 0.76);

    // Projected Conversions / Sales
    const conversionRate = goal === "sales" ? 0.024 : goal === "app" ? 0.045 : goal === "b2b" ? 0.018 : 0.03;
    const clicksEst = reachLow * 0.035;
    const conversionsLow = Math.round(clicksEst * conversionRate);
    const conversionsHigh = Math.round(clicksEst * conversionRate * 1.7);

    // Expected ROAS
    const baseROAS = 3.6 * selectedNicheObj.roasMultiplier;
    const roasLow = (baseROAS * (platforms.length >= 2 ? 1.1 : 0.95)).toFixed(1);
    const roasHigh = (parseFloat(roasLow) * 1.45).toFixed(1);

    // Creators Matched
    const avgCostPerCreator = 3500;
    const creatorsCount = Math.max(3, Math.round(budget / avgCostPerCreator));

    return {
      impressions: { low: impressionsLow, high: impressionsHigh },
      reach: { low: reachLow, high: reachHigh },
      conversions: { low: conversionsLow, high: conversionsHigh },
      roas: { low: roasLow, high: roasHigh },
      creators: creatorsCount,
    };
  }, [budget, platforms, niche, goal]);

  const togglePlatform = (value: string) => {
    setPlatforms((prev) =>
      prev.includes(value)
        ? prev.length > 1 ? prev.filter((p) => p !== value) : prev
        : [...prev, value]
    );
  };

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <section className={`py-20 relative ${className}`} id="roi-calculator">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary-400 mb-3">
            Real-Time Forecasting Engine
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Campaign ROI Calculator
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
            Forecast your campaign reach, estimated conversions, and projected ROAS using DAN SERVICES proprietary creator benchmarks.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6 p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
            {/* Budget Slider */}
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-sm font-semibold text-gray-200">
                  Target Campaign Budget
                </label>
                <span className="font-mono text-2xl font-bold text-primary-400">
                  ${budget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                <span>$5,000 (Emerging)</span>
                <span>$100,000 (Growth)</span>
                <span>$500,000+ (Blitz)</span>
              </div>
            </div>

            {/* Industry Niche */}
            <div>
              <label className="text-sm font-semibold text-gray-200 block mb-3">
                Industry Niche
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {nicheOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setNiche(opt.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 text-left border ${
                      niche === opt.value
                        ? "bg-secondary-500/20 text-secondary-300 border-secondary-500/40 shadow-[0_0_15px_rgba(156,39,176,0.2)]"
                        : "bg-white/[0.02] text-gray-400 border-white/[0.06] hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <label className="text-sm font-semibold text-gray-200 block mb-3">
                Target Creator Platforms
              </label>
              <div className="flex flex-wrap gap-2">
                {platformOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => togglePlatform(opt.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                      platforms.includes(opt.value)
                        ? "bg-primary-500/20 text-primary-300 border-primary-500/40 shadow-[0_0_15px_rgba(0,188,212,0.15)]"
                        : "bg-white/[0.02] text-gray-400 border-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign Primary Objective */}
            <div>
              <label className="text-sm font-semibold text-gray-200 block mb-3">
                Campaign Primary Objective
              </label>
              <div className="grid grid-cols-2 gap-2">
                {goalOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setGoal(opt.value)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border text-center ${
                      goal === opt.value
                        ? "bg-white/[0.08] text-white border-white/[0.2] shadow-sm"
                        : "bg-white/[0.02] text-gray-500 border-white/[0.06] hover:text-gray-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Forecast Output Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Estimated ROAS</span>
                  <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono mt-1">
                    {calculations.roas.low}x – {calculations.roas.high}x
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  High Confidence
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Projected Impressions</span>
                  <span className="font-mono text-base font-bold text-white">
                    {formatNumber(calculations.impressions.low)} – {formatNumber(calculations.impressions.high)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Estimated Unique Reach</span>
                  <span className="font-mono text-base font-bold text-primary-300">
                    {formatNumber(calculations.reach.low)} – {formatNumber(calculations.reach.high)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Est. Conversions / Orders</span>
                  <span className="font-mono text-base font-bold text-secondary-300">
                    {formatNumber(calculations.conversions.low)} – {formatNumber(calculations.conversions.high)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Matched Creator Fleet</span>
                  <span className="font-mono text-base font-bold text-emerald-300">
                    ~{calculations.creators} Vetted Creators
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenBrandModal) {
                      onOpenBrandModal(budget);
                    } else {
                      window.location.hash = "#brand-intake";
                    }
                  }}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(0,188,212,0.3)] hover:-translate-y-0.5 text-sm"
                >
                  <span>Lock In This Campaign Strategy</span>
                  <span>→</span>
                </button>
                <p className="text-[11px] text-gray-500 text-center mt-3">
                  Includes full contract protection, FTC compliance, and live dashboard tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
