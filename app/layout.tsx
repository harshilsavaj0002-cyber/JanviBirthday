import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Inter, Playfair_Display } from "next/font/google";
import { content } from "@/data/content";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap", style: ["normal", "italic"] });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const vibes = Great_Vibes({ subsets: ["latin"], variable: "--font-vibes", display: "swap", weight: "400" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: content.meta.title,
  description: content.meta.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    type: "website",
    siteName: `For ${content.her.name}`,
  },
  twitter: { card: "summary_large_image", title: content.meta.title, description: content.meta.description },
};

export const viewport: Viewport = {
  themeColor: "#16030A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${vibes.variable} ${inter.variable}`}>
      <body>
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
