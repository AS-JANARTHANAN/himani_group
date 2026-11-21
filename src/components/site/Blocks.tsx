import Link from "next/link";

/** Marks an element as editable: clicking it in the admin preview jumps to its field. */
export const E = (key: string) => ({ "data-edit": key });

/** Responsive, compressed image props via the Next.js image optimiser (local files only). */
export function pic(src: string | undefined, sizes = "100vw") {
  if (!src) return {};
  if (!src.startsWith("/") || src.endsWith(".svg")) return { src };
  const u = (w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=90`;
  // up to 3840 px so large and high-density (retina / 4K) screens get the sharp 4K masters
  return { src: u(1920), srcSet: [640, 828, 1080, 1200, 1920, 2048, 3840].map((w) => `${u(w)} ${w}w`).join(", "), sizes };
}

/**
 * How wide each photo is really drawn. Most frames crop a wide (2:1) photo to fill a
 * taller box, which draws the photo larger than the box; asking for the box width
 * made browsers load a small file and stretch it (blurry). These sizes include the crop.
 */
export const SIZES = {
  full: "100vw",
  pageHero: "(max-width: 640px) 130vw, 100vw",
  tall: "(max-width: 900px) 125vw, 60vw",
  aboutArt: "(max-width: 640px) 140vw, (max-width: 900px) 105vw, 1200px",
  framed: "(max-width: 900px) 125vw, 65vw",
  rows: "(max-width: 640px) 95vw, (max-width: 900px) 92vw, 900px",
  carousel: "(max-width: 640px) 120vw, (max-width: 1100px) 66vw, 620px",
};

export function Arrow() {
  return <span className="arrow" aria-hidden />;
}

/** Two-line heading: the second line is shown in champagne gold, as in the approved design. */
export function Heading({ as: Tag = "h2", className = "h2", title, accent, k = "" }: { as?: "h1" | "h2"; className?: string; title?: string; accent?: string; k?: string }) {
  return (
    <Tag className={className}>
      <span {...E(`${k}title`)}>{title}</span>
      {accent ? (
        <>
          <br />
          <em {...E(`${k}titleAccent`)}>{accent}</em>
        </>
      ) : null}
    </Tag>
  );
}

/**
 * Slim page header for inner pages, in the style of the home hero band:
 * optional photo on top, then the green band with centred eyebrow, heading and text.
 */
export function PageHero({
  hero,
  crumbs,
}: {
  hero: { eyebrow?: string; title?: string; titleAccent?: string; text?: string; image?: string; imageAlt?: string };
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className={`page-hero ${hero.image ? "has-image" : ""}`}>
      {hero.image ? (
        <div className="ph-photo" {...E("hero.image")}>
          <img {...pic(hero.image, SIZES.pageHero)} alt={hero.imageAlt || ""} />
        </div>
      ) : null}
      <div className="ph-band">
        <div className="wrap ph-inner">
          {crumbs?.length ? (
            <nav className="crumbs" aria-label="Breadcrumb">
              {crumbs.map((c, i) => (
                <span key={i}>
                  {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
                  {i < crumbs.length - 1 ? <span aria-hidden> / </span> : null}
                </span>
              ))}
            </nav>
          ) : null}
          {hero.eyebrow ? (
            <div className="eyebrow" {...E("hero.eyebrow")}>
              {hero.eyebrow}
            </div>
          ) : null}
          <Heading as="h1" className="h1" title={hero.title} accent={hero.titleAccent} k="hero." />
          {hero.text ? <p {...E("hero.text")}>{hero.text}</p> : null}
        </div>
      </div>
    </section>
  );
}

/** "Connect With Us" strip: heading and text on the left, gold button on the right. */
export function CtaBand({ cta }: { cta: { eyebrow?: string; title?: string; text?: string; buttonLabel?: string; buttonHref?: string } }) {
  if (!cta?.title) return null;
  return (
    <section className="section cta-band">
      <div className="wrap cta-inner">
        <div className="reveal">
          {cta.eyebrow ? (
            <div className="eyebrow" {...E("cta.eyebrow")}>
              {cta.eyebrow}
            </div>
          ) : null}
          <h2 className="h2" {...E("cta.title")}>
            {cta.title}
          </h2>
          {cta.text ? <p {...E("cta.text")}>{cta.text}</p> : null}
        </div>
        {cta.buttonLabel ? (
          <Link href={cta.buttonHref || "/contact"} className="btn" {...E("cta.buttonLabel")}>
            {cta.buttonLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}

type V = { id: string; slug: string; title: string; summary: string; image: string; imageAlt: string; imagePosition: string; icon?: string };

/** The approved alternating business rows: photo with number, eyebrow, title, gold hairline and summary. */
export function VerticalRows({ items, eyebrow, linkLabel }: { items: V[]; eyebrow?: string; linkLabel?: string }) {
  return (
    <div className="verticals">
      {items.map((v, i) => (
        <Link href={`/businesses/${v.slug}`} className="vertical reveal" key={v.slug} data-edit={`vertical:${v.id}`} aria-label={v.title}>
          <div className="v-image">
            {v.image ? <img {...pic(v.image, SIZES.rows)} alt={v.imageAlt} loading={i < 2 ? "eager" : "lazy"} style={{ objectPosition: v.imagePosition }} /> : null}
            <span className="v-index">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <div className="v-content">
            {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
            <h3 className="h3">{v.title}</h3>
            <div className="hairline" />
            <p>{v.summary}</p>
            {linkLabel ? (
              <span className="v-more">
                {linkLabel} <Arrow />
              </span>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
