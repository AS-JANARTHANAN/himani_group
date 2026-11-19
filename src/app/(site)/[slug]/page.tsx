import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand, PageHero } from "@/components/site/Blocks";
import { draftMode } from "next/headers";
import { db } from "@/lib/db";
import { getContent, getSettings, paragraphs } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

type P = { params: Promise<{ slug: string }> };
type Block = { heading?: string; text?: string; image?: string; imageAlt?: string };

async function load(slug: string) {
  const page = await db.customPage.findUnique({ where: { slug } });
  if (!page) return null;
  if (!page.published && !(await draftMode()).isEnabled) return null;
  let sections: Block[] = [];
  try {
    sections = JSON.parse(page.sections);
  } catch {}
  return { ...page, sections };
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await load((await params).slug);
  if (!p) return {};
  const s = await getSettings();
  return pageMeta({ title: p.seoTitle || `${p.title}${s.labels.titleSuffix || ""}`, description: p.seoDescription || p.intro }, `/${p.slug}`, { image: p.heroImage });
}

export default async function CustomPage({ params }: P) {
  const p = await load((await params).slug);
  if (!p) notFound();
  const home = await getContent("home");
  return (
    <>
      <PageHero hero={{ eyebrow: p.eyebrow, title: p.title, text: p.intro, image: p.heroImage, imageAlt: "" }} />
      {p.sections.map((s, i) => (
        <section className={`section ${i % 2 ? "light" : ""}`} key={i}>
          <div className={s.image ? "wrap split" : "wrap"} style={s.image ? undefined : { maxWidth: 900 }}>
            {s.image && i % 2 ? (
              <div className="framed reveal">
                <div className="img-zoom reveal-img">
                  <img src={s.image} alt={s.imageAlt || ""} loading="lazy" />
                </div>
              </div>
            ) : null}
            <div className="reveal">
              {s.heading ? <h2 className="h2" style={{ marginBottom: 30 }}>{s.heading}</h2> : null}
              <div className="prose">
                {paragraphs(s.text || "").map((t, k) => (
                  <p key={k}>{t}</p>
                ))}
              </div>
            </div>
            {s.image && !(i % 2) ? (
              <div className="framed reveal d1">
                <div className="img-zoom reveal-img">
                  <img src={s.image} alt={s.imageAlt || ""} loading="lazy" />
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ))}
      <CtaBand cta={home.cta} />
    </>
  );
}
