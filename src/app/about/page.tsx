import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "About",
  description: "DAN SERVICES is an elite, full-service influencer marketing agency engineering cultural moments into measurable enterprise revenue.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <main className="min-h-screen bg-background text-foreground py-28 px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Header */}
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary-400">
              About DAN SERVICES
            </p>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
              Engineering Cultural Moments Into{" "}
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Measurable Enterprise Revenue.
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl leading-relaxed">
              DAN SERVICES is an elite, full-service Influencer Marketing Agency specializing in high-converting, high-impact campaigns across YouTube, Instagram, X (Twitter), and LinkedIn.
            </p>
          </div>

          {/* Mission Card */}
          <div className="p-8 md:p-10 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl space-y-4">
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              We bridge the gap between world-class creator talent and hyper-growth brands. By replacing outdated vanity metrics with rigorous direct-response attribution and algorithmic trend orchestration, we help modern companies achieve sustained cultural relevance and exceptional return on ad spend.
            </p>
          </div>

          {/* Pillars */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Agency Strategic Pillars</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: "Data-Driven Creator Sourcing",
                  desc: "We analyze over 40 audience quality signals, fake-follower ratios, retention heatmaps, and sentiment trends before recommending any creator.",
                  icon: "📊",
                },
                {
                  title: "Algorithmic Velocity",
                  desc: "We engineer release schedules to trigger YouTube recommendation engines with coordinated Reels drops simultaneously, maximizing organic secondary lift.",
                  icon: "⚡",
                },
                {
                  title: "Ironclad Contract Protection",
                  desc: "Comprehensive legal shielding including FTC disclosure auditing, brand safety indemnification, and multi-platform digital whitelisting rights.",
                  icon: "🛡️",
                },
                {
                  title: "Attribution & Incrementality",
                  desc: "Advanced multi-touch UTM parameterization, promo code governance, and conversion lift studies that prove real incremental revenue.",
                  icon: "🎯",
                },
              ].map((pillar, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl hover:border-primary-500/20 transition-all duration-300"
                >
                  <div className="text-2xl mb-3">{pillar.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="p-8 md:p-10 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Our Core Agency Values</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Radical transparency in creator fees and pricing benchmarks",
                "Direct response accountability over vanity follower counts",
                "Rigorous brand safety screening and FTC regulatory compliance",
                "Long-term relationship nurturing with high-performing talent",
              ].map((value, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
