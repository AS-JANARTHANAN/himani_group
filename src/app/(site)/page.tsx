import Link from "next/link";
import type { Metadata } from "next";
import { ldJson, pageMeta } from "@/lib/seo";
import Icon from "@/components/Icon";
import { CtaBand, E, Heading, VerticalRows, pic } from "@/components/site/Blocks";
import HeroGlobe from "@/components/site/HeroGlobe";
import ServiceScene from "@/components/site/ServiceScene";
import Sections from "@/components/site/Sections";
import { getContent, getLocations, getSettings, getVerticals, paragraphs } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent("home");
  return pageMeta(c.seo, "/", { image: c.hero?.image });
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function Home() {
  const [c, verticals, locations, biz, s] = await Promise.all([getContent("home"), getVerticals(), getLocations(), getContent("businesses"), getSettings()]);
  const { hero, intro, presence, vision, strengths } = c;
  const countries = new Set(locations.map((l) => l.country)).size;
  const ticker: string[] = (c.ticker?.items || []).map((i: any) => i?.text).filter(Boolean);
  const tickerItems = ticker.length ? ticker : verticals.map((v) => v.title);
  const faqItems = (c.faq?.items || []).filter((q: any) => q?.question && q?.answer);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((q: any) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })),
  };

  const blocks = {
    hero: (
      <section className="hero-home">
        {hero.image ? (
          <div className="photo" {...E("hero.image")}>
            <img {...pic(hero.image)} alt={hero.imageAlt} fetchPriority="high" />
          </div>
        ) : null}
        <div className="wrap copy">
          {hero.eyebrow ? (
            <div className="tag" {...E("hero.eyebrow")}>
              {hero.eyebrow}
            </div>
          ) : null}
          <Heading as="h1" className="display" title={hero.title} accent={hero.titleAccent} k="hero." />
          {hero.text ? (
            <p className="lede reveal" {...E("hero.text")}>
              {hero.text}
            </p>
          ) : null}
          <div className="actions reveal d1">
            {hero.primaryLabel ? (
              <Link href={hero.primaryHref || "/businesses"} className="btn" {...E("hero.primaryLabel")}>
                {hero.primaryLabel} {hero.primaryIcon ? <Icon name={hero.primaryIcon} size={20} /> : null}
              </Link>
            ) : null}
            {hero.secondaryLabel ? (
              <Link href={hero.secondaryHref || "/contact"} className="btn outline" {...E("hero.secondaryLabel")}>
                {hero.secondaryLabel}
              </Link>
            ) : null}
          </div>
          <a href="#intro" className="scroll-cue" {...E("settings:labels.scrollLabel")}>
            <i />
            {s.labels.scrollLabel}
          </a>
        </div>
        {hero.highlights?.length ? (
          <div className="hero-strip">
            <div className="wrap strip-row">
              {hero.highlights.map((h: any, i: number) => {
                const inner = (
                  <>
                    <span className="ic">{h.icon ? <Icon name={h.icon} size={26} /> : pad(i + 1)}</span>
                    <span>{h.text}</span>
                  </>
                );
                return h.href ? (
                  <Link key={i} href={h.href} className="strip-item" {...E(`hero.highlights.${i}`)}>
                    {inner}
                  </Link>
                ) : (
                  <div key={i} className="strip-item" {...E(`hero.highlights.${i}`)}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </section>
    ),

    ticker: tickerItems.length ? (
      <div className="marquee" aria-hidden {...E("ticker.items")}>
        <div className="track">
          {[0, 1].map((k) => (
            <div key={k} style={{ display: "flex" }}>
              {tickerItems.map((t, i) => (
                <span className="item" key={t + i + k}>
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    intro: (
      <section className="section" id="intro">
        <div className="wrap split">
          {intro.image ? (
            <div className="framed reveal" {...E("intro.image")}>
              <div className="img-zoom reveal-img">
                <img {...pic(intro.image, "(max-width: 900px) 100vw, 50vw")} alt={intro.imageAlt} loading="lazy" />
              </div>
              {intro.badgeTitle || intro.badgeText ? (
                <div className="intro-badge" {...E("intro.badgeTitle")}>
                  <b>{intro.badgeTitle}</b>
                  <span>{intro.badgeText}</span>
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="reveal d1">
            <div className="eyebrow" {...E("intro.eyebrow")}>
              {intro.eyebrow}
            </div>
            <h2 className="h2" {...E("intro.title")}>
              {intro.title}
            </h2>
            <div className="prose" {...E("intro.text")}>
              {paragraphs(intro.text).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {intro.linkLabel ? (
              <Link href={intro.linkHref || "/about"} className="btn" {...E("intro.linkLabel")}>
                {intro.linkLabel} <Icon name="arrow" size={20} />
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    ),

    verticals: (
      <section className="section on-dark grid-bg" id="services">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow" {...E("verticals.eyebrow")}>
                {c.verticals.eyebrow}
              </div>
              <h2 className="h2" {...E("verticals.title")}>
                {c.verticals.title}
              </h2>
            </div>
            <p {...E("verticals.text")}>{c.verticals.text}</p>
          </div>
          <VerticalRows items={verticals} linkLabel={biz.detail.cardLinkLabel} />
          {c.verticals.linkLabel ? (
            <div className="center-row">
              <Link href="/businesses" className="btn" {...E("verticals.linkLabel")}>
                {c.verticals.linkLabel} <Icon name="arrow" size={20} />
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    ),

    explore: verticals.length ? (
      <section className="section" id="explore">
        <div className="wrap">
          <div className="explore-head reveal">
            <div>
              <div className="eyebrow" {...E("explore.eyebrow")}>
                {c.explore.eyebrow}
              </div>
              <h2 className="h2" {...E("explore.title")}>
                {c.explore.title}
              </h2>
            </div>
            {c.explore.text ? <p {...E("explore.text")}>{c.explore.text}</p> : null}
          </div>
          <ServiceScene
            services={verticals.map(({ id, slug, title, summary, icon }) => ({ id, slug, title, summary, icon: icon || "" }))}
            labels={{ hint: c.explore.hint, linkLabel: c.explore.linkLabel }}
          />
        </div>
      </section>
    ) : null,

    strengths: strengths?.items?.length ? (
      <section className="section light">
        <div className="wrap split strengths">
          <div className="reveal">
            <div className="eyebrow" {...E("strengths.eyebrow")}>
              {strengths.eyebrow}
            </div>
            <h2 className="h2" {...E("strengths.title")}>
              {strengths.title}
            </h2>
            {strengths.text ? (
              <p className="lede" {...E("strengths.text")}>
                {strengths.text}
              </p>
            ) : null}
            <div className="reasons">
              {strengths.items.map((it: any, i: number) => (
                <div className="reason" key={i} {...E(`strengths.items.${i}`)}>
                  <span className="ic">{it.icon ? <Icon name={it.icon} size={26} /> : pad(i + 1)}</span>
                  <div>
                    <h3>{it.title}</h3>
                    <p>{it.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {strengths.image ? (
            <div className="tall-img reveal d1" {...E("strengths.image")}>
              <div className="img-zoom reveal-img">
                <img {...pic(strengths.image, "(max-width: 900px) 100vw, 50vw")} alt="" loading="lazy" />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    ) : null,

    presence: (
      <section className="section on-dark presence-band">
        <div className="wrap home-presence">
          <div className="reveal">
            <div className="eyebrow" {...E("presence.eyebrow")}>
              {presence.eyebrow}
            </div>
            <Heading title={presence.title} accent={presence.titleAccent} k="presence." />
            <p className="lede" {...E("presence.text")}>
              {presence.text}
            </p>
            <div className="stats">
              <div {...E("presence.statVerticals")}>
                <b>{pad(verticals.length)}</b>
                <span>{presence.statVerticals}</span>
              </div>
              <div {...E("presence.statCountries")}>
                <b>{pad(countries)}</b>
                <span>{presence.statCountries}</span>
              </div>
              <div {...E("presence.statLocations")}>
                <b>{pad(locations.length)}</b>
                <span>{presence.statLocations}</span>
              </div>
            </div>
            {presence.linkLabel ? (
              <Link href="/global-presence" className="btn outline" {...E("presence.linkLabel")}>
                {presence.linkLabel} <Icon name="arrow" size={20} />
              </Link>
            ) : null}
          </div>
          <div className="reveal d1">
            <HeroGlobe locations={locations.map(({ id, city, country, kind, lat, lng }) => ({ id, city, country, kind, lat, lng }))} />
          </div>
        </div>
      </section>
    ),

    vision: (
      <section className="vision-band" id="vision">
        {vision.image ? (
          <div className="bg" {...E("vision.image")}>
            <img {...pic(vision.image)} alt="" loading="lazy" />
          </div>
        ) : null}
        <div className="wrap inner reveal">
          <div className="eyebrow" {...E("vision.eyebrow")}>
            {vision.eyebrow}
          </div>
          <Heading className="h1" title={vision.title} accent={vision.titleAccent} k="vision." />
          <p {...E("vision.text")}>{vision.text}</p>
          {vision.linkLabel ? (
            <Link href={vision.linkHref || "/vision"} className="btn" {...E("vision.linkLabel")}>
              {vision.linkLabel} <Icon name="arrow" size={20} />
            </Link>
          ) : null}
        </div>
      </section>
    ),

    faq: faqItems.length ? (
      <section className="section light" id="faq">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(faqLd) }} />
        <div className="wrap faq-wrap">
          <div className="reveal">
            <div className="eyebrow" {...E("faq.eyebrow")}>
              {c.faq.eyebrow}
            </div>
            <h2 className="h2" {...E("faq.title")}>
              {c.faq.title}
            </h2>
          </div>
          <div className="faq">
            {faqItems.map((q: any, i: number) => (
              <details className="faq-item reveal" key={i} open={i === 0} {...E(`faq.items.${i}`)}>
                <summary>
                  <h3>{q.question}</h3>
                  <span className="faq-ic" aria-hidden>
                    <Icon name="plus" size={22} />
                  </span>
                </summary>
                <p>{q.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ) : null,

    cta: <CtaBand cta={c.cta} />,
  };

  return <Sections page="home" data={c} blocks={blocks} />;
}
