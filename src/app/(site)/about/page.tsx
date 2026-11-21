import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Icon from "@/components/Icon";
import { CtaBand, E, PageHero, pic, SIZES } from "@/components/site/Blocks";
import Sections from "@/components/site/Sections";
import { getContent, getSettings, paragraphs } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent("about");
  return pageMeta(c.seo, "/about", { image: c.hero?.image });
}

export default async function About() {
  const [c, s] = await Promise.all([getContent("about"), getSettings()]);
  const { story, pillars, approach } = c;

  const blocks = {
    hero: <PageHero hero={c.hero} crumbs={[{ label: s.labels.breadcrumbHome, href: "/" }, { label: c.hero.eyebrow }]} />,
    story: (
      <section className="section">
        <div className="wrap about">
          <div className="reveal">
            {story.eyebrow ? (
              <div className="eyebrow" {...E("story.eyebrow")}>
                {story.eyebrow}
              </div>
            ) : null}
            {story.title ? (
              <h2 className="h2" {...E("story.title")}>
                {story.title}
              </h2>
            ) : null}
            <div className="prose" {...E("story.text")}>
              {paragraphs(story.text).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {story.quote ? (
              <blockquote className="quote" {...E("story.quote")}>
                {story.quote}
              </blockquote>
            ) : null}
          </div>
          {story.image ? (
            <div className="about-art reveal" {...E("story.image")}>
              <img {...pic(story.image, SIZES.aboutArt)} alt={story.imageAlt || ""} loading="lazy" />
            </div>
          ) : null}
        </div>
      </section>
    ),
    pillars: pillars.items?.length ? (
      <section className="section light">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow" {...E("pillars.eyebrow")}>
                {pillars.eyebrow}
              </div>
              <h2 className="h2" {...E("pillars.title")}>
                {pillars.title}
              </h2>
            </div>
          </div>
          <div className="cards-3">
            {pillars.items.map((p: any, i: number) => (
              <div className={`card reveal d${i % 3}`} key={i} {...E(`pillars.items.${i}`)}>
                <div className="card-top">
                  <span className="ic">{p.icon ? <Icon name={p.icon} size={30} /> : null}</span>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="h3">{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    approach: approach.steps?.length ? (
      <section className="section">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div className="reveal sticky-col">
            <div className="eyebrow" {...E("approach.eyebrow")}>
              {approach.eyebrow}
            </div>
            <h2 className="h2" {...E("approach.title")}>
              {approach.title}
            </h2>
            {approach.image ? (
              <div className="img-zoom reveal-img approach-img" {...E("approach.image")}>
                <img {...pic(approach.image, SIZES.framed)} alt="" loading="lazy" />
              </div>
            ) : null}
          </div>
          <div className="steps">
            {approach.steps.map((st: any, i: number) => (
              <div className="step reveal" key={i} {...E(`approach.steps.${i}`)}>
                <div className="n">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {st.icon ? <Icon name={st.icon} size={26} /> : null}
                </div>
                <div>
                  <h3>{st.title}</h3>
                  <p>{st.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    cta: <CtaBand cta={c.cta} />,
  };

  return <Sections page="about" data={c} blocks={blocks} />;
}
