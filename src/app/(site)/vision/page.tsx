import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Icon from "@/components/Icon";
import { CtaBand, E, Heading, PageHero, pic, SIZES } from "@/components/site/Blocks";
import Sections from "@/components/site/Sections";
import { getContent, getSettings, paragraphs } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent("vision");
  return pageMeta(c.seo, "/vision", { image: c.hero?.image || c.banner?.image });
}

export default async function Vision() {
  const [c, s] = await Promise.all([getContent("vision"), getSettings()]);
  const { statement, values, horizon } = c;
  const heroHidden = !!c._layout?.sections?.hero?.hidden;
  const blocks = {
    hero: <PageHero hero={c.hero} crumbs={[{ label: s.labels.breadcrumbHome, href: "/" }, { label: c.hero.eyebrow }]} />,
    banner: c.banner?.image ? (
      <section className="vision-band image-only">
        <div className="vb-photo" {...E("banner.image")}>
          <img {...pic(c.banner.image)} alt={c.banner.imageAlt || ""} fetchPriority={heroHidden ? "high" : undefined} />
        </div>
        {heroHidden ? (
          // The words are part of the picture: kept as real text for Google, and shown under the picture on phones.
          <div className="wrap vb-copy">
            <div className="eyebrow" {...E("hero.eyebrow")}>
              {c.hero.eyebrow}
            </div>
            <Heading as="h1" className="h2" title={c.hero.title} accent={c.hero.titleAccent} k="hero." />
            {c.hero.text ? <p {...E("hero.text")}>{c.hero.text}</p> : null}
          </div>
        ) : null}
      </section>
    ) : null,
    statement: (
      <section className="section">
        <div className="wrap statements">
          <div className="statement reveal">
            <div className="label" {...E("statement.visionLabel")}>
              <Icon name="eye" size={22} />
              {statement.visionLabel}
            </div>
            <p {...E("statement.vision")}>{statement.vision}</p>
          </div>
          <div className="statement reveal d1">
            <div className="label" {...E("statement.missionLabel")}>
              <Icon name="target" size={22} />
              {statement.missionLabel}
            </div>
            <p {...E("statement.mission")}>{statement.mission}</p>
          </div>
        </div>
      </section>
    ),
    values: values.items?.length ? (
      <section className="section on-dark grid-bg">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow" {...E("values.eyebrow")}>
                {values.eyebrow}
              </div>
              <h2 className="h2" {...E("values.title")}>
                {values.title}
              </h2>
            </div>
          </div>
          <div className="cards-3">
            {values.items.map((v: any, i: number) => (
              <div className={`card dark reveal d${i % 3}`} key={i} {...E(`values.items.${i}`)}>
                <div className="card-top">
                  <span className="ic">{v.icon ? <Icon name={v.icon} size={30} /> : null}</span>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="h3">{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    horizon: horizon.title ? (
      <section className="section">
        <div className="wrap split">
          {horizon.image ? (
            <div className="framed reveal" {...E("horizon.image")}>
              <div className="img-zoom reveal-img">
                <img {...pic(horizon.image, SIZES.framed)} alt="" loading="lazy" />
              </div>
            </div>
          ) : null}
          <div className="reveal d1">
            <div className="eyebrow" {...E("horizon.eyebrow")}>
              {horizon.eyebrow}
            </div>
            <h2 className="h2" {...E("horizon.title")}>
              {horizon.title}
            </h2>
            <div className="prose" {...E("horizon.text")}>
              {paragraphs(horizon.text).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    ) : null,
    cta: <CtaBand cta={c.cta} />,
  };
  return <Sections page="vision" data={c} blocks={blocks} />;
}
