import { getPageSchema } from "./content-schema";

export type SectionStyle = {
  hidden?: boolean;
  theme?: string;
  bgImage?: string;
  overlay?: string | number;
  align?: string;
  padTop?: string | number;
  padBottom?: string | number;
  padTopMobile?: string | number;
  padBottomMobile?: string | number;
  headingSize?: string | number;
  headingSizeMobile?: string | number;
  minHeight?: string | number;
};


export type Layout = { order?: string[]; sections?: Record<string, SectionStyle> };

/** Visual (re-orderable) section keys of a page in their current order. */
export function sectionOrder(pageKey: string, layout?: Layout): string[] {
  const schema = getPageSchema(pageKey);
  if (!schema) return [];
  const keys = schema.sections.filter((s) => !s.fixed).map((s) => s.key);
  const saved = (layout?.order || []).filter((k) => keys.includes(k));
  return [...saved, ...keys.filter((k) => !saved.includes(k))];
}

const num = (v: unknown) => {
  const n = Number(v);
  return v !== "" && v != null && Number.isFinite(n) ? n : null;
};

/** Converts a section's style settings to data-attributes + CSS variables for the wrapper. */
export function styleAttrs(st: SectionStyle = {}) {
  const attrs: Record<string, string> = {};
  const vars: Record<string, string> = {};
  const px = (name: string, attr: string, v: unknown) => {
    const n = num(v);
    if (n !== null) {
      vars[name] = `${Math.max(0, Math.min(n, 2000))}px`;
      attrs[attr] = "";
    }
  };
  px("--pt", "data-pt", st.padTop);
  px("--pb", "data-pb", st.padBottom);
  px("--ptm", "data-ptm", st.padTopMobile);
  px("--pbm", "data-pbm", st.padBottomMobile);
  px("--hs", "data-hs", st.headingSize);
  px("--hsm", "data-hsm", st.headingSizeMobile);
  px("--mh", "data-mh", st.minHeight);
  if (st.theme) {
    attrs["data-theme"] = st.theme;
    attrs["data-tone"] = st.theme === "dark" || st.theme === "image" ? "dark" : st.theme === "accent" ? "accent" : "light";
    if (st.theme === "image" && st.bgImage) {
      vars["--bgimg"] = `url("${String(st.bgImage).replace(/["\\\n]/g, "")}")`;
      const o = num(st.overlay);
      vars["--ov"] = String((o === null ? 70 : Math.max(0, Math.min(o, 100))) / 100);
    }
  }
  if (st.align === "center" || st.align === "left") attrs["data-align"] = st.align;
  return { attrs, vars };
}
