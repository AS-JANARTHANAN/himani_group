"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/Icon";

type Service = { id: string; slug: string; title: string; summary: string; icon?: string };
type Labels = { hint?: string; linkLabel?: string };

/** Where each kind of service lives on the illustrated site (x/y in the 1600×600 drawing). */
const ZONES: Record<string, { x: number; y: number; zone: string }> = {
  ship: { x: 128, y: 330, zone: "port" },
  box: { x: 318, y: 360, zone: "warehouse" },
  ruler: { x: 470, y: 352, zone: "office" },
  compass: { x: 470, y: 352, zone: "office" },
  bulldozer: { x: 640, y: 430, zone: "pit" },
  shovel: { x: 640, y: 430, zone: "pit" },
  excavator: { x: 832, y: 412, zone: "yard" },
  dumptruck: { x: 832, y: 412, zone: "yard" },
  crane: { x: 1010, y: 250, zone: "tower" },
  building: { x: 1010, y: 250, zone: "tower" },
  home: { x: 1208, y: 360, zone: "villa" },
  tile: { x: 1352, y: 360, zone: "tiles" },
  pillar: { x: 1452, y: 350, zone: "arch" },
  chair: { x: 1452, y: 350, zone: "arch" },
  palm: { x: 1545, y: 340, zone: "farm" },
  leaf: { x: 1545, y: 340, zone: "farm" },
  sprout: { x: 1545, y: 340, zone: "farm" },
};

const W = 1600;
const H = 600;
// Visible part of the drawing (crops empty sky and deep ground so everything reads bigger)
const VY = 110;
const VH = 450;

