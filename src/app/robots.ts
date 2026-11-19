import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/content";
import { siteBase } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** AI search / assistant crawlers (GEO). Allowed or blocked with one switch in admin → Google & SEO. */
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "Meta-ExternalAgent"];

/** /robots.txt: keep the admin and API out of search engines, point to the sitemap. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const [base, s] = await Promise.all([siteBase(), getSettings()]);
  // Before launch (no real address yet) block everything so test copies are not indexed.
  const live = /^https:\/\//.test(base) && !/localhost|127\.0\.0\.1/.test(base);
  const closed = ["/admin", "/api/"];
  const rules: MetadataRoute.Robots["rules"] = live
    ? [
        { userAgent: "*", allow: "/", disallow: closed },
        s.seo?.allowAI === false ? { userAgent: AI_BOTS, disallow: "/" } : { userAgent: AI_BOTS, allow: ["/", "/llms.txt"], disallow: closed },
      ]
    : [{ userAgent: "*", disallow: "/" }];
  return { rules, sitemap: `${base}/sitemap.xml`, host: base };
}
