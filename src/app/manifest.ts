import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/content";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSettings();
  return {
    name: s.brand.fullName || s.brand.name,
    short_name: s.brand.name,
    description: s.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: s.theme?.paper || "#ffffff",
    theme_color: s.theme?.dark || "#0f1824",
    icons: [
      { src: "/brand/logo-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
