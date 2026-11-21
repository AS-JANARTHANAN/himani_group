"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Item = { slug: string; title: string; summary: string; image: string; imageAlt: string; imagePosition: string; src: Record<string, string | undefined> };

/**
 * Self-running photo carousel of the business verticals.
 * Moves one card every few seconds, pauses while hovered, touched or focused,
 * can be swiped / scrolled by hand, and has previous / next buttons.
 */
export default function BusinessCarousel({ items, prevLabel = "Previous", nextLabel = "Next" }: { items: Item[]; prevLabel?: string; nextLabel?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [active, setActive] = useState(0);

  const step = () => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>(".bc-card");
    return card ? card.offsetWidth + parseFloat(getComputedStyle(el!).columnGap || "0") : 0;
  };
  const go = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (dir > 0 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir < 0 && el.scrollLeft <= 4) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * step(), behavior: "smooth" });
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      if (!paused.current && document.visibilityState === "visible") go(1);
    }, 3800);
    return () => window.clearInterval(t);
  }, []);

  const onScroll = () => {
    const s = step();
    if (s) setActive(Math.round((track.current?.scrollLeft || 0) / s));
  };
  const hold = (v: boolean) => () => {
    paused.current = v;
  };

  return (
    <div className="bc" onMouseEnter={hold(true)} onMouseLeave={hold(false)} onFocusCapture={hold(true)} onBlurCapture={hold(false)} onTouchStart={hold(true)} onTouchEnd={() => setTimeout(hold(false), 4000)}>
      <div className="bc-track" ref={track} onScroll={onScroll}>
        {items.map((v, i) => (
          <Link href={`/businesses/${v.slug}`} className="bc-card" key={v.slug} aria-label={v.title}>
            <div className="bc-img">
              {v.image ? <img {...v.src} alt={v.imageAlt} loading="lazy" style={{ objectPosition: v.imagePosition }} /> : null}
              <span className="v-index">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="bc-body">
              <h3>{v.title}</h3>
              <p>{v.summary}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="bc-controls">
        <div className="bc-dots" aria-hidden>
          {items.map((v, i) => (
            <i key={v.slug} className={i === active ? "on" : ""} />
          ))}
        </div>
        <div className="bc-arrows">
          <button type="button" onClick={() => go(-1)} aria-label={prevLabel} suppressHydrationWarning>
            <span className="arrow left" aria-hidden />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={nextLabel} suppressHydrationWarning>
            <span className="arrow" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
