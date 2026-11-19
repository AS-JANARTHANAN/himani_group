import Link from "next/link";
import Icon from "@/components/Icon";

/** Marks an element as editable: clicking it in the admin preview jumps to its field. */
export const E = (key: string) => ({ "data-edit": key });


/** Responsive, compressed image props via the Next.js image optimiser (local files only). */
export function pic(src: string | undefined, sizes = "100vw") {
  if (!src) return {};
  if (!src.startsWith("/") || src.endsWith(".svg")) return { src };
  const u = (w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
  return { src: u(1920), srcSet: [640, 1080, 1920].map((w) => `${u(w)} ${w}w`).join(", "), sizes };
}

export function Arrow() {
  return <span className="arrow" aria-hidden />;
}

export function Heading({ as: Tag = "h2", className = "h2", title, accent, k = "" }: { as?: "h1" | "h2"; className?: string; title?: string; accent?: string; k?: string }) {
  return (
    <Tag className={`${className} lines`}>
      <span>
        <span {...E(`${k}title`)}>{title}</span>
      </span>
      {accent ? (
        <span>
          <span className="accent" {...E(`${k}titleAccent`)}>
            {accent}
          </span>
        </span>
      ) : null}
    </Tag>
  );
}

export function PageHero({
  hero,
  crumbs,
}: {
  hero: { eyebrow?: string; title?: string; titleAccent?: string; text?: string; image?: string; imageAlt?: string };
  crumbs?: { label: string; href?: string }[];
}) {
  const hasImage = !!hero.image;
  return (
    <section className={`page-hero ${hasImage ? "has-image hero-curve" : ""}`}>
      {hasImage ? (
        <>
          <div className="bg" {...E("hero.image")}>
            <img {...pic(hero.image, "(max-width: 900px) 100vw, 60vw")} alt={hero.imageAlt || ""} />
          </div>
          <span className="arc" aria-hidden />
        </>
      ) : null}
      <div className="wrap inner">
        {crumbs?.length ? (
          <div className="crumbs">
            {crumbs.map((c, i) => (
              <span key={i}>
                {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
                {i < crumbs.length - 1 ? <span aria-hidden> / </span> : null}
              </span>
            ))}
          </div>
        ) : null}
        {hero.eyebrow ? (
          <div className="tag" {...E("hero.eyebrow")}>
            {hero.eyebrow}
          </div>
        ) : null}
        <Heading as="h1" className="h1" title={hero.title} accent={hero.titleAccent} k="hero." />
        {hero.text ? (
          <p className="lede reveal" {...E("hero.text")}>
            {hero.text}
          </p>
        ) : null}
      </div>
      <div className="hazard" aria-hidden />
    </section>
  );
}

export function CtaBand({ cta }: { cta: { eyebrow?: string; title?: string; text?: string; buttonLabel?: string; buttonHref?: string; buttonIcon?: string } }) {
  if (!cta?.title) return null;
  return (
    <section className="cta-band">
      <div className="wrap inner reveal">
        <div>
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
          <Link href={cta.buttonHref || "/contact"} className="btn dark" {...E("cta.buttonLabel")}>
            {cta.buttonLabel} {cta.buttonIcon ? <Icon name={cta.buttonIcon} size={20} /> : <Arrow />}
          </Link>
        ) : null}
      </div>
    </section>
  );
}

type V = { id: string; slug: string; title: string; summary: string; image: string; imageAlt: string; imagePosition: string; icon?: string };

/** Service cards: photo, icon badge, title and short text. */
export function VerticalRows({ items, linkLabel = "View service" }: { items: V[]; eyebrow?: string; linkLabel?: string }) {
  return (
    <div className="v-grid">
      {items.map((v, i) => (
        <Link href={`/businesses/${v.slug}`} className={`v-card reveal d${i % 3}`} key={v.slug} data-edit={`vertical:${v.id}`}>
          <div className="v-img">
            {v.image ? <img {...pic(v.image, "(max-width: 640px) 100vw, (max-width: 1180px) 50vw, 440px")} alt={v.imageAlt} loading={i < 3 ? "eager" : "lazy"} style={{ objectPosition: v.imagePosition }} /> : null}
            <span className="v-n">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <div className="v-body">
            <span className="v-badge">{v.icon ? <Icon name={v.icon} size={28} /> : null}</span>
            <h3 className="h3">{v.title}</h3>
            <p>{v.summary}</p>
            <span className="v-more">
              {linkLabel} <Icon name="arrow" size={18} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
