import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: "#F8D7DA",
        rose: { gold: "#B76E79", deep: "#8E4A56" },
        champagne: "#F7E7CE",
        wine: { DEFAULT: "#4A0E1F", dark: "#2A0712", darker: "#16030A" },
        cream: "#FFF8F0",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        serif: ["var(--font-cormorant)", "serif"],
        script: ["var(--font-vibes)", "cursive"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(74, 14, 31, 0.12), inset 0 1px 0 rgba(255,255,255,0.4)",
        glow: "0 0 60px rgba(247, 231, 206, 0.35)",
        soft: "0 20px 60px -20px rgba(74, 14, 31, 0.35)",
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.18)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.12)" },
          "70%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        flicker: {
          "0%, 100%": { transform: "scaleY(1) scaleX(1) rotate(-1deg)", opacity: "1" },
          "25%": { transform: "scaleY(1.08) scaleX(0.94) rotate(1.5deg)", opacity: "0.92" },
          "50%": { transform: "scaleY(0.95) scaleX(1.04) rotate(-2deg)", opacity: "1" },
          "75%": { transform: "scaleY(1.05) scaleX(0.97) rotate(1deg)", opacity: "0.95" },
        },
        spin_slow: { to: { transform: "rotate(360deg)" } },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        heartbeat: "heartbeat 1.4s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        flicker: "flicker 0.9s ease-in-out infinite",
        "spin-slow": "spin_slow 6s linear infinite",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
