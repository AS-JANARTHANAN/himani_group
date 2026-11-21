import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Icon from "@/components/Icon";
import { E, PageHero } from "@/components/site/Blocks";
import ContactForm from "@/components/site/ContactForm";
import Sections from "@/components/site/Sections";
import { getContent, getSettings, getVerticals } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent("contact");
  return pageMeta(c.seo, "/contact", { image: c.hero?.image });
}

const SOCIAL_KEYS = ["instagram", "linkedin", "facebook", "x", "youtube", "tiktok", "snapchat", "threads"];

export default async function Contact() {
  const [c, s, verticals] = await Promise.all([getContent("contact"), getSettings(), getVerticals()]);
  const ct = s.contact;
  const L = s.labels;
  const formProps = { labels: { ...c.form, sending: L.sending }, interests: verticals.map((v) => ({ value: v.slug, label: v.title })) };
  const wa = String(ct.whatsapp || "").replace(/\D/g, "");
  const socials = s.social?.showOnContact === false ? [] : SOCIAL_KEYS.filter((k) => typeof s.social?.[k] === "string" && s.social[k].trim());

  const row = (icon: string, label: string, value: React.ReactNode, key: string) => (
    <div className="d-row" {...E(key)}>
      <span className="ic">
        <Icon name={icon} size={22} />
      </span>
      <div>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
    </div>
  );

  const formBlock = (
    <section className="section">
      <div className="wrap contact-grid">
        <div className="reveal">
          <h2 className="h2" {...E("form.title")}>
            {c.form.title}
          </h2>
          <div style={{ height: 30 }} />
          <ContactForm {...formProps} />
        </div>
        <aside className="details-card reveal d1">
          <div className="eyebrow" {...E("settings:brand.fullName")}>
            {s.brand.fullName}
          </div>
          <h2 className="h3" {...E("details.title")}>
            {c.details.title}
          </h2>
          {c.details.text ? <p {...E("details.text")}>{c.details.text}</p> : null}
          <dl>
            {ct.phone ? row("phone", L.phoneLabel, <a href={`tel:${ct.phone.replace(/\s/g, "")}`}>{ct.phone}</a>, "settings:contact.phone") : null}
            {ct.email ? row("mail", L.emailLabel, <a href={`mailto:${ct.email}`}>{ct.email}</a>, "settings:contact.email") : null}
            {wa
              ? row(
                  "whatsapp",
                  L.whatsappLabel,
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
                    +{wa}
                  </a>,
                  "settings:contact.whatsapp"
                )
              : null}
            {ct.address ? row("pin", c.details.addressLabel, ct.address, "settings:contact.address") : null}
            {ct.hours ? row("clock", c.details.hoursLabel, ct.hours, "settings:contact.hours") : null}
          </dl>
          {ct.mapUrl ? (
            <a className="btn" href={ct.mapUrl} target="_blank" rel="noopener noreferrer" {...E("details.mapLabel")}>
              <Icon name="pin" size={20} /> {c.details.mapLabel}
            </a>
          ) : null}
          {socials.length ? (
            <div className="f-social" {...E("settings:social")}>
              {socials.map((k) => (
                <a key={k} href={s.social[k]} target="_blank" rel="noopener noreferrer" aria-label={k}>
                  <Icon name={k} size={18} />
                </a>
              ))}
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );

  return (
    <Sections
      page="contact"
      data={c}
      blocks={{ hero: <PageHero hero={c.hero} crumbs={[{ label: L.breadcrumbHome, href: "/" }, { label: c.hero.eyebrow }]} />, form: formBlock }}
    />
  );
}
