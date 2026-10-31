import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const alt = "DAN SERVICES — Engineering Viral Cultural Moments & High-ROI Creator Campaigns";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logoBase64 = await readFile(
    path.join(process.cwd(), "brand-src/dan-og.png"),
    "base64"
  );
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
        {/* dan wordmark (original colors) inside a white rounded card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            borderRadius: 28,
            padding: "28px 56px",
            marginBottom: 40,
          }}
        >
          <img src={`data:image/png;base64,${logoBase64}`} alt="dan" width={360} height={144} />
        </div>
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 24 }}>DAN SERVICES</div>
        <div style={{ fontSize: 30, color: "#a1a1aa", textAlign: "center", maxWidth: 900, lineHeight: 1.35 }}>
          Engineering Viral Cultural Moments &amp; High-ROI Creator Campaigns
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 40, color: "#4dd0e1", fontSize: 22 }}>
          <span>YouTube</span>
          <span>•</span>
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
