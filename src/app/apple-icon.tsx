import { ImageResponse } from "next/og";

export const alt = "DAN SERVICES";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #050505 0%, #062a30 60%, #1b0a20 100%)",
          color: "#f9fafb",
          fontSize: 110,
          fontWeight: 800,
          fontFamily: "sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        <span
          style={{
            background: "linear-gradient(90deg, #22d3ee, #a855f7)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          D
        </span>
      </div>
    ),
    size
  );
}