export default function ServiceScene({ services, labels = {} }: { services: Service[]; labels?: Labels }) {
  // Place each service on its zone (first come, first served); the rest appear only in the list.
  const placed = useMemo(() => {
    const used = new Set<string>();
    return services.map((s) => {
      const z = s.icon ? ZONES[s.icon] : undefined;
      if (!z || used.has(z.zone)) return { ...s, spot: null as null | (typeof ZONES)[string] };
      used.add(z.zone);
      return { ...s, spot: z };
    });
  }, [services]);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  const cur = placed[active];

  // Gentle guided tour until the visitor interacts (paused when off screen or with reduced motion).
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setInterval(() => {
      if (touched || reduce || !visible.current || document.hidden) return;
      setActive((a) => (a + 1) % placed.length);
    }, 4200);
    return () => {
      clearInterval(t);
      io.disconnect();
    };
  }, [touched, placed.length]);

  // On phones the drawing scrolls sideways: keep the chosen spot in view.
  useEffect(() => {
    const sc = scroller.current;
    const spot = placed[active]?.spot;
    if (!sc || !spot || sc.scrollWidth <= sc.clientWidth + 4) return;
    const x = (spot.x / W) * sc.scrollWidth - sc.clientWidth / 2;
    sc.scrollTo({ left: Math.max(0, x), behavior: "smooth" });
  }, [active, placed]);

  const pick = useCallback((i: number) => {
    setTouched(true);
    setActive(i);
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") pick((active + 1) % placed.length);
    if (e.key === "ArrowLeft") pick((active - 1 + placed.length) % placed.length);
  };

  const zoneOn = (z: string) => (cur?.spot?.zone === z ? "on" : "");

  return (
    <div className="scene" ref={wrap} onKeyDown={onKey}>
      <div className="scene-frame">
        <div className="scene-scroll" ref={scroller}>
          <div className="scene-canvas">
            <svg viewBox={`0 ${VY} ${W} ${VH}`} className={`scene-svg ${cur?.spot ? "has-active" : ""}`} aria-hidden>
              <defs>
                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--dark)" />
                  <stop offset="1" stopColor="var(--dark-3)" />
                </linearGradient>
                <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor="var(--accent)" stopOpacity="0.55" />
                  <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                </radialGradient>
                <pattern id="tiles" width="16" height="16" patternUnits="userSpaceOnUse">
                  <rect width="16" height="16" fill="#1f6f78" />
                  <path d="M8 1L15 8L8 15L1 8Z" fill="var(--accent)" />
                  <circle cx="8" cy="8" r="2.5" fill="#f3e9d2" />
                </pattern>
                <pattern id="blueprint" width="12" height="12" patternUnits="userSpaceOnUse">
                  <rect width="12" height="12" fill="#1d4f91" />
                  <path d="M12 0V12M0 12H12" stroke="#7fb1ff" strokeWidth="0.6" opacity="0.6" />
                </pattern>
              </defs>

              {/* sky, sun, distant skyline */}
              <rect width={W} height={H} fill="url(#sky)" />
              <circle cx="1250" cy="190" r="230" fill="url(#sun)" />
              <g className="skyline" fill="#fff" opacity="0.07">
                <path d="M300 440V330h26v110zM340 440V300h18v140zM620 440V350h30v90zM700 440V320h22v120zM1150 440V340h28v100zM1300 440V310h20v130zM1360 440V350h34v90z" />
                <path d="M760 440V250l8-90 8 90v190z M752 440V300h32v140z" />
              </g>

              {/* ground and sea */}
              <rect y="440" width={W} height="160" fill="#2e241c" />
              <rect y="440" width={W} height="8" fill="#4a3a2c" />
              <path d="M0 440H250V600H0Z" fill="#0d3a52" />
              <path d="M10 470q20-8 40 0t40 0t40 0t40 0t40 0 M30 510q20-8 40 0t40 0t40 0t40 0" stroke="#5fa8d3" strokeWidth="3" fill="none" opacity="0.5" />
              <path d="M0 440H1600" stroke="var(--accent)" strokeWidth="2" opacity="0.5" />

              {/* 1 · port: ship and gantry crane */}
              <g className={`zone ${zoneOn("port")}`}>
                <path d="M30 400H230L210 445H50Z" fill="#c23b22" />
                <path d="M30 400H230V410H30Z" fill="#f3e9d2" opacity="0.85" />
                <g>
                  <rect x="50" y="368" width="36" height="32" fill="var(--accent)" />
                  <rect x="88" y="368" width="36" height="32" fill="#3a86ff" />
                  <rect x="126" y="368" width="36" height="32" fill="#e4572e" />
                  <rect x="69" y="336" width="36" height="32" fill="#2a9d8f" />
                  <rect x="107" y="336" width="36" height="32" fill="var(--accent)" />
                  <rect x="164" y="368" width="36" height="32" fill="#2a9d8f" />
                </g>
                <rect x="190" y="340" width="22" height="28" fill="#f3e9d2" />
                <path d="M232 440V250M262 440V250M222 250H300M232 250l30 40M262 250l-30 40" stroke="#e8e2d4" strokeWidth="6" fill="none" />
                <path d="M290 250V300" stroke="#e8e2d4" strokeWidth="3" />
              </g>

              {/* 2 · warehouse with forklift */}
              <g className={`zone ${zoneOn("warehouse")}`}>
                <path d="M262 440V350L320 318L378 350V440Z" fill="#fff" fillOpacity="0.16" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" />
                <rect x="300" y="380" width="40" height="60" fill="#000" opacity="0.35" />
                <rect x="268" y="410" width="22" height="30" fill="var(--accent)" opacity="0.9" />
                <rect x="268" y="388" width="22" height="20" fill="#c9a26b" />
                <path d="M350 440v-30h18v30M368 425h14v15" stroke="var(--accent)" strokeWidth="5" fill="none" />
                <circle cx="356" cy="440" r="5" fill="#111" />
              </g>

              {/* 3 · engineering office with blueprint board */}
              <g className={`zone ${zoneOn("office")}`}>
                <rect x="410" y="360" width="120" height="80" fill="#fff" fillOpacity="0.14" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" />
                <path d="M420 372h100M420 392h100M420 412h100" stroke="#9ad1ff" strokeOpacity="0.45" strokeWidth="6" />
                <rect x="432" y="300" width="80" height="54" fill="url(#blueprint)" stroke="#fff" strokeWidth="2" />
                <path d="M442 344l20-30 18 22 14-14" stroke="#fff" strokeWidth="2" fill="none" />
                <path d="M440 354l-8 6M504 354l8 6" stroke="#fff" strokeWidth="2" />
              </g>

              {/* 4 · earthmoving pit with excavator, dump truck and soil */}
              <g className={`zone ${zoneOn("pit")}`}>
                <path d="M560 444L590 520H700L730 444Z" fill="#1b140f" />
                <path d="M590 520H700" stroke="#6b4a2f" strokeWidth="4" />
                <path d="M600 500l20 12 30-6 25 8" stroke="#6b4a2f" strokeWidth="3" fill="none" />
                {/* excavator */}
                <g className="dig">
                  <rect x="700" y="408" width="54" height="22" rx="3" fill="var(--accent)" />
                  <rect x="730" y="388" width="24" height="22" rx="2" fill="var(--accent)" />
                  <rect x="734" y="392" width="14" height="10" fill="#0d1b2a" opacity="0.6" />
                  <rect x="696" y="430" width="64" height="12" rx="6" fill="#222" />
                  <g className="arm">
                    <path d="M710 410L670 372L630 420" stroke="var(--accent)" strokeWidth="10" fill="none" strokeLinejoin="round" />
                    <path d="M622 412l18 10-6 16-18-6z" fill="#333" />
                  </g>
                </g>
                {/* soil pile + dump truck */}
                <path d="M540 440q20-36 46-2" fill="#8a5a3b" />
              </g>

              {/* 5 · equipment yard: dump truck, roller, loader */}
              <g className={`zone ${zoneOn("yard")}`}>
                <path d="M776 412h70l10 18h-80z" fill="var(--accent)" />
                <rect x="846" y="400" width="28" height="30" rx="3" fill="var(--accent)" />
                <rect x="852" y="405" width="16" height="10" fill="#0d1b2a" opacity="0.6" />
                <circle cx="796" cy="436" r="9" fill="#222" />
                <circle cx="860" cy="436" r="9" fill="#222" />
                <path d="M780 412q18-26 54 0" fill="#8a5a3b" />
                <rect x="884" y="414" width="34" height="18" rx="2" fill="#e9e4d8" opacity="0.85" />
                <circle cx="890" cy="436" r="7" fill="#222" />
                <rect x="906" y="426" width="22" height="14" rx="7" fill="#777" />
              </g>

              {/* 6 · tower under construction with tower crane */}
              <g className={`zone ${zoneOn("tower")}`}>
                <g stroke="#fff" strokeOpacity="0.55" strokeWidth="3" fill="none">
                  <rect x="950" y="230" width="110" height="210" />
                  <path d="M950 265h110M950 300h110M950 335h110M950 370h110M950 405h110M987 230v210M1023 230v210" />
                </g>
                <rect x="950" y="300" width="110" height="140" fill="#fff" fillOpacity="0.1" />
                <g className="crane">
                  <path d="M1090 440V150" stroke="var(--accent)" strokeWidth="8" />
                  <path d="M1086 160l8 0M1086 200h8M1086 240h8M1086 280h8M1086 320h8M1086 360h8M1086 400h8" stroke="#111" strokeWidth="2" />
                  <path d="M930 150H1160M1090 150L1060 120H1120Z" stroke="var(--accent)" strokeWidth="6" fill="none" />
                  <rect x="1140" y="150" width="22" height="18" fill="#555" />
                  <g className="hook">
                    <path d="M970 150V205" stroke="#ddd" strokeWidth="2" />
                    <rect x="956" y="205" width="28" height="12" fill="var(--accent)" />
                  </g>
                </g>
              </g>

              {/* 7 · villa with pool and palm */}
              <g className={`zone ${zoneOn("villa")}`}>
                <rect x="1140" y="380" width="120" height="60" fill="#f3efe6" />
                <rect x="1170" y="350" width="80" height="34" fill="#f3efe6" />
                <rect x="1165" y="346" width="90" height="6" fill="#c9b79a" />
                <rect x="1180" y="392" width="30" height="30" fill="#5fa8d3" opacity="0.8" />
                <rect x="1220" y="392" width="28" height="48" fill="#3d3d3d" opacity="0.7" />
                <rect x="1262" y="428" width="44" height="12" fill="#3fc1e0" />
                <path d="M1128 440V372M1128 372q-22-6-30 8M1128 372q22-6 30 8M1128 372q-12-16-26-14M1128 372q12-16 26-14" stroke="#4a8a3a" strokeWidth="5" fill="none" />
              </g>

              {/* 8 · tile workshop */}
              <g className={`zone ${zoneOn("tiles")}`}>
                <rect x="1314" y="370" width="84" height="70" fill="#fff" fillOpacity="0.12" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" />
                <rect x="1322" y="380" width="68" height="48" fill="url(#tiles)" />
                <path d="M1310 370l46-24 46 24" fill="#fff" fillOpacity="0.2" />
              </g>

              {/* 9 · carved heritage wood arch */}
              <g className={`zone ${zoneOn("arch")}`}>
                <path d="M1420 440V372q0-34 32-40q32 6 32 40V440Z" fill="#7a4a24" />
                <path d="M1430 440V376q0-26 22-32q22 6 22 32V440Z" fill="#5a3418" />
                <path d="M1452 348v92M1436 380h32M1436 410h32" stroke="#c9934f" strokeWidth="2" />
                <circle cx="1452" cy="362" r="5" fill="var(--accent)" />
              </g>

              {/* 10 · date palm farm */}
              <g className={`zone ${zoneOn("farm")}`}>
                <path d="M1500 440h100v6h-100z" fill="#3f6b2a" />
                {[1515, 1550, 1585].map((x, i) => (
                  <path key={x} d={`M${x} 440V${360 + i * 6}M${x} ${360 + i * 6}q-24-6-30 10M${x} ${360 + i * 6}q24-6 30 10M${x} ${360 + i * 6}q-12-18-28-16M${x} ${360 + i * 6}q12-18 28-16`} stroke="#5c9a3a" strokeWidth="5" fill="none" />
                ))}
                <circle cx="1546" cy="372" r="4" fill="#c97b2a" />
              </g>
            </svg>

            {/* hotspots */}
            {placed.map((s, i) =>
              s.spot ? (
                <button
                  key={s.id}
                  type="button"
                  suppressHydrationWarning
                  className={`hotspot ${i === active ? "on" : ""}`}
                  style={{ left: `${(s.spot.x / W) * 100}%`, top: `${((s.spot.y - VY) / VH) * 100}%` }}
                  onClick={() => pick(i)}
                  onMouseEnter={() => (touched ? setActive(i) : null)}
                  aria-label={s.title}
                  aria-pressed={i === active}
                  data-edit={`vertical:${s.id}`}
                >
                  <span className="ring" />
                  <span className="dot">{s.icon ? <Icon name={s.icon} size={18} stroke={2} /> : i + 1}</span>
                  <span className="tip">{s.title}</span>
                </button>
              ) : null
            )}
          </div>
        </div>

        {cur ? (
          <div className="scene-card" aria-live="polite" key={cur.id}>
            <span className="sc-ic">{cur.icon ? <Icon name={cur.icon} size={26} /> : null}</span>
            <div>
              <h3>{cur.title}</h3>
              <p>{cur.summary}</p>
              <Link href={`/businesses/${cur.slug}`} className="sc-link" data-edit="explore.linkLabel">
                {labels.linkLabel} <Icon name="arrow" size={16} />
              </Link>
            </div>
          </div>
        ) : null}
        {labels.hint ? (
          <p className="scene-hint" data-edit="explore.hint">
            <Icon name="hand" size={16} /> {labels.hint}
          </p>
        ) : null}
      </div>

      <div className="scene-chips" role="tablist" aria-label="Services">
        {placed.map((s, i) => (
          <button
            key={s.id}
            type="button"
            suppressHydrationWarning
            role="tab"
            aria-selected={i === active}
            className={`sc-chip ${i === active ? "on" : ""}`}
            onClick={() => pick(i)}
          >
            {s.icon ? <Icon name={s.icon} size={16} /> : null}
            {s.title}
          </button>
        ))}
      </div>
    </div>
  );
}
