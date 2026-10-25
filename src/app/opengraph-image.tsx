import { ImageResponse } from "next/og";

export const alt = "DAN SERVICES — Engineering Viral Cultural Moments & High-ROI Creator Campaigns";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #050505 0%, #062a30 55%, #1b0a20 100%)",
          color: "#f9fafb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <span style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-0.02em" }}>DAN SERVICES</span>
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: 9999,
              background: "#00bcd4",
              display: "block",
            }}
          />
        </div>
        <div style={{ fontSize: 40, color: "#a1a1aa", textAlign: "center", maxWidth: 900, lineHeight: 1.3 }}>
          Engineering Viral Cultural Moments &amp; High-ROI Creator Campaigns
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 48, color: "#4dd0e1", fontSize: 24 }}>
          <span>YouTube</span>
          <span>•</span>
          <span>TikTok</span>
          <span>•</span>
          <span>Instagram</span>
          <span>•</span>
          <span>X</span>
          <span>•</span>
          <span>LinkedIn</span>
        </div>
      </div>
    ),
    size
  );
}
