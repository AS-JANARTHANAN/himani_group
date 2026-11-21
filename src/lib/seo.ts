import "server-only";
import type { Metadata } from "next";
import { getSettings } from "./content";

/** The public address of the site: admin setting → SITE_URL env → localhost. */
export async function siteBase() {
  const s = await getSettings();
  const raw = String(s.seo?.siteUrl || process.env.SITE_URL || "http://localhost:3100").trim();
  return raw.replace(/\/+$/, "");
}

const abs = (base: string, u?: string) => (!u ? undefined : /^https?:\/\//.test(u) ? u : `${base}${u.startsWith("/") ? "" : "/"}${u}`);

type PageSeo = { title?: string; description?: string; ogImage?: string; noindex?: boolean };

/** Full metadata for one page: title, description, canonical, Open Graph, X card, robots. */
export async function pageMeta(seo: PageSeo = {}, path: string, opts: { image?: string; fallbackTitle?: string; fallbackDescription?: string; type?: "website" | "article" } = {}): Promise<Metadata> {
  const [s, base] = await Promise.all([getSettings(), siteBase()]);
  const title = seo.title || opts.fallbackTitle || s.seo.title;
  const description = seo.description || opts.fallbackDescription || s.seo.description;
  const image = abs(base, seo.ogImage || opts.image || s.seo.ogImage);
  const url = `${base}${path === "/" ? "" : path}` || base;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: s.brand.name,
      locale: s.seo.locale || "en_AE",
      type: opts.type || "website",
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [], site: s.seo.xHandle || undefined },
    robots: seo.noindex ? { index: false, follow: true } : { index: true, follow: true, "max-image-preview": "large" },
  };
}

const DAYS: Record<string, string[]> = {
  "sat-thu": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
  "mon-fri": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "mon-sat": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  all: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
};

const clean = (o: any): any => {
  if (Array.isArray(o)) return o.map(clean).filter((x) => x !== undefined && x !== "" && !(Array.isArray(x) && !x.length));
  if (o && typeof o === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(o)) {
      const c = clean(v);
      if (c !== undefined && c !== "" && c !== null && !(Array.isArray(c) && !c.length) && !(typeof c === "object" && !Array.isArray(c) && !Object.keys(c).length)) out[k] = c;
    }
    return out;
  }
  return o;
};

/** Schema.org data for Google: the business (address, hours, phone, area) + the website. */
export async function siteJsonLd() {
  const [s, base] = await Promise.all([getSettings(), siteBase()]);
  const b = s.business || {};
  const c = s.contact || {};
  const socials = Object.values(s.social || {}).filter((v) => typeof v === "string" && /^https?:\/\//.test(v));
  const lat = Number(b.lat), lng = Number(b.lng);
  const isOrg = b.type === "Organization";
  const business = {
    "@context": "https://schema.org",
    "@type": b.type || "GeneralContractor",
    "@id": `${base}/#business`,
    name: s.brand.name,
    legalName: s.brand.fullName,
    slogan: s.brand.tagline,
    description: s.seo.description,
    url: base,
    logo: abs(base, String(s.brand.logo || "").endsWith(".svg") ? "/brand/logo-512.png" : s.brand.logo), // Google needs a raster logo
    image: abs(base, s.seo.ogImage),
    telephone: c.phone,
    email: c.email,
    foundingDate: b.foundingYear,
    identifier: b.license ? { "@type": "PropertyValue", name: "Trade licence", value: b.license } : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.street,
      addressLocality: b.city,
      addressRegion: b.region,
      postalCode: b.postalCode,
      addressCountry: b.country,
    },
    geo: !isOrg && Number.isFinite(lat) && Number.isFinite(lng) && b.lat !== "" ? { "@type": "GeoCoordinates", latitude: lat, longitude: lng } : undefined,
    hasMap: c.mapUrl,
    areaServed: String(b.areaServed || "")
      .split(",")
      .map((x: string) => x.trim())
      .filter(Boolean)
      .map((name: string) => ({ "@type": "Place", name })),
    openingHoursSpecification:
      !isOrg && b.opens && b.closes ? [{ "@type": "OpeningHoursSpecification", dayOfWeek: DAYS[b.days] || DAYS["sat-thu"], opens: b.opens, closes: b.closes }] : undefined,
    sameAs: socials,
    contactPoint: c.phone || c.email ? [{ "@type": "ContactPoint", contactType: "customer service", telephone: c.phone, email: c.email, areaServed: b.country || "AE", availableLanguage: ["English", "Arabic"] }] : undefined,
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: base,
    name: s.brand.name,
    inLanguage: String(s.seo.locale || "en_AE").replace("_", "-"),
    publisher: { "@id": `${base}/#business` },
  };
  return [clean(business), clean(website)];
}

export async function breadcrumbLd(items: { name: string; path: string }[]) {
  const base = await siteBase();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${base}${it.path === "/" ? "" : it.path}` || base })),
  };
}

export async function serviceLd(v: { title: string; summary: string; slug: string; image?: string; capabilities?: string[] }) {
  const [s, base] = await Promise.all([getSettings(), siteBase()]);
  return clean({
    "@context": "https://schema.org",
    "@type": "Service",
    name: v.title,
    serviceType: v.title,
    description: v.summary,
    url: `${base}/businesses/${v.slug}`,
    image: abs(base, v.image),
    provider: { "@id": `${base}/#business` },
    areaServed: String(s.business?.areaServed || "")
      .split(",")
      .map((x: string) => x.trim())
      .filter(Boolean)
      .map((name: string) => ({ "@type": "Place", name })),
    hasOfferCatalog: v.capabilities?.length
      ? { "@type": "OfferCatalog", name: v.title, itemListElement: v.capabilities.map((c) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: c } })) }
      : undefined,
  });
}

/** <script type="application/ld+json"> content, safe against "</script>" in text. */
export const ldJson = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
