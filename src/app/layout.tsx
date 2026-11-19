import type { Metadata, Viewport } from "next";
import { Archivo, Barlow_Condensed, Cormorant_Garamond, Inter, Space_Grotesk } from "next/font/google";
import { getSettings } from "@/lib/content";
import { siteBase } from "@/lib/seo";
import { themeFont } from "@/lib/theme-css";
import "./globals.css";

// Heading fonts the admin can switch between (only the chosen one is preloaded).
const industrial = Barlow_Condensed({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-industrial", display: "swap", preload: false });
const modern = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-modern", display: "swap", preload: false });
const bold = Archivo({ subsets: ["latin"], weight: ["600", "700", "800", "900"], variable: "--font-bold", display: "swap", preload: false });
const classic = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-classic", display: "swap", preload: false });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const [s, base] = await Promise.all([getSettings(), siteBase()]);
  const t = s.tracking || {};
  const b = s.business || {};
  const geo: Record<string, string> = {};
  if (b.country) geo["geo.region"] = [b.country, b.region === "Dubai" ? "DU" : ""].filter(Boolean).join("-");
  if (b.city) geo["geo.placename"] = b.city;
  if (b.lat && b.lng) {
    geo["geo.position"] = `${b.lat};${b.lng}`;
    geo["ICBM"] = `${b.lat}, ${b.lng}`;
  }
  if (t.bing) geo["msvalidate.01"] = t.bing;
  return {
    metadataBase: new URL(base),
    title: { default: s.seo.title, template: `%s` },
    description: s.seo.description,
    applicationName: s.brand.name,
    creator: s.brand.fullName,
    publisher: s.brand.fullName,
    formatDetection: { telephone: true, email: true, address: true },
    verification: t.gsc ? { google: t.gsc } : undefined,
    other: geo,
    openGraph: { title: s.seo.title, description: s.seo.description, images: s.seo.ogImage ? [s.seo.ogImage] : [], type: "website", locale: s.seo.locale || "en_AE", siteName: s.brand.name },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const s = await getSettings();
  return { themeColor: /^#[0-9a-f]{6}$/i.test(s.theme?.dark || "") ? s.theme.dark : "#0f1824", width: "device-width", initialScale: 1 };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <html lang={String(s.seo?.locale || "en_AE").replace("_", "-")} className={`${industrial.variable} ${modern.variable} ${bold.variable} ${classic.variable} ${body.variable}`} data-font={themeFont(s.theme)} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
