import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#16030A" }}>
        <svg width="120" height="120" viewBox="0 0 64 64">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#F7E7CE" />
              <stop offset=".45" stopColor="#B76E79" />
              <stop offset="1" stopColor="#8E4A56" />
            </linearGradient>
          </defs>
          <path d="M32 52C20 43 11 35 11 25.5 11 19.7 15.5 15 21.3 15c4.2 0 7.9 2.4 10.7 6.2C34.8 17.4 38.5 15 42.7 15 48.5 15 53 19.7 53 25.5 53 35 44 43 32 52z" fill="url(#g)" />
        </svg>
      </div>
    ),
    size,
  );
}
