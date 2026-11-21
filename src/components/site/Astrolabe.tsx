"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type AstroLocation = { id: string; city: string; country: string; kind: string; lat: number; lng: number; description?: string };
type Labels = { hq?: string; office?: string; market?: string };

const C = 320; // centre of the 640 x 640 drawing
const R_TICKS = 268;
const COMPASS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
const rad = (d: number) => (d * Math.PI) / 180;
const norm = (d: number) => ((d % 360) + 360) % 360;
/** Shortest signed turn from a to b, in degrees (-180..180). */
const turn = (a: number, b: number) => ((((b - a) % 360) + 540) % 360) - 180;

function bearing(a: AstroLocation, b: AstroLocation) {
  const y = Math.sin(rad(b.lng - a.lng)) * Math.cos(rad(b.lat));
  const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng));
  return norm((Math.atan2(y, x) * 180) / Math.PI);
}
function km(a: AstroLocation, b: AstroLocation) {
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}
/** Rounded to 2 decimals so the server and the browser draw identical numbers (no hydration mismatch). */
const r2 = (v: number) => Math.round(v * 100) / 100;
/** Point on the dial for a screen angle (0 = top, clockwise) and radius. */
const at = (deg: number, r: number) => ({ x: r2(C + r * Math.sin(rad(deg))), y: r2(C - r * Math.cos(rad(deg))) });

/**
 * "Where we work" as an Arabian astrolabe: the head office is the star at the centre,
 * every other place sits on the turning ring at its true compass direction from it
 * (closer places nearer the centre). The gold pointer at the top marks the place shown in the card.
 * Turn it by dragging, by the arrows, by the arrow keys or by tapping a place; it also turns on its own.
 */
