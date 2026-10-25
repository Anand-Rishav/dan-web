export default function PlatformMarquee() {
  const platforms = [
    { name: "YouTube", sub: "Dedicated Integrations & Shorts", icon: "▶" },
    { name: "Instagram", sub: "Reels & Stories", icon: "📷" },
    { name: "X / Twitter", sub: "Thought Leadership & Viral Threads", icon: "𝕏" },
    { name: "LinkedIn", sub: "B2B Creator Campaigns", icon: "in" },
    { name: "TikTok", sub: "UGC & Spark Ads", icon: "♪" },
  ];

  // Exactly two copies: the marquee animation translates -50%, so the track
  // must contain exactly 2x the content for a seamless loop.
  const marqueeItems = [...platforms, ...platforms];

  return (
    <section className="py-12 border-y border-white/[0.04] overflow-hidden" id="platforms">
      {/* Platform marquee */}
      <div className="overflow-hidden">
        <div className="flex w-max gap-12 animate-marquee">
          {marqueeItems.map((platform, index) => (
            <div key={`${platform.name}-${index}`} className="shrink-0 flex items-center gap-3" aria-hidden={index >= platforms.length}>
              <span className="w-8 h-8 bg-primary-500/10 border border-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-medium">
                {platform.icon}
              </span>
              <div>
                <span className="text-sm font-medium text-white">{platform.name}</span>
                <span className="block text-xs text-gray-500">{platform.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client proof banner */}
      <div className="mt-16 max-w-5xl mx-auto px-6">
        <p className="text-center text-xs uppercase tracking-widest text-gray-600 mb-8">
          Trusted by leading brands
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {["Stripe", "Notion", "Linear", "Vercel", "Supabase", "Figma", "Arc", "Raycast"].map((name) => (
            <div
              key={name}
              className="px-5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-gray-500 font-medium backdrop-blur-sm hover:text-gray-300 hover:border-white/[0.12] transition-all duration-300"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
