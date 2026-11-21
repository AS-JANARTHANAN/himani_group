import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { E, pic, SIZES } from "@/components/site/Blocks";
import { getContent, getSettings, getVerticals, paragraphs } from "@/lib/content";
import { breadcrumbLd, ldJson, pageMeta, serviceLd } from "@/lib/seo";

type P = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getVerticals()).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const [all, s] = await Promise.all([getVerticals(), getSettings()]);
  const v = all.find((x) => x.slug === slug);
  if (!v) return {};
  const title = v.seoTitle || String(s.seo.serviceTitle || "{service}").replace("{service}", v.title);
  return pageMeta({ title, description: v.seoDescription || v.summary }, `/businesses/${v.slug}`, { image: v.image });
}

export default async function VerticalPage({ params }: P) {
  const { slug } = await params;
  const [all, c, s] = await Promise.all([getVerticals(), getContent("businesses"), getSettings()]);
  const i = all.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const v = all[i];
  const next = all[(i + 1) % all.length];
  const d = c.detail;
  const vk = `vertical:${v.id}`;
  const ld = [
    await serviceLd(v),
    await breadcrumbLd([
      { name: s.labels.breadcrumbHome, path: "/" },
      { name: c.hero.eyebrow, path: "/businesses" },
      { name: v.title, path: `/businesses/${v.slug}` },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
      <section className={`page-hero detail-hero ${v.image ? "has-image" : ""}`}>
        {v.image ? (
          <div className="ph-photo" data-edit={vk}>
            <img {...pic(v.image, SIZES.pageHero)} alt={v.imageAlt} style={{ objectPosition: v.imagePosition }} />
            <span className="v-index">{String(i + 1).padStart(2, "0")}</span>
          </div>
        ) : null}
        <div className="ph-band">
          <div className="wrap ph-inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/" {...E("settings:labels.breadcrumbHome")}>
                {s.labels.breadcrumbHome}
              </Link>
              <span aria-hidden> / </span>
              <Link href="/businesses">{c.hero.title}</Link>
            </nav>
            <div className="eyebrow" {...E("detail.eyebrow")}>
              {d.eyebrow}
            </div>
            <h1 className="h1" data-edit={vk}>
              {v.title}
            </h1>
            <p data-edit={vk}>{v.summary}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap detail-body">
          <div data-edit={vk}>
            {v.intro ? <p className="intro reveal">{v.intro}</p> : null}
            <div className="prose reveal">
              {paragraphs(v.body).map((p, k) => (
                <p key={k}>{p}</p>
              ))}
            </div>
            {v.capabilities.length ? (
              <div className="reveal" style={{ marginTop: 44 }}>
                <div className="eyebrow" {...E("detail.capabilitiesTitle")}>
                  {d.capabilitiesTitle}
                </div>
                <ul className="caps">
                  {v.capabilities.map((cap, k) => (
                    <li key={k}>
                      <Icon name="check" size={22} />
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <aside>
            <div className="aside-card reveal d1">
              <span className="ic">{v.icon ? <Icon name={v.icon} size={30} /> : null}</span>
              <h2 className="h3" {...E("detail.enquireTitle")}>
                {d.enquireTitle}
              </h2>
              <p {...E("detail.enquireText")}>{d.enquireText}</p>
              <Link href={`/contact?interest=${encodeURIComponent(v.slug)}`} className="btn" {...E("detail.enquireButton")}>
                {d.enquireButton} <Icon name="arrow" size={20} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {next && next.slug !== v.slug ? (
        <Link href={`/businesses/${next.slug}`} className="next-v">
          <div className="bg">{next.image ? <img {...pic(next.image)} alt="" loading="lazy" /> : null}</div>
          <div className="wrap inner">
            <div>
              <div className="eyebrow" {...E("detail.nextLabel")}>
                {d.nextLabel}
              </div>
              <h2 className="h2">{next.title}</h2>
            </div>
            <span className="btn">
              {String(((i + 1) % all.length) + 1).padStart(2, "0")} <Icon name="arrow" size={20} />
            </span>
          </div>
        </Link>
      ) : null}
    </>
  );
}
