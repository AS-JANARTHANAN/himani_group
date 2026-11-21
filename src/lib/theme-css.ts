import { DEFAULT_PRESET, FONT_OPTIONS } from "./themes";

const hex = (v: unknown, d: string) => (typeof v === "string" && /^#[0-9a-f]{3,8}$/i.test(v) ? v : d);
const num = (v: unknown, d: number, lo: number, hi: number) => {
  const x = Number(v);
  return v !== "" && v != null && Number.isFinite(x) ? Math.min(hi, Math.max(lo, x)) : d;
};

export const themeFont = (t: any) => (FONT_OPTIONS.some((f) => f.value === t?.font) ? t.font : DEFAULT_PRESET.font);

/** Turns the "Colours & fonts" settings into CSS variables for the public site. */
export function themeCss(t: any = {}) {
  const d = DEFAULT_PRESET.colors;
  const dark = hex(t.dark, d.dark);
  const accent = hex(t.accent, d.accent);
  const text = hex(t.text, d.text);
  const onDark = hex(t.accentOnDark, accent);
  // Optional shiny gold: light → base → deep version of the highlight colour
  const fill = t.gradient
    ? `linear-gradient(135deg, color-mix(in srgb, ${accent} 45%, #fff2c0), ${accent} 55%, color-mix(in srgb, ${accent} 85%, #000))`
    : accent;
  const deep = hex(t.deep, dark);
  const card = hex(t.card, "");
  return `:root{--dark:${dark};--deep:${deep};${card ? `--card:${card};` : ""}--accent:${accent};--accent-fill:${fill};--accent-on-dark:${onDark};--on-accent:${hex(t.onAccent, d.onAccent)};--accent-text:${hex(t.accentText, d.accentText)};--light:${hex(
    t.light,
    d.light
  )};--paper:${hex(t.paper, d.paper)};--text:${text};--base:${num(t.baseSize, 16, 12, 22)}px;--hscale:${num(t.headingScale, 100, 60, 160) / 100}}${t.gradient ? shiny(onDark, accent) : ""}`;
}

/** Extra polish for the "shiny gradient" option: gold-gradient headline words and gold outline buttons on dark backgrounds. */
function shiny(onDark: string, accent: string) {
  const grad = `linear-gradient(180deg, color-mix(in srgb, ${onDark} 70%, #fff8e0) 0%, ${onDark} 45%, color-mix(in srgb, ${accent} 85%, #000) 100%)`;
  return (
    `:is(.hero-home,.page-hero,.vision-band,.on-dark,.presence-hero) .accent{background:${grad};-webkit-background-clip:text;background-clip:text;color:transparent}` +
    `.btn.outline{color:${onDark};border-color:color-mix(in srgb, ${onDark} 75%, transparent)}.btn.outline:hover{background:${onDark};color:var(--dark);border-color:${onDark}}`
  );
}
