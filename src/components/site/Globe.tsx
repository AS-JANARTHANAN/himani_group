"use client";

import { useEffect, useRef } from "react";
import landDots from "@/lib/land-dots.json";

export type GlobeLocation = { id: string; city: string; country: string; kind: string; lat: number; lng: number };

type Props = {
  locations: GlobeLocation[];
  focusId?: string | null;
  onSelect?: (id: string) => void;
  showLabels?: boolean;
  initial?: { lat: number; lng: number };
  ariaLabel?: string;
};

const RAD = Math.PI / 180;
type V3 = [number, number, number];

const toVec = (lat: number, lng: number): V3 => [Math.cos(lat * RAD) * Math.sin(lng * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.cos(lng * RAD)];

// Pre-computed unit vectors for land dots (shared across instances)
let DOTS: Float32Array | null = null;
function dots() {
  if (DOTS) return DOTS;
  const src = landDots as number[];
  const out = new Float32Array((src.length / 2) * 3);
  for (let i = 0, j = 0; i < src.length; i += 2, j += 3) {
    const v = toVec(src[i], src[i + 1]);
    out[j] = v[0];
    out[j + 1] = v[1];
    out[j + 2] = v[2];
  }
  return (DOTS = out);
}

function slerp(a: V3, b: V3, t: number): V3 {
  const d = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const w = Math.acos(d);
  if (w < 1e-6) return a;
  const s = Math.sin(w);
  const k1 = Math.sin((1 - t) * w) / s;
  const k2 = Math.sin(t * w) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}

const wrap = (a: number) => {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
};

export default function Globe({ locations, focusId, onSelect, showLabels = true, initial = { lat: 18, lng: 62 }, ariaLabel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    yaw: -initial.lng * RAD,
    pitch: initial.lat * RAD,
    vy: 0,
    vp: 0,
    target: null as null | { yaw: number; pitch: number },
    dragging: false,
    lastInteract: 0,
    focusId: focusId ?? null,
    locs: locations,
    onSelect,
  });

  state.current.locs = locations;
  state.current.onSelect = onSelect;

  useEffect(() => {
    const s = state.current;
    s.focusId = focusId ?? null;
    const loc = locations.find((l) => l.id === focusId);
    if (loc) {
      s.target = { yaw: -loc.lng * RAD, pitch: Math.max(-1, Math.min(1, loc.lat * RAD * 0.85)) };
      s.lastInteract = performance.now();
    }
  }, [focusId, locations]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const s = state.current;
    const D = dots();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Theme colours from the CMS (CSS variables) → "r,g,b" strings for rgba()
    const css = getComputedStyle(document.documentElement);
    const rgb = (name: string, fallback: string) => {
      const v = css.getPropertyValue(name).trim();
      const m = /^#([0-9a-f]{6})$/i.exec(v);
      if (!m) return fallback;
      const n = parseInt(m[1], 16);
      return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
    };
    const GOLD = rgb("--accent", "255,194,26");
    const SOFT = GOLD.split(",").map((c) => Math.round(Number(c) + (255 - Number(c)) * 0.55)).join(",");
    const INK = rgb("--dark", "15,24,36");
    const mixW = (k: number) => INK.split(",").map((c) => Math.round(Number(c) + (255 - Number(c)) * k)).join(",");
    const B0 = `rgb(${mixW(0.16)})`, B1 = `rgb(${mixW(0.07)})`, B2 = `rgb(${INK})`;
    let W = 0, H = 0, R = 0, cx = 0, cy = 0, dpr = 1;
    let visible = true;
    let raf = 0;
    let last = performance.now();
    let markers: { id: string; x: number; y: number }[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width * dpr));
      H = Math.max(1, Math.round(r.height * dpr));
      canvas.width = W;
      canvas.height = H;
      R = Math.min(W, H) * 0.44;
      cx = W / 2;
      cy = H / 2;
    };

    const rot = (v: V3, cy_: number, sy: number, cp: number, sp: number): V3 => {
      const x1 = v[0] * cy_ + v[2] * sy;
      const z1 = -v[0] * sy + v[2] * cy_;
      const y2 = v[1] * cp - z1 * sp;
      const z2 = v[1] * sp + z1 * cp;
      return [x1, y2, z2];
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      // ---- motion ----
      if (s.target) {
        const dy = wrap(s.target.yaw - s.yaw);
        const dp = s.target.pitch - s.pitch;
        s.yaw += dy * Math.min(1, dt * 3.2);
        s.pitch += dp * Math.min(1, dt * 3.2);
        if (Math.abs(dy) < 0.002 && Math.abs(dp) < 0.002) s.target = null;
      } else if (!s.dragging) {
        s.yaw += s.vy;
        s.pitch += s.vp;
        s.vy *= 0.94;
        s.vp *= 0.94;
        const idle = now - s.lastInteract > (s.focusId ? 7000 : 2200);
        if (idle && !reduce) {
          // gentle sway around the home region so routes stay in view
          const home = -initial.lng * RAD + Math.sin(t * 0.11) * 0.75;
          s.yaw += wrap(home - s.yaw) * Math.min(1, dt * 0.35);
          s.pitch += (initial.lat * RAD - s.pitch) * Math.min(1, dt * 0.35);
        }
      }
      s.pitch = Math.max(-1.1, Math.min(1.1, s.pitch));

      const cY = Math.cos(s.yaw), sY = Math.sin(s.yaw), cP = Math.cos(s.pitch), sP = Math.sin(s.pitch);

      ctx.clearRect(0, 0, W, H);

      // ---- sphere ----
      const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      body.addColorStop(0, B0);
      body.addColorStop(0.65, B1);
      body.addColorStop(1, B2);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();
      ctx.lineWidth = 1 * dpr;
      ctx.strokeStyle = `rgba(${GOLD},0.35)`;
      ctx.stroke();

      // ---- land dots (bucketed by depth for fewer state changes) ----
      const buckets = 6;
      const paths: Path2D[] = Array.from({ length: buckets }, () => new Path2D());
      const ds = 1.35 * dpr;
      for (let j = 0; j < D.length; j += 3) {
        const x = D[j], y = D[j + 1], z = D[j + 2];
        const x1 = x * cY + z * sY;
        const z1 = -x * sY + z * cY;
        const z2 = y * sP + z1 * cP;
        if (z2 <= 0.02) continue;
        const y2 = y * cP - z1 * sP;
        const b = Math.min(buckets - 1, Math.floor(z2 * buckets));
        paths[b].rect(cx + x1 * R - ds / 2, cy - y2 * R - ds / 2, ds, ds);
      }
      for (let b = 0; b < buckets; b++) {
        ctx.fillStyle = `rgba(${SOFT},${0.16 + (b / (buckets - 1)) * 0.62})`;
        ctx.fill(paths[b]);
      }

      // ---- arcs from headquarters ----
      const locs = s.locs;
      const hq = locs.find((l) => l.kind === "hq") ?? locs[0];
      const proj = (v: V3, r = 1) => {
        const p = rot(v, cY, sY, cP, sP);
        return { x: cx + p[0] * R * r, y: cy - p[1] * R * r, z: p[2], vis: p[2] > 0 || Math.hypot(p[0], p[1]) * r > 1.0 };
      };
      if (hq) {
        const a = toVec(hq.lat, hq.lng);
        locs.forEach((l, i) => {
          if (l.id === hq.id) return;
          const bv = toVec(l.lat, l.lng);
          const ang = Math.acos(Math.min(1, Math.max(-1, a[0] * bv[0] + a[1] * bv[1] + a[2] * bv[2])));
          const lift = 0.04 + ang * 0.16;
          const N = 56;
          const pts = [];
          for (let k = 0; k <= N; k++) {
            const tt = k / N;
            pts.push(proj(slerp(a, bv, tt), 1 + lift * Math.sin(Math.PI * tt)));
          }
          const active = s.focusId === l.id;
          ctx.lineWidth = (active ? 1.6 : 1) * dpr;
          ctx.strokeStyle = active ? `rgba(${SOFT},0.9)` : `rgba(${GOLD},0.5)`;
          ctx.beginPath();
          let pen = false;
          for (const p of pts) {
            if (p.vis) {
              pen ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
              pen = true;
            } else pen = false;
          }
          ctx.stroke();
          // travelling light
          const phase = reduce ? 0.6 : ((t * 0.22 + i * 0.17) % 1);
          const head = Math.floor(phase * N);
          ctx.lineWidth = 2 * dpr;
          for (let k = Math.max(1, head - 8); k <= head; k++) {
            const p0 = pts[k - 1], p1 = pts[k];
            if (!p0.vis || !p1.vis) continue;
            ctx.strokeStyle = `rgba(${SOFT},${((k - head + 8) / 8) * 0.95})`;
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
          }
        });
      }

      // ---- markers ----
      markers = [];
      ctx.textBaseline = "middle";
      const labels: { l: GlobeLocation; x: number; y: number; fade: number; strong: boolean; prio: number }[] = [];
      for (const l of locs) {
        const p = proj(toVec(l.lat, l.lng));
        if (p.z <= 0.05) continue;
        const fade = Math.min(1, (p.z - 0.05) * 4);
        const isHq = l.kind === "hq";
        const active = s.focusId === l.id;
        markers.push({ id: l.id, x: p.x / dpr, y: p.y / dpr });
        // pulse
        if (isHq || active) {
          const k = reduce ? 0.5 : (t * 0.7) % 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, (5 + k * 16) * dpr, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${SOFT},${(1 - k) * 0.7 * fade})`;
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, (isHq ? 4.5 : active ? 4 : 3) * dpr, 0, Math.PI * 2);
        if (l.kind === "market" && !active) {
          ctx.fillStyle = `rgba(${INK},${fade})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(${SOFT},${fade})`;
          ctx.lineWidth = 1.2 * dpr;
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${SOFT},${fade})`;
          ctx.fill();
        }
        if (showLabels && fade > 0.3) labels.push({ l, x: p.x, y: p.y, fade, strong: isHq || active, prio: active ? 0 : isHq ? 1 : 2 });
      }

      // ---- labels with simple collision avoidance ----
      if (labels.length) {
        ctx.font = `600 ${10.5 * dpr}px Manrope, system-ui, sans-serif`;
        try { (ctx as any).letterSpacing = `${1.6 * dpr}px`; } catch {}
        const placed: { x: number; y: number; w: number; h: number }[] = [];
        const hit = (a: { x: number; y: number; w: number; h: number }) =>
          placed.some((b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y);
        labels.sort((a, b) => a.prio - b.prio);
        for (const lb of labels) {
          const text = lb.l.city.toUpperCase();
          const w = ctx.measureText(text).width + 14 * dpr, h = 20 * dpr;
          const g = 10 * dpr;
          const cands = [
            { x: lb.x + g, y: lb.y - g - h },
            { x: lb.x + g, y: lb.y + g },
            { x: lb.x - g - w, y: lb.y - g - h },
            { x: lb.x - g - w, y: lb.y + g },
            { x: lb.x + g + 4 * dpr, y: lb.y - h / 2 },
            { x: lb.x - g - w - 4 * dpr, y: lb.y - h / 2 },
          ];
          const box = cands.map((c) => ({ ...c, w, h })).find((c) => !hit(c));
          if (!box) continue;
          placed.push(box);
          ctx.fillStyle = lb.strong ? `rgba(${GOLD},${0.95 * lb.fade})` : `rgba(${INK},${0.8 * lb.fade})`;
          ctx.fillRect(box.x, box.y, box.w, box.h);
          if (!lb.strong) {
            ctx.strokeStyle = `rgba(${GOLD},${0.35 * lb.fade})`;
            ctx.lineWidth = 1 * dpr;
            ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w - 1, box.h - 1);
          }
          ctx.fillStyle = lb.strong ? `rgba(${INK},${lb.fade})` : `rgba(${SOFT},${lb.fade})`;
          ctx.fillText(text, box.x + 7 * dpr, box.y + h / 2 + 0.5 * dpr);
        }
        try { (ctx as any).letterSpacing = "0px"; } catch {}
      }
    };

    // ---- interaction ----
    let px = 0, py = 0, moved = 0;
    const down = (e: PointerEvent) => {
      s.dragging = true;
      s.target = null;
      px = e.clientX;
      py = e.clientY;
      moved = 0;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!s.dragging) return;
      const k = 1 / ((R / dpr) || 200);
      const dx = (e.clientX - px) * k, dy = (e.clientY - py) * k;
      moved += Math.abs(e.clientX - px) + Math.abs(e.clientY - py);
      s.yaw += dx;
      s.pitch += dy;
      s.vy = dx;
      s.vp = dy;
      px = e.clientX;
      py = e.clientY;
      s.lastInteract = performance.now();
    };
    const up = (e: PointerEvent) => {
      s.dragging = false;
      s.lastInteract = performance.now();
      if (moved < 5 && s.onSelect) {
        const r = canvas.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const hit = markers.find((m) => Math.hypot(m.x - x, m.y - y) < 16);
        if (hit) s.onSelect(hit.id);
      }
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      last = performance.now();
    });
    io.observe(canvas);
    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLabels]);

  return (
    <div className="globe-wrap">
      <span className="ring" aria-hidden />
      <span className="ring r2" aria-hidden />
      <canvas ref={canvasRef} role="img" aria-label={ariaLabel || `Globe showing ${locations.map((l) => l.city).join(", ")}`} />
    </div>
  );
}
