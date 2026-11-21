import { getContent, getLocations, getSettings, getVerticals } from "@/lib/content";
import { siteBase } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** /llms.txt: a plain-text summary of the company for AI assistants (GEO). Built from the admin content. */
export async function GET() {
  const [s, base, verticals, locations, home, contactPage, presence] = await Promise.all([
    getSettings(),
    siteBase(),
    getVerticals(),
    getLocations(),
    getContent("home"),
    getContent("contact"),
    getContent("presence"),
  ]);
  if (s.seo?.allowAI === false) return new Response("Not available.", { status: 404 });
  const c = s.contact || {};
  const b = s.business || {};
  const line = (label: string, v?: string) => (v ? `- ${label}: ${v}\n` : "");
  const faqHidden = !!home._layout?.sections?.faq?.hidden;
  const faq = (faqHidden ? [] : home.faq?.items || []).filter((q: any) => q?.question && q?.answer);
  const parts = [b.street, b.city, b.region, b.postalCode, b.country === "AE" ? "United Arab Emirates" : b.country].filter(Boolean);
  const address = parts.filter((p, i) => parts.indexOf(p) === i).join(", ") || c.address;

  let t = `# ${s.brand.fullName || s.brand.name}\n\n> ${s.seo?.aiSummary || s.seo?.description || ""}\n\n`;
  t += `## Key facts\n`;
  t += line("Website", base);
  t += line("Head office", address);
  t += line("Areas served", b.areaServed);
  t += line("Phone", c.phone);
  t += line("Email", c.email);
  t += line("WhatsApp", c.whatsapp ? `+${String(c.whatsapp).replace(/\D/g, "")}` : "");
  t += line("Opening hours", c.hours);
  t += line("Trade licence", b.license);
  t += line("Founded", b.foundingYear);
  t += `\n## Business verticals\n`;
  for (const v of verticals) t += `- [${v.title}](${base}/businesses/${v.slug}): ${v.summary}\n`;
  t += `\n## Main pages\n`;
  t += `- [Home](${base}/)\n- [About us](${base}/about)\n- [Our businesses](${base}/businesses)\n`;
  if (!presence.seo?.noindex) t += `- [Where we work](${base}/global-presence)\n`;
  t += `- [Our vision](${base}/vision)\n- [Contact](${base}/contact): ${contactPage.hero?.text || ""}\n`;
  if (locations.length) {
    t += `\n## Locations\n`;
    for (const l of locations) t += `- ${l.city}, ${l.country}${l.description ? `: ${l.description}` : ""}\n`;
  }
  if (faq.length) {
    t += `\n## Frequently asked questions\n`;
    for (const q of faq) t += `\n### ${q.question}\n${q.answer}\n`;
  }
  return new Response(t, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
