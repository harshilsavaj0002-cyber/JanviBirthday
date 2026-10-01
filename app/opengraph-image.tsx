import { ImageResponse } from "next/og";
import { content } from "@/data/content";

export const alt = content.meta.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** WhatsApp / iMessage link preview card. */
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
          background: "radial-gradient(ellipse at 50% 40%, #6b1a2e 0%, #4A0E1F 40%, #16030A 100%)",
          color: "#F7E7CE",
          fontFamily: "serif",
        }}
      >
        <svg width="110" height="110" viewBox="0 0 64 64" style={{ marginBottom: 24 }}>
          <path d="M32 52C20 43 11 35 11 25.5 11 19.7 15.5 15 21.3 15c4.2 0 7.9 2.4 10.7 6.2C34.8 17.4 38.5 15 42.7 15 48.5 15 53 19.7 53 25.5 53 35 44 43 32 52z" fill="#B76E79" />
        </svg>
        <div style={{ fontSize: 28, letterSpacing: 12, textTransform: "uppercase", color: "#F8D7DA", opacity: 0.8 }}>
          Something special for
        </div>
        <div style={{ fontSize: 132, fontStyle: "italic", marginTop: 8, color: "#F7E7CE" }}>{content.her.name}</div>
        <div style={{ fontSize: 30, marginTop: 18, color: "#E8B4B8" }}>Tap to open</div>
      </div>
    ),
    size,
  );
}
