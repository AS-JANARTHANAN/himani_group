import Link from "next/link";
import { draftMode } from "next/headers";
import Analytics, { CookieSettingsLink } from "@/components/site/Analytics";
import NavProgress from "@/components/site/NavProgress";
import { Suspense } from "react";
import Icon from "@/components/Icon";
import Header from "@/components/site/Header";
import { getContent, getSettings, getVerticals } from "@/lib/content";
import { ldJson, siteJsonLd } from "@/lib/seo";
import { themeCss } from "@/lib/theme-css";

const SOCIAL_KEYS = ["instagram", "linkedin", "facebook", "x", "youtube", "tiktok", "snapchat", "threads"];

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, verticals, ld, dm, presence] = await Promise.all([getSettings(), getVerticals(), siteJsonLd(), draftMode(), getContent("presence")]);
  const preview = dm.isEnabled;
  const tracking = !!(s.tracking?.ga4 || s.tracking?.gtm || s.tracking?.metaPixel);
  const nav = s.navigation;
  const links = (nav.links || []).filter((l: any) => l?.label && l?.href && !l.hidden);
  const c = s.contact;
  const L = s.labels;
  const socials = SOCIAL_KEYS.filter((k) => typeof s.social?.[k] === "string" && s.social[k].trim()).map((k) => ({ key: k, href: s.social[k] as string }));
  const wa = String(c.whatsapp || "").replace(/\D/g, "");
  const tb = s.topbar || {};
  const topItems = (tb.items || []).filter((i: any) => i?.text);
  // Footer page links: the menu links, plus "Where We Work" when that page is live (the header keeps the design's four links)
  const footerLinks = (nav.links || []).filter((l: any) => l?.label && l?.href && (!l.hidden || (l.href === "/global-presence" && !presence?.seo?.noindex)));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeCss(s.theme) }} />
      <Suspense fallback={null}>
        <NavProgress />
      </Suspense>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
      {/* Tracking is off inside the admin preview so edits are not counted as visits */}
      {!preview ? <Analytics {...(s.tracking || {})} labels={s.labels} /> : null}
      {tb.show && (topItems.length || (tb.showSocial && socials.length)) ? (
        <div className="topbar" data-edit="settings:topbar">
          <div className="wrap tb-row">
            <ul className="tb-items">
              {topItems.map((it: any, i: number) => {
                const inner = (
                  <>
                    {it.icon ? <Icon name={it.icon} size={15} /> : null}
                    <span>{it.text}</span>
                  </>
                );
                return (
                  <li key={i} data-edit={`settings:topbar.items.${i}`}>
                    {it.href ? <a href={it.href}>{inner}</a> : inner}
                  </li>
                );
              })}
            </ul>
            {tb.showSocial && socials.length ? (
              <div className="tb-social" data-edit="settings:social">
                {socials.map((so) => (
                  <a key={so.key} href={so.href} target="_blank" rel="noopener noreferrer" aria-label={so.key}>
                    <Icon name={so.key} size={15} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      <Header
        brand={{ name: s.brand.name, logo: s.brand.logo, showName: s.brand.showName !== false }}
        links={links.map((l: any) => ({ label: l.label, href: l.href, icon: l.icon || "", newTab: !!l.newTab, index: (nav.links || []).indexOf(l) }))}
        cta={{ show: nav.ctaShow !== false && !!nav.ctaLabel, label: nav.ctaLabel, href: nav.ctaHref, icon: nav.ctaIcon }}
        homeLabel={nav.homeLabel}
        menuLabel={nav.menuLabel}
        contactLine={[c.phone, c.email].filter(Boolean).join("  ·  ")}
      />
      <main id="main">{children}</main>
      {s.footer.showLinks !== false ? (
        <footer className="site-footer full">
          <div className="wrap">
            <div className="f-top">
              <div className="f-brand">
                <Link href="/" className="brand" data-edit="settings:brand.logo">
                  {s.brand.logo ? <img src={s.brand.logo} alt="" width={64} height={64} /> : null}
                  <span data-edit="settings:brand.name">{s.brand.name}</span>
                </Link>
                {s.footer.statement ? (
                  <p className="f-statement" data-edit="settings:footer.statement">
                    {s.footer.statement}
                  </p>
                ) : null}
              </div>
              {s.footer.buttonLabel ? (
                <Link href={s.footer.buttonHref || "/contact"} className="btn outline" data-edit="settings:footer.buttonLabel">
                  {s.footer.buttonLabel}
                </Link>
              ) : null}
            </div>
            <div className="f-cols">
              <nav className="f-col" aria-label={s.footer.exploreTitle || "Company"} data-edit="settings:navigation.links">
                <h2>{s.footer.exploreTitle}</h2>
                <Link href="/">{nav.homeLabel || "Home"}</Link>
                {footerLinks.map((l: any) => (
                  <Link key={l.href + l.label} href={l.href}>
                    {l.label}
                  </Link>
                ))}
              </nav>
              {verticals.length ? (
                <nav className="f-col f-biz" aria-label={s.footer.businessesTitle || "Businesses"}>
                  <h2 data-edit="settings:footer.businessesTitle">{s.footer.businessesTitle}</h2>
                  {verticals.map((v) => (
                    <Link key={v.slug} href={`/businesses/${v.slug}`}>
                      {v.title}
                    </Link>
                  ))}
                </nav>
              ) : null}
              <div className="f-col f-contact">
                <h2 data-edit="settings:footer.contactTitle">{s.footer.contactTitle}</h2>
                {c.address ? (
                  <p data-edit="settings:contact.address">
                    <Icon name="pin" size={17} /> <span>{c.address}</span>
                  </p>
                ) : null}
                {c.phone ? (
                  <a href={`tel:${c.phone.replace(/\s/g, "")}`} data-edit="settings:contact.phone">
                    <Icon name="phone" size={17} /> <span>{c.phone}</span>
                  </a>
                ) : null}
                {c.email ? (
                  <a href={`mailto:${c.email}`} data-edit="settings:contact.email">
                    <Icon name="mail" size={17} /> <span>{c.email}</span>
                  </a>
                ) : null}
                {wa ? (
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" data-edit="settings:contact.whatsapp">
                    <Icon name="whatsapp" size={17} /> <span>{L.whatsappLabel}</span>
                  </a>
                ) : null}
                {c.hours ? (
                  <p data-edit="settings:contact.hours">
                    <Icon name="clock" size={17} /> <span>{c.hours}</span>
                  </p>
                ) : null}
                <Link href="/contact" className="f-enquire">
                  {L.footerEnquiry || "Business Enquiries"} <span className="arrow" aria-hidden />
                </Link>
                {socials.length && s.social?.showInFooter !== false ? (
                  <span className="f-social" data-edit="settings:social">
                    {socials.map((so) => (
                      <a key={so.key} href={so.href} target="_blank" rel="noopener noreferrer" aria-label={so.key}>
                        <Icon name={so.key} size={17} />
                      </a>
                    ))}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="f-bottom">
              <span data-edit="settings:footer.copyright">{(s.footer.copyright || "").replace("{year}", String(new Date().getFullYear()))}</span>
              <span data-edit="settings:brand.tagline">{s.brand.tagline}</span>
              {tracking ? <CookieSettingsLink label={s.labels.cookieSettings} /> : null}
            </div>
          </div>
        </footer>
      ) : (
      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-inner">
            <Link href="/" className="brand" data-edit="settings:brand.logo">
              {s.brand.logo ? <img src={s.brand.logo} alt="" width={50} height={50} /> : null}
              <span data-edit="settings:brand.name">{s.brand.name}</span>
            </Link>
            <span data-edit="settings:brand.tagline">{s.brand.tagline}</span>
            <span data-edit="settings:footer.copyright">{(s.footer.copyright || "").replace("{year}", String(new Date().getFullYear()))}</span>
          </div>
          {(socials.length && s.social?.showInFooter !== false) || tracking ? (
            <div className="footer-links">
              <div className="footer-meta">
                {c.phone ? (
                  <a href={`tel:${c.phone.replace(/\s/g, "")}`} data-edit="settings:contact.phone">
                    {c.phone}
                  </a>
                ) : null}
                {c.email ? (
                  <a href={`mailto:${c.email}`} data-edit="settings:contact.email">
                    {c.email}
                  </a>
                ) : null}
                {socials.length && s.social?.showInFooter !== false ? (
                  <span className="f-social" data-edit="settings:social">
                    {socials.map((so) => (
                      <a key={so.key} href={so.href} target="_blank" rel="noopener noreferrer" aria-label={so.key}>
                        <Icon name={so.key} size={17} />
                      </a>
                    ))}
                  </span>
                ) : null}
                {tracking ? <CookieSettingsLink label={s.labels.cookieSettings} /> : null}
              </div>
            </div>
          ) : null}
        </div>
      </footer>
      )}
      {wa && c.whatsappButton ? (
        <a className="wa-float" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" data-edit="settings:contact.whatsappLabel">
          <Icon name="whatsapp" size={24} stroke={1.8} />
          {c.whatsappLabel ? <span>{c.whatsappLabel}</span> : null}
        </a>
      ) : null}
    </>
  );
}
