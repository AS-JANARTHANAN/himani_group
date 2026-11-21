import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { db } from "@/lib/db";
import { siteBase } from "@/lib/seo";

export const dynamic = "force-dynamic";

const PAGES: { key: string; path: string; priority: number; freq: "weekly" | "monthly" }[] = [
  { key: "home", path: "", priority: 1, freq: "weekly" },
  { key: "businesses", path: "/businesses", priority: 0.9, freq: "weekly" },
  { key: "about", path: "/about", priority: 0.7, freq: "monthly" },
  { key: "contact", path: "/contact", priority: 0.8, freq: "monthly" },
  { key: "presence", path: "/global-presence", priority: 0.5, freq: "monthly" },
  { key: "vision", path: "/vision", priority: 0.5, freq: "monthly" },
];

/** Every photo used on a page (hero, sections, banners), so Google Images can find them. Hidden sections are skipped. */
function pageImages(c: any): string[] {
  const hidden = new Set(Object.entries(c?._layout?.sections || {}).filter(([, v]: any) => v?.hidden).map(([k]) => k));
  const out = new Set<string>();
  const walk = (v: any) => {
    if (typeof v === "string") {
      if (/^\/(media|uploads)\/.+\.(webp|jpe?g|png|avif)$/i.test(v)) out.add(v);
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  for (const [k, v] of Object.entries(c || {})) if (k !== "_layout" && k !== "seo" && !hidden.has(k)) walk(v);
  return [...out];
}

/** /sitemap.xml: every public page, service and extra page (pages hidden from Google are left out). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = await siteBase();
  const abs = (u: string) => (/^https?:\/\//.test(u) ? u : `${base}${u}`);
  const [verticals, custom, rows, contents] = await Promise.all([
    db.vertical.findMany({ where: { published: true }, select: { slug: true, updatedAt: true, image: true }, orderBy: { order: "asc" } }),
    db.customPage.findMany({ where: { published: true }, select: { slug: true, updatedAt: true, heroImage: true } }),
    db.pageContent.findMany({ select: { key: true, updatedAt: true } }),
    Promise.all(PAGES.map((p) => getContent(p.key))),
  ]);
  const updated = Object.fromEntries(rows.map((r) => [r.key, r.updatedAt]));
  const fixed = PAGES.flatMap((p, i) => {
    const c = contents[i];
    if (c?.seo?.noindex) return [];
    const imgs = pageImages(c);
    return [{ url: base + p.path, lastModified: updated[p.key] || new Date(), changeFrequency: p.freq, priority: p.priority, images: imgs.length ? imgs.map(abs) : undefined }];
  });
  return [
    ...fixed,
    ...verticals.map((v) => ({ url: `${base}/businesses/${v.slug}`, lastModified: v.updatedAt, changeFrequency: "monthly" as const, priority: 0.8, images: v.image ? [abs(v.image)] : undefined })),
    ...custom.map((p) => ({ url: `${base}/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6, images: p.heroImage ? [abs(p.heroImage)] : undefined })),
  ];
}
