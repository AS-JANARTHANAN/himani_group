import Link from "next/link";
import type { Metadata } from "next";
import { ldJson, pageMeta } from "@/lib/seo";
import Icon from "@/components/Icon";
import { CtaBand, E, Heading, VerticalRows, pic, SIZES } from "@/components/site/Blocks";
import Astrolabe from "@/components/site/Astrolabe";
import BusinessCarousel from "@/components/site/BusinessCarousel";
import Sections from "@/components/site/Sections";
import { getContent, getLocations, getSettings, getVerticals, paragraphs } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent("home");
  return pageMeta(c.seo, "/", { image: c.hero?.image });
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function Home() {
  const [c, verticals, locations, biz, s, pres] = await Promise.all([getContent("home"), getVerticals(), getLocations(), getContent("businesses"), getSettings(), getContent("presence")]);
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
      <section className="hero-home" id="home">
        {hero.image ? (
          <div className="hero-photo" {...E("hero.image")}>
            <img {...pic(hero.image)} alt={hero.imageAlt} fetchPriority="high" />
          </div>
        ) : null}
        <div className="hero-band">
          <div className="wrap hero-copy">
            {hero.eyebrow ? (
              <div className="eyebrow" {...E("hero.eyebrow")}>
                {hero.eyebrow}
              </div>
            ) : null}
            <Heading as="h1" className="h1" title={hero.title} accent={hero.titleAccent} k="hero." />
            {hero.text ? <p {...E("hero.text")}>{hero.text}</p> : null}
            <div className="buttons">
              {hero.primaryLabel ? (
                <Link href={hero.primaryHref || "/businesses"} className="btn" {...E("hero.primaryLabel")}>
                  {hero.primaryLabel}
                </Link>
              ) : null}
              {hero.secondaryLabel ? (
                <Link href={hero.secondaryHref || "/about"} className="link-line" {...E("hero.secondaryLabel")}>
                  {hero.secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    ),

    ticker: tickerItems.length ? (
      <div className="marquee" aria-hidden {...E("ticker.items")}>
        <div className="track">
          {[0, 1].map((k) => (
            <div key={k} className="track-set">
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
      <section className="section" id="about">
        <div className="wrap about">
          <div className="reveal">
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
              <Link href={intro.linkHref || "/about"} className="link-line dark" {...E("intro.linkLabel")}>
                {intro.linkLabel}
              </Link>
            ) : null}
          </div>
          {intro.image ? (
            <div className="about-art reveal" {...E("intro.image")}>
              <img {...pic(intro.image, SIZES.aboutArt)} alt={intro.imageAlt} loading="lazy" />
            </div>
          ) : null}
        </div>
      </section>
    ),

    verticals: (
      <section className="businesses" id="businesses">
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
          <VerticalRows items={verticals} eyebrow={biz.detail.eyebrow} linkLabel={biz.detail.cardLinkLabel} />
          {biz.note?.text ? (
            <p className="photo-note">
              {biz.note.text}
            </p>
          ) : null}
          {c.verticals.linkLabel ? (
            <div className="center-row">
              <Link href="/businesses" className="btn" {...E("verticals.linkLabel")}>
                {c.verticals.linkLabel}
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    ),

    carousel: verticals.length ? (
      <section className="section carousel-band">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              {c.carousel?.eyebrow ? (
                <div className="eyebrow" {...E("carousel.eyebrow")}>
                  {c.carousel.eyebrow}
                </div>
              ) : null}
              <Heading title={c.carousel?.title} accent={c.carousel?.titleAccent} k="carousel." />
            </div>
            {c.carousel?.text ? <p {...E("carousel.text")}>{c.carousel.text}</p> : null}
          </div>
          <BusinessCarousel
            items={verticals.map((v) => ({ slug: v.slug, title: v.title, summary: v.summary, image: v.image, imageAlt: v.imageAlt, imagePosition: v.imagePosition, src: pic(v.image, SIZES.carousel) }))}
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
                <img {...pic(strengths.image, SIZES.tall)} alt="" loading="lazy" />
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
            <Astrolabe
              locations={locations.map(({ id, city, country, kind, lat, lng, description }) => ({ id, city, country, kind, lat, lng, description }))}
              labels={{ hq: pres.locations?.hqLabel, office: pres.locations?.officeLabel, market: pres.locations?.marketLabel }}
            />
          </div>
        </div>
      </section>
    ),

    vision: (
      <section className={`vision-band ${vision.image && !vision.showText ? "image-only" : ""}`} id="vision">
        {vision.image ? (
          <div className="vb-photo" {...E("vision.image")}>
            <img {...pic(vision.image)} alt={[vision.title, vision.titleAccent].filter(Boolean).join(" ")} loading="lazy" />
          </div>
        ) : null}
        <div className="wrap vb-copy reveal">
          <div className="eyebrow" {...E("vision.eyebrow")}>
            {vision.eyebrow}
          </div>
          <Heading className="h2" title={vision.title} accent={vision.titleAccent} k="vision." />
          <p {...E("vision.text")}>{vision.text}</p>
          {vision.linkLabel ? (
            <Link href={vision.linkHref || "/vision"} className="btn" {...E("vision.linkLabel")}>
              {vision.linkLabel}
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
