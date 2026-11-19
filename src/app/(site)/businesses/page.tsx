import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { CtaBand, E, PageHero, VerticalRows } from "@/components/site/Blocks";
import Sections from "@/components/site/Sections";
import { getContent, getSettings, getVerticals } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent("businesses");
  return pageMeta(c.seo, "/businesses", { image: c.hero?.image });
}

export default async function Businesses() {
  const [c, verticals, s] = await Promise.all([getContent("businesses"), getVerticals(), getSettings()]);
  const blocks = {
    hero: <PageHero hero={c.hero} crumbs={[{ label: s.labels.breadcrumbHome, href: "/" }, { label: c.hero.eyebrow }]} />,
    note: (
      <section className="section light">
        <div className="wrap">
          <VerticalRows items={verticals} linkLabel={c.detail.cardLinkLabel} />
          {c.note.text ? (
            <p className="note" {...E("note.text")}>
              {c.note.text}
            </p>
          ) : null}
        </div>
      </section>
    ),
    cta: <CtaBand cta={c.cta} />,
  };
  return <Sections page="businesses" data={c} blocks={blocks} />;
}
