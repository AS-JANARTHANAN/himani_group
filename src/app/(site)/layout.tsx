import Link from "next/link";
import { draftMode } from "next/headers";
import Analytics, { CookieSettingsLink } from "@/components/site/Analytics";
import NavProgress from "@/components/site/NavProgress";
import { Suspense } from "react";
import Icon from "@/components/Icon";
import Header from "@/components/site/Header";
import { getSettings, getVerticals } from "@/lib/content";
import { ldJson, siteJsonLd } from "@/lib/seo";
import { themeCss } from "@/lib/theme-css";

const SOCIAL_KEYS = ["instagram", "linkedin", "facebook", "x", "youtube", "tiktok", "snapchat", "threads"];

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, verticals, ld, dm] = await Promise.all([getSettings(), getVerticals(), siteJsonLd(), draftMode()]);
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
      <footer className="site-footer">
        <div className="hazard" aria-hidden />
        <div className="wrap">
          <div className="top">
            <div className="f-brand">
              <Link href="/" className="brand" data-edit="settings:brand.logo">
                {s.brand.logo ? <img src={s.brand.logo} alt="" width={56} height={56} /> : null}
                <span>{s.brand.name}</span>
              </Link>
              {s.footer.statement ? (
                <p className="f-statement" data-edit="settings:footer.statement">
                  {s.footer.statement}
                </p>
              ) : null}
              {socials.length && s.social?.showInFooter !== false ? (
                <div className="f-social" data-edit="settings:social">
                  {socials.map((so) => (
                    <a key={so.key} href={so.href} target="_blank" rel="noopener noreferrer" aria-label={so.key}>
                      <Icon name={so.key} size={18} />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
            <div>
              <h4 data-edit="settings:footer.exploreTitle">{s.footer.exploreTitle}</h4>
              <ul data-edit="settings:navigation.links">
                {links.map((l: any) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 data-edit="settings:footer.businessesTitle">{s.footer.businessesTitle}</h4>
              <ul>
                {verticals.map((v) => (
                  <li key={v.slug}>
                    <Link href={`/businesses/${v.slug}`}>{v.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 data-edit="settings:footer.contactTitle">{s.footer.contactTitle}</h4>
              <ul className="f-contact">
                {c.phone ? (
                  <li data-edit="settings:contact.phone">
                    <Icon name="phone" size={17} />
                    <a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a>
                  </li>
                ) : null}
                {c.email ? (
                  <li data-edit="settings:contact.email">
                    <Icon name="mail" size={17} />
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                  </li>
                ) : null}
                {wa ? (
                  <li data-edit="settings:contact.whatsapp">
                    <Icon name="whatsapp" size={17} />
                    <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
                      {L.whatsappLabel}
                    </a>
                  </li>
                ) : null}
                {c.address ? (
                  <li data-edit="settings:contact.address">
                    <Icon name="pin" size={17} />
                    <span>{c.address}</span>
                  </li>
                ) : null}
                {c.hours ? (
                  <li data-edit="settings:contact.hours">
                    <Icon name="clock" size={17} />
                    <span>{c.hours}</span>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
          <div className="bottom">
            <span data-edit="settings:footer.copyright">{(s.footer.copyright || "").replace("{year}", String(new Date().getFullYear()))}</span>
            <span data-edit="settings:brand.tagline">
              {s.brand.tagline}
              {tracking ? (
                <>
                  {"  ·  "}
                  <CookieSettingsLink label={s.labels.cookieSettings} />
                </>
              ) : null}
            </span>
          </div>
        </div>
      </footer>
      {wa && c.whatsappButton ? (
        <a className="wa-float" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" data-edit="settings:contact.whatsappLabel">
          <Icon name="whatsapp" size={24} stroke={1.8} />
          {c.whatsappLabel ? <span>{c.whatsappLabel}</span> : null}
        </a>
      ) : null}
    </>
  );
}