export default function Astrolabe({
  locations,
  labels = {},
  focusId,
  onSelect,
  autoPlay = true,
}: {
  locations: AstroLocation[];
  labels?: Labels;
  focusId?: string | null;
  onSelect?: (id: string) => void;
  autoPlay?: boolean;
}) {
  const hq = locations.find((l) => l.kind === "hq") || locations[0];

  // Places on the ring, with direction, distance and a radius that keeps neighbours apart
  const places = useMemo(() => {
    if (!hq) return [];
    const list = locations
      .filter((l) => l.id !== hq.id)
      .map((l) => ({ ...l, b: bearing(hq, l), d: km(hq, l) }))
      .sort((a, b) => a.b - b.b);
    const maxD = Math.max(1, ...list.map((l) => l.d));
    const out: (typeof list[number] & { r: number })[] = [];
    for (const l of list) {
      let r = 150 + 82 * (Math.log1p(l.d) / Math.log1p(maxD));
      for (const o of out) if (Math.abs(turn(o.b, l.b)) < 18 && Math.abs(o.r - r) < 46) r = o.r - 58 >= 104 ? o.r - 58 : o.r + 58;
      out.push({ ...l, r: Math.min(232, r) });
    }
    return out;
  }, [locations, hq]);

  const [sel, setSel] = useState<string | null>(focusId ?? places[0]?.id ?? hq?.id ?? null);
  const [rot, setRot] = useState(() => -(places.find((p) => p.id === (focusId ?? places[0]?.id))?.b ?? 0));
  const rotRef = useRef(rot);
  const anim = useRef(0);
  const hold = useRef(false);
  const drag = useRef<{ a: number; r: number; moved: boolean } | null>(null);
  const svg = useRef<SVGSVGElement>(null);

  const setRotation = (v: number) => {
    rotRef.current = v;
    setRot(v);
  };
  const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Ease the ring round to bring a place under the pointer
  const turnTo = (target: number) => {
    cancelAnimationFrame(anim.current);
    const from = rotRef.current;
    const to = from + turn(from, target);
    if (reduced()) return setRotation(to);
    const t0 = performance.now();
    const dur = 900;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      setRotation(from + (to - from) * e);
      if (k < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  };

  const choose = (id: string, notify = true) => {
    setSel(id);
    const p = places.find((x) => x.id === id);
    if (p) turnTo(-p.b);
    if (notify) onSelect?.(id);
  };
  const go = (dir: number) => {
    if (!places.length) return;
    const i = places.findIndex((p) => p.id === sel);
    const next = places[(((i < 0 ? -1 : i) + dir) % places.length + places.length) % places.length];
    choose(next.id);
  };

  // Follow selection from outside (the location chips on the Where We Work page)
  useEffect(() => {
    if (focusId && focusId !== sel) choose(focusId, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId]);

  // Turn by itself, one place every few seconds, while nobody is using it
  useEffect(() => {
    if (!autoPlay || places.length < 2 || reduced()) return;
    const t = window.setInterval(() => {
      if (!hold.current && !drag.current && document.visibilityState === "visible") go(1);
    }, 5200);
    return () => window.clearInterval(t);
  });
  useEffect(() => () => cancelAnimationFrame(anim.current), []);

  // Drag to turn (mouse, pen, or a sideways swipe on phones), then settle on the nearest place
  const angleOf = (e: React.PointerEvent) => {
    const b = svg.current!.getBoundingClientRect();
    return (Math.atan2(e.clientX - (b.left + b.width / 2), -(e.clientY - (b.top + b.height / 2))) * 180) / Math.PI;
  };
  const onDown = (e: React.PointerEvent) => {
    cancelAnimationFrame(anim.current);
    drag.current = { a: angleOf(e), r: rotRef.current, moved: false };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const delta = turn(d.a, angleOf(e));
    if (Math.abs(delta) > 2 && !d.moved) {
      d.moved = true;
      try {
        (e.currentTarget as Element).setPointerCapture(e.pointerId);
      } catch {
        /* capture is a nicety; dragging works without it */
      }
    }
    if (d.moved) setRotation(d.r + delta);
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved || !places.length) return;
    let best = places[0];
    for (const p of places) if (Math.abs(turn(rotRef.current, -p.b)) < Math.abs(turn(rotRef.current, -best.b))) best = p;
    choose(best.id);
  };

  const current = places.find((p) => p.id === sel) || (sel === hq?.id ? null : places[0]);
  const showing = current || hq;
  const kindLabel = (k: string) => (k === "hq" ? labels.hq || "Head office" : k === "market" ? labels.market || "Market" : labels.office || "Office");

  if (!hq) return null;

  return (
    <div className="astro" onMouseEnter={() => (hold.current = true)} onMouseLeave={() => (hold.current = false)} onFocusCapture={() => (hold.current = true)} onBlurCapture={() => (hold.current = false)}>
      <div className="astro-dial">
        <svg
          ref={svg}
          viewBox="0 0 640 640"
          role="group"
          aria-label={`Places we work, by direction from ${hq.city}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") (e.preventDefault(), go(1));
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") (e.preventDefault(), go(-1));
          }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {/* Mater: the fixed outer body */}
          <circle cx={C} cy={C} r={306} className="a-line" />
          <circle cx={C} cy={C} r={296} className="a-band" />
          {Array.from({ length: 72 }, (_, i) => {
            const p = at(i * 5, 296);
            return <circle key={i} cx={p.x} cy={p.y} r={i % 6 === 0 ? 2.6 : 1.2} className="a-dot" />;
          })}
          <circle cx={C} cy={C} r={284} className="a-line" />

          {/* Rete: the turning ring with compass scale, distance tracks and places */}
          <g transform={`rotate(${r2(rot)} ${C} ${C})`}>
            {Array.from({ length: 72 }, (_, i) => {
              const big = i % 6 === 0;
              const p1 = at(i * 5, R_TICKS);
              const p2 = at(i * 5, R_TICKS - (big ? 14 : 7));
              return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className={big ? "a-tick big" : "a-tick"} />;
            })}
            <circle cx={C} cy={C} r={R_TICKS} className="a-line" />
            <circle cx={C} cy={C} r={196} className="a-track" />
            <circle cx={C} cy={C} r={128} className="a-track" />
            <path className="a-arch" d={`M ${C - 196} ${C} A 196 196 0 0 1 ${C + 196} ${C}`} />
            {/* eight-fold rosette, as engraved on Arabian astrolabes */}
            <polygon className="a-rosette" points={Array.from({ length: 16 }, (_, i) => { const p = at(i * 157.5, 112); return `${p.x},${p.y}`; }).join(" ")} />
            {Array.from({ length: 8 }, (_, i) => {
              const p = at(i * 45 + 22.5, 128);
              return <circle key={"r" + i} cx={p.x} cy={p.y} r={2} className="a-dot" />;
            })}
          </g>
          {["N", "E", "S", "W"].map((n, i) => {
            const p = at(i * 90 + rot, 236);
            return (
              <text key={n} x={p.x} y={p.y} className="a-cardinal" textAnchor="middle" dominantBaseline="central">
                {n}
              </text>
            );
          })}

          {/* Spokes and places (positions are computed so the names stay upright) */}
          {places.map((p) => {
            const q = at(p.b + rot, p.r);
            const on = p.id === showing?.id;
            return <line key={"s" + p.id} x1={C} y1={C} x2={q.x} y2={q.y} className={on ? "a-spoke on" : "a-spoke"} />;
          })}
          {places.map((p) => {
            const ang = p.b + rot;
            const q = at(ang, p.r);
            // the name sits beside the marker (clockwise side), so it never lies on a spoke
            const tx = Math.cos(rad(ang));
            const ty = Math.sin(rad(ang));
            const lab = { x: r2(q.x + tx * 20), y: r2(q.y + ty * 20 + (Math.abs(tx) < 0.35 ? (ty > 0 ? 6 : -6) : 0)) };
            const anchor = tx > 0.35 ? "start" : tx < -0.35 ? "end" : "middle";
            const on = p.id === showing?.id;
            return (
              <g key={p.id} className={`a-place ${p.kind} ${on ? "on" : ""}`} onClick={() => !drag.current?.moved && choose(p.id)} role="button" aria-label={`${p.city}, ${p.country}`} aria-pressed={on}>
                <circle cx={q.x} cy={q.y} r={22} className="a-hit" />
                {on ? <circle cx={q.x} cy={q.y} r={15} className="a-halo" /> : null}
                <circle cx={q.x} cy={q.y} r={on ? 9 : 7} className="a-mark" />
                <text x={lab.x} y={lab.y} textAnchor={anchor} dominantBaseline="central" className="a-name">
                  {p.city}
                </text>
              </g>
            );
          })}

          {/* Centre: the head office as an eight-point star */}
          <g className="a-hq" onClick={() => (setSel(hq.id), onSelect?.(hq.id))} role="button" aria-label={`${hq.city}, ${kindLabel("hq")}`}>
            <rect x={C - 22} y={C - 22} width={44} height={44} className="a-star" />
            <rect x={C - 22} y={C - 22} width={44} height={44} className="a-star" transform={`rotate(45 ${C} ${C})`} />
            <circle cx={C} cy={C} r={8} className="a-core" />
            <text x={C} y={C + 52} textAnchor="middle" className="a-hq-name">
              {hq.city}
            </text>
          </g>

          {/* Fixed gold pointer at the top */}
          <path d={`M ${C - 11} 6 L ${C + 11} 6 L ${C} 30 Z`} className="a-pointer" />
          <line x1={C} y1={30} x2={C} y2={52} className="a-pointer-line" />
        </svg>
      </div>

      <div className="astro-card" aria-live="polite">
        <small>{kindLabel(showing.kind)}</small>
        <strong>{showing.city}</strong>
        <span className="astro-country">{showing.country}</span>
        {showing.description ? <p>{showing.description}</p> : null}
        {current ? (
          <span className="astro-meta">
            {Math.round(current.d / 10) * 10 > 0 ? `${(Math.round(current.d / 10) * 10).toLocaleString("en-US")} km` : ""} · {COMPASS[Math.round(current.b / 22.5) % 16]} of {hq.city}
          </span>
        ) : null}
        {places.length > 1 ? (
          <div className="astro-nav">
            <button type="button" onClick={() => go(-1)} aria-label="Previous place" suppressHydrationWarning>
              <span className="arrow left" aria-hidden />
            </button>
            <span>
              {Math.max(1, places.findIndex((p) => p.id === current?.id) + 1)} / {places.length}
            </span>
            <button type="button" onClick={() => go(1)} aria-label="Next place" suppressHydrationWarning>
              <span className="arrow" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
