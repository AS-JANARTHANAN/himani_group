"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SECTION_STYLE_FIELDS, settingsViewFor, type Field, type Section } from "@/lib/content-schema";
import { ICONS, ICON_OPTIONS } from "@/lib/icons";
import { PRESETS } from "@/lib/themes";
import { MediaPicker } from "./MediaPicker";

type Obj = Record<string, any>;
type SaveFn = (json: string) => Promise<{ ok: boolean; error?: string; id?: string }>;
type DraftFn = (json: string) => Promise<unknown>;
type Notice = { text: string; href?: string; link?: string } | null;

const Svg = ({ name, size = 22 }: { name: string; size?: number }) =>
  ICONS[name] ? (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={ICONS[name].d} />
    </svg>
  ) : null;

/* ------------------------------------------------------------------ fields */

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="img-field">
      <div className="img-prev" onClick={() => setOpen(true)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setOpen(true)}>
        {value ? <img src={value} alt="" /> : <span className="add-photo"><Svg name="image" size={28} />Add a photo</span>}
      </div>
      <div className="img-actions">
        <button suppressHydrationWarning type="button" className="a-btn" onClick={() => setOpen(true)}>
          {value ? "Change photo" : "Choose photo"}
        </button>
        {value ? (
          <button suppressHydrationWarning type="button" className="a-link danger" onClick={() => onChange("")}>
            Remove photo
          </button>
        ) : null}
        <details className="img-url">
          <summary>Use a web address instead</summary>
          <input suppressHydrationWarning className="a-input small" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="/uploads/… or https://…" aria-label="Image address" />
        </details>
      </div>
      {open ? (
        <MediaPicker
          onClose={() => setOpen(false)}
          onPick={(u) => {
            onChange(u);
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

function IconField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const cur = value ? ICONS[value] : null;
  const list = ICON_OPTIONS.filter((o) => !q || o.label.toLowerCase().includes(q.toLowerCase()) || o.value.includes(q.toLowerCase()));
  return (
    <div className="icon-field">
      <button suppressHydrationWarning type="button" className="icon-current" onClick={(e) => (e.preventDefault(), setOpen(!open))} aria-expanded={open}>
        <span className="ico-box">{cur ? <Svg name={value} size={26} /> : <span className="none">–</span>}</span>
        <span>{cur ? cur.label : "No icon"}</span>
        <span className="pick-btn">
          <Svg name={open ? "close" : "palette"} size={15} /> {open ? "Close" : "Change icon"}
        </span>
      </button>
      {open ? (
        <div className="icon-pop">
          <input suppressHydrationWarning
            className="a-input small"
            ref={(el) => el?.focus({ preventScroll: true })}
            placeholder="Search icons… (e.g. truck, phone)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="icon-grid">
            <button suppressHydrationWarning type="button" className={!value ? "on" : ""} onClick={() => (onChange(""), setOpen(false))} title="No icon">
              <span className="none"><Svg name="close" size={20} /></span>
              <small>No icon</small>
            </button>
            {list.map((o) => (
              <button suppressHydrationWarning type="button" key={o.value} className={value === o.value ? "on" : ""} onClick={() => (onChange(o.value), setOpen(false))} title={o.label}>
                <Svg name={o.value} size={24} />
                <small>{o.label}</small>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PresetPicker({ value, onPick }: { value: string; onPick: (key: string) => void }) {
  return (
    <div className="presets">
      {PRESETS.map((p) => (
        <button suppressHydrationWarning type="button" key={p.key} className={`preset ${value === p.key ? "on" : ""}`} onClick={() => onPick(p.key)}>
          <span className="mock" style={{ background: p.colors.paper }}>
            <span className="mock-bar" style={{ background: p.colors.dark }}>
              <i style={{ background: p.colors.accent }} />
            </span>
            <span className="mock-hero" style={{ background: p.colors.dark }}>
              <b style={{ background: "#fff" }} />
              <b style={{ background: p.colors.accentOnDark || p.colors.accent, width: "60%" }} />
              <span className="mock-btn" style={{ background: p.gradient ? `linear-gradient(135deg, #f0d898, ${p.colors.accent} 55%, #8a6a2a)` : p.colors.accent }} />
            </span>
            <span className="mock-row">
              <span style={{ background: p.colors.light }} />
              <span style={{ background: p.colors.light }} />
              <span style={{ background: p.colors.light }} />
            </span>
          </span>
          <span className="swatches">
            {[p.colors.dark, p.colors.accent, p.colors.light, p.colors.text].map((c, i) => (
              <i key={i} style={{ background: c }} />
            ))}
          </span>
          <strong>
            {value === p.key ? <Svg name="check" size={16} /> : null}
            {p.label}
          </strong>
          <small>{p.description}</small>
        </button>
      ))}
    </div>
  );
}

function FieldInput({ f, value, onChange }: { f: Field; value: any; onChange: (v: any) => void }) {
  switch (f.type) {
    case "textarea":
      return <textarea suppressHydrationWarning className="a-input" rows={f.rows || 4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} />;
    case "image":
      return <ImageField value={value ?? ""} onChange={onChange} />;
    case "icon":
      return <IconField value={value ?? ""} onChange={onChange} />;
    case "color":
      return (
        <span className="color-field">
          <input suppressHydrationWarning type="color" value={/^#[0-9a-f]{6}$/i.test(value || "") ? value : "#000000"} onChange={(e) => onChange(e.target.value)} aria-label={f.label} />
          <input suppressHydrationWarning className="a-input" value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="#ffc21a" />
        </span>
      );
    case "toggle":
      return (
        <span className="switch">
          <input suppressHydrationWarning type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          <i />
          <span>{value ? "Yes" : "No"}</span>
        </span>
      );
    case "select":
      return (
        <select suppressHydrationWarning className="a-input" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          {(f.options || []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "number":
      return <input suppressHydrationWarning className="a-input" type="number" step="any" value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} />;
    case "list":
      return <ListField f={f} value={Array.isArray(value) ? value : []} onChange={onChange} />;
    default:
      return <input suppressHydrationWarning className="a-input" type="text" value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} />;
  }
}

/** Simple inputs get a real <label>; composite fields use a div. `path` links the field to the preview. */
function FieldWrap({ f, children, inList, path }: { f: Field; children: React.ReactNode; inList?: boolean; path: string }) {
  const wide = !inList && ["textarea", "list", "image", "icon", "preset"].includes(f.type);
  const cls = `a-field ${wide ? "wide" : ""} ${f.type === "toggle" ? "is-toggle" : ""}`;
  return ["image", "list", "icon", "preset"].includes(f.type) ? (
    <div className={cls} data-path={path}>
      {children}
    </div>
  ) : (
    <label className={cls} data-path={path}>
      {children}
    </label>
  );
}

const itemTitle = (it: Obj) => String(it?.title || it?.label || it?.heading || it?.text || "").slice(0, 48);

function ListField({ f, value, onChange, path = "" }: { f: Field; value: Obj[]; onChange: (v: Obj[]) => void; path?: string }) {
  const set = (i: number, k: string, v: any) => onChange(value.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const n = [...value];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <div className="list-field">
      {value.map((it, i) => (
        <details className="list-item" key={i} open={value.length <= 3} data-index={i}>
          <summary className="list-head">
            <span>
              <b>{i + 1}.</b> {itemTitle(it) || <em>{f.itemLabel || "Item"} {i + 1}</em>}
              {it?.hidden ? <span className="pill off">Hidden</span> : null}
            </span>
            <span className="list-tools" onClick={(e) => e.preventDefault()}>
              <button suppressHydrationWarning type="button" onClick={() => move(i, -1)} disabled={i === 0} title="Move up">
                <Svg name="chevup" size={17} />
              </button>
              <button suppressHydrationWarning type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} title="Move down">
                <Svg name="chevdown" size={17} />
              </button>
              <button suppressHydrationWarning type="button" onClick={() => onChange([...value.slice(0, i + 1), { ...it }, ...value.slice(i + 1)])} title="Make a copy">
                <Svg name="copy" size={16} />
              </button>
              <button suppressHydrationWarning type="button" className="danger" onClick={() => confirm("Delete this item?") && onChange(value.filter((_, j) => j !== i))} title="Delete">
                <Svg name="trash" size={16} />
              </button>
            </span>
          </summary>
          <div className="list-body">
            {(f.fields || []).map((sf) => (
              <FieldWrap key={sf.name} f={sf} inList path={`${path}.${i}.${sf.name}`}>
                <span className="a-label">{sf.label}</span>
                <FieldInput f={sf} value={it?.[sf.name]} onChange={(v) => set(i, sf.name, v)} />
                {sf.help ? <small className="a-help">{sf.help}</small> : null}
              </FieldWrap>
            ))}
          </div>
        </details>
      ))}
      <button suppressHydrationWarning type="button" className="a-btn ghost add" onClick={() => onChange([...value, Object.fromEntries((f.fields || []).map((x) => [x.name, x.type === "toggle" ? false : ""]))])}>
        <Svg name="plus" size={17} /> Add {(f.itemLabel || "item").toLowerCase()}
      </button>
    </div>
  );
}


/** Shows roughly how the page will appear in a Google search result. */
function GooglePreview({ title, description, path }: { title: string; description: string; path?: string }) {
  const [host, setHost] = useState("your-website.ae");
  useEffect(() => setHost(window.location.host), []);
  const cut = (t: string, n: number) => (t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t);
  return (
    <div className="gprev">
      <div className="gprev-label">
        <Svg name="google" size={16} /> How it looks in Google
      </div>
      <div className="gprev-url">
        {host}
        {path && path !== "/" ? path.split("/").filter(Boolean).map((p) => ` › ${p}`) : ""}
      </div>
      <div className="gprev-title">{cut(title || "Add a title above", 62)}</div>
      <div className="gprev-desc">{cut(description || "Add a description above. Google shows about 155 letters.", 158)}</div>
    </div>
  );
}

function Counter({ n, lo, hi }: { n: number; lo: number; hi: number }) {
  const cls = n === 0 ? "" : n < lo ? "short" : n > hi ? "long" : "good";
  const msg = n === 0 ? "" : n < lo ? "a bit short" : n > hi ? "too long, Google will cut it" : "good length";
  return (
    <small className={`counter ${cls}`}>
      {n} letters{msg ? ` · ${msg}` : ""}
    </small>
  );
}

/* ------------------------------------------------------------------ preview (click-to-edit) */

const DEVICES: { key: "desktop" | "tablet" | "mobile"; label: string; icon: string; w: number }[] = [
  { key: "desktop", label: "Computer", icon: "monitor", w: 1440 },
  { key: "tablet", label: "Tablet", icon: "tablet", w: 820 },
  { key: "mobile", label: "Phone", icon: "smartphone", w: 390 },
];

const BRIDGE_CSS = `
[data-edit]{cursor:pointer}
.__hov{outline:2px dashed #2563eb!important;outline-offset:4px;border-radius:2px}
.__hl{outline:4px solid #f97316!important;outline-offset:5px;border-radius:3px;animation:__p 1.2s ease 2}
@keyframes __p{50%{outline-color:#fdba74}}
#__tip{position:fixed;z-index:99999;pointer-events:none;background:#2563eb;color:#fff;font:600 13px/1 system-ui,sans-serif;padding:7px 10px;border-radius:6px;box-shadow:0 6px 16px rgba(0,0,0,.25);display:none;white-space:nowrap}
.reveal{opacity:1!important;transform:none!important;transition:none!important}.reveal-img{clip-path:none!important;transition:none!important}.lines>span>span{animation:none!important;transform:none!important}.hero-home .photo img,.page-hero .bg img{animation:none!important;transform:none!important}html{scroll-behavior:auto!important}
`;

function findTarget(doc: Document, key: string): Element | null {
  const parts = key.split(".");
  while (parts.length) {
    const k = parts.join(".");
    const el = doc.querySelector(`[data-edit="${CSS.escape(k)}"]`) || doc.querySelector(`[data-edit^="${CSS.escape(k)}."]`);
    if (el) return el;
    parts.pop();
  }
  return null;
}

function Preview({ src, reloadKey, onPick, highlight }: { src: string; reloadKey: number; onPick: (key: string) => void; highlight: { key: string; n: number; scroll?: boolean } | null }) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(1);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;
  const w = DEVICES.find((d) => d.key === device)!.w;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, (el.clientWidth - 24) / w));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);

  // Wire up the page inside the iframe: hover outlines, click-to-edit, no navigation.
  const wire = useCallback(() => {
    const doc = frame.current?.contentDocument;
    if (!doc || (doc as any).__wired) return;
    (doc as any).__wired = true;
    const st = doc.createElement("style");
    st.textContent = BRIDGE_CSS;
    doc.head.appendChild(st);
    const tip = doc.createElement("div");
    tip.id = "__tip";
    tip.textContent = "Click to edit";
    doc.body.appendChild(tip);
    let hov: Element | null = null;
    doc.addEventListener("mouseover", (e) => {
      const el = (e.target as Element).closest?.("[data-edit]") || null;
      if (hov && hov !== el) hov.classList.remove("__hov");
      hov = el;
      if (el) el.classList.add("__hov");
      tip.style.display = el ? "block" : "none";
    });
    doc.addEventListener("mousemove", (e) => {
      tip.style.left = e.clientX + 14 + "px";
      tip.style.top = e.clientY + 16 + "px";
    });
    doc.addEventListener("mouseleave", () => (tip.style.display = "none"));
    doc.addEventListener(
      "click",
      (e) => {
        const t = e.target as Element;
        const el = t.closest?.("[data-edit]");
        if (el || t.closest?.("a")) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (el) pickRef.current(el.getAttribute("data-edit") || "");
      },
      true
    );
    doc.addEventListener("submit", (e) => e.preventDefault(), true);
  }, []);

  useEffect(() => {
    const f = frame.current;
    if (!f) return;
    const on = () => wire();
    f.addEventListener("load", on);
    on();
    return () => f.removeEventListener("load", on);
  }, [wire]);

  useEffect(() => {
    if (!reloadKey) return;
    const f = frame.current;
    const w = f?.contentWindow as (Window & { next?: { router?: { refresh?: () => void } } }) | null | undefined;
    try {
      if (w?.next?.router?.refresh) {
        w.next.router.refresh();
        return;
      }
      const y = w?.scrollY || 0;
      const restore = () => {
        try {
          const win = f?.contentWindow;
          if (win) {
            win.document.documentElement.style.scrollBehavior = "auto";
            win.scrollTo(0, y);
            setTimeout(() => win.scrollTo(0, y), 400);
          }
        } catch {}
        f?.removeEventListener("load", restore);
      };
      f?.addEventListener("load", restore);
      w?.location.reload();
    } catch {}
  }, [reloadKey]);

  // Field focused in the form → show where it is on the page.
  useEffect(() => {
    if (!highlight) return;
    const doc = frame.current?.contentDocument;
    if (!doc) return;
    let el: Element | null = null;
    if (highlight.key.startsWith("section:")) {
      const shell = doc.querySelector(`[data-section="${CSS.escape(highlight.key.slice(8))}"]`);
      el = shell?.firstElementChild || null;
    } else el = findTarget(doc, highlight.key);
    if (!el) return;
    const vis = el.getBoundingClientRect();
    const onScreen = vis.bottom > 0 && vis.top < (doc.defaultView?.innerHeight || 0);
    if (!highlight.scroll && !onScreen) return;
    doc.querySelectorAll(".__hl").forEach((x) => x.classList.remove("__hl"));
    // Scroll only the preview's own window (scrollIntoView would also scroll the admin page).
    const win = doc.defaultView;
    if (win && highlight.scroll) {
      const r = el.getBoundingClientRect();
      win.scrollTo({ top: Math.max(0, r.top + win.scrollY - win.innerHeight / 2 + Math.min(r.height, win.innerHeight) / 2), behavior: "smooth" });
    }
    el.classList.add("__hl");
    const t = setTimeout(() => el?.classList.remove("__hl"), 2600);
    return () => clearTimeout(t);
  }, [highlight]);

  return (
    <div className="preview">
      <div className="preview-bar">
        <span className="dot-live" /> Live preview
        <span className="preview-tip"><Svg name="hand" size={14} /> Click anything to edit it</span>
        <div className="seg">
          {DEVICES.map((d) => (
            <button suppressHydrationWarning type="button" key={d.key} className={device === d.key ? "on" : ""} onClick={() => setDevice(d.key)}>
              <Svg name={d.icon} size={15} /> {d.label}
            </button>
          ))}
        </div>
      </div>
      <div className="preview-box" ref={box}>
        <div className="preview-scale" style={{ width: w, height: `${100 / scale}%`, transform: `scale(${scale})` }}>
          <iframe ref={frame} src={src} title="Website preview" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ form */

export default function SchemaForm({
  sections,
  initial,
  save,
  saveDraft,
  previewHref,
  previewSrc,
  layout = false,
  redirectTo,
  submitLabel = "Save changes",
  contentKey,
}: {
  sections: Section[];
  initial: Obj;
  save: SaveFn;
  /** When given, edits are pushed to a draft and the preview updates before publishing. */
  saveDraft?: DraftFn;
  previewHref?: string;
  /** Iframe URL for the side-by-side preview. */
  previewSrc?: string;
  /** Enables show/hide, ordering and design controls per section. */
  layout?: boolean;
  redirectTo?: string;
  submitLabel?: string;
  /** Content document being edited ("home", "settings"…): links preview clicks to fields. */
  contentKey?: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<Obj>(initial);
  const [saved, setSaved] = useState<Obj>(initial);
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "ok" | "err"; msg?: string }>({ kind: "idle" });
  const [showPreview, setShowPreview] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [openDesign, setOpenDesign] = useState<string | null>(null);
  const [closed, setClosed] = useState<Record<string, boolean>>(() => Object.fromEntries(sections.filter((s) => s.advanced).map((s) => [s.key, true])));
  const [adv, setAdv] = useState<Record<string, boolean>>({});
  const [highlight, setHighlight] = useState<{ key: string; n: number; scroll?: boolean } | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const dirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(saved), [data, saved]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSettings = contentKey === "settings";
  const editPrefix = isSettings ? "settings:" : "";

  useEffect(() => {
    if (previewSrc && window.innerWidth >= 1100) setShowPreview(true);
  }, [previewSrc]);

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  // push drafts for the live preview (debounced)
  // Leaving the editor (menu, back button, closing the tab) throws away unsaved preview edits,
  // so the public site never shows half-finished changes in this browser.
  useEffect(() => {
    if (!saveDraft || !contentKey) return;
    const clear = () => {
      if (timer.current) clearTimeout(timer.current);
      fetch(`/api/admin/draft?key=${encodeURIComponent(contentKey)}`, { method: "POST", keepalive: true }).catch(() => {});
    };
    window.addEventListener("pagehide", clear);
    return () => {
      window.removeEventListener("pagehide", clear);
      clear();
    };
  }, [saveDraft, contentKey]);

  // The preview always shows exactly what is in the form, even after undoing a change by hand.
  const lastDraft = useRef(JSON.stringify(initial));
  useEffect(() => {
    if (!saveDraft) return;
    const json = JSON.stringify(data);
    if (json === lastDraft.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      lastDraft.current = json;
      await saveDraft(json);
      setReloadKey((k) => k + 1);
    }, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [data, saveDraft]);

  const visual = sections.filter((s) => !s.fixed && layout);
  const fixedTop = sections.filter((s) => (s.fixed || !layout) && !s.advanced);
  const advancedSecs = sections.filter((s) => s.advanced);
  const visualKeys = visual.map((s) => s.key).join(",");
  const order: string[] = useMemo(() => {
    const keys = visualKeys ? visualKeys.split(",") : [];
    const savedOrder = ((data._layout?.order as string[]) || []).filter((k) => keys.includes(k));
    return [...savedOrder, ...keys.filter((k) => !savedOrder.includes(k))];
  }, [data._layout?.order, visualKeys]);
  const ordered = [...order.map((k) => visual.find((s) => s.key === k)!), ...fixedTop, ...advancedSecs];

  const set = (sec: string, name: string, v: any) => {
    setData((d) => ({ ...d, [sec]: { ...(d[sec] || {}), [name]: v } }));
    if (status.kind === "ok" || status.kind === "err") setStatus({ kind: "idle" });
  };
  const style = (key: string) => (data._layout?.sections?.[key] || {}) as Obj;
  const setStyle = (key: string, name: string, v: any) =>
    setData((d) => {
      const l = d._layout || {};
      return { ...d, _layout: { ...l, order, sections: { ...(l.sections || {}), [key]: { ...(l.sections?.[key] || {}), [name]: v } } } };
    });
  const resetStyle = (key: string) =>
    setData((d) => {
      const l = d._layout || {};
      const hidden = l.sections?.[key]?.hidden;
      return { ...d, _layout: { ...l, order, sections: { ...(l.sections || {}), [key]: hidden ? { hidden } : {} } } };
    });
  const move = (key: string, dir: number) => {
    const i = order.indexOf(key);
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const n = [...order];
    [n[i], n[j]] = [n[j], n[i]];
    setData((d) => ({ ...d, _layout: { ...(d._layout || {}), order: n } }));
  };
  const applyPreset = (key: string) => {
    const p = PRESETS.find((x) => x.key === key);
    if (!p) return;
    setData((d) => ({ ...d, theme: { ...(d.theme || {}), ...p.colors, accentOnDark: p.colors.accentOnDark || p.colors.accent, deep: p.colors.deep || "", card: p.colors.card || "", gradient: !!p.gradient, font: p.font, preset: key } }));
  };

  /* ---- click in preview → jump to the field ---- */
  const focusPath = useCallback(
    (path: string) => {
      const [secKey, fieldName] = path.split(".");
      const sec = sections.find((s) => s.key === secKey);
      if (!sec) return false;
      const field = sec.fields.find((f) => f.name === fieldName);
      setClosed((c) => ({ ...c, [secKey]: false }));
      if (field?.advanced) setAdv((a) => ({ ...a, [secKey]: true }));
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const root = formRef.current;
          if (!root) return;
          const parts = path.split(".");
          let el: HTMLElement | null = null;
          while (parts.length && !el) {
            el = root.querySelector(`[data-path="${CSS.escape(parts.join("."))}"]`);
            if (!el) {
              // list item: "hero.highlights.2" → the 3rd item of that list
              const idx = Number(parts[parts.length - 1]);
              if (Number.isInteger(idx) && parts.length > 2) {
                const list = root.querySelector(`[data-path="${CSS.escape(parts.slice(0, -1).join("."))}"]`);
                el = (list?.querySelector(`.list-item[data-index="${idx}"]`) as HTMLElement) || null;
              }
            }
            if (!el) parts.pop();
          }
          if (!el) el = root.querySelector(`#sec-${CSS.escape(secKey)}`);
          if (!el) return;
          if (el instanceof HTMLDetailsElement) el.open = true;
          el.closest("details")?.setAttribute("open", "");
          el.scrollIntoView({ block: "center", behavior: "smooth" });
          el.classList.remove("flash");
          void el.offsetWidth;
          el.classList.add("flash");
          const input = el.querySelector<HTMLElement>("input:not([type=checkbox]):not([type=color]), textarea, select, button");
          setTimeout(() => input?.focus({ preventScroll: true }), 450);
        })
      );
      return true;
    },
    [sections]
  );

  const onPick = useCallback(
    (key: string) => {
      setNotice(null);
      // Service / extra-page editors (no content document): map preview keys to their own boxes.
      if (!contentKey) {
        const map: Record<string, string> = { "hero.title": "main.title", "hero.eyebrow": "main.eyebrow", "hero.text": "main.intro", "hero.image": "main.heroImage" };
        if (key.startsWith("vertical:") || key.startsWith("location:")) return void focusPath("main.title");
        if (map[key]) return void focusPath(map[key]);
      }
      if (key.startsWith("vertical:")) {
        setNotice({ text: "This is one of your services. Services are edited on their own screen.", href: `/admin/verticals/${key.slice(9)}`, link: "Edit this service →" });
        return;
      }
      if (key.startsWith("location:")) {
        setNotice({ text: "This is a location on the globe.", href: `/admin/locations/${key.slice(9)}`, link: "Edit this location →" });
        return;
      }
      if (key.startsWith("settings:")) {
        const path = key.slice(9);
        if (isSettings && focusPath(path)) return;
        const view = settingsViewFor(path.split(".")[0]);
        if (view) setNotice({ text: `This part is the same on every page. It is edited in "${view.label}".`, href: `/admin/pages/${view.slug}`, link: `Open ${view.label} →` });
        return;
      }
      if (isSettings) return;
      if (!focusPath(key)) setNotice({ text: "This part is filled in automatically and cannot be edited here." });
    },
    [contentKey, focusPath, isSettings]
  );

  // Field focused → highlight on the page
  const onFocusCapture = (e: React.FocusEvent) => {
    const t = e.target as HTMLElement;
    if (!t.matches("input[type=text], input:not([type]), textarea, select")) return;
    const wrap = t.closest<HTMLElement>("[data-path]");
    if (!wrap) return;
    setHighlight({ key: editPrefix + wrap.dataset.path, n: Date.now() });
  };

  const submit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setStatus({ kind: "saving" });
      try {
        const r = await save(JSON.stringify(data));
        if (!r.ok) return setStatus({ kind: "err", msg: r.error || "Could not save" });
        setSaved(data);
        setStatus({ kind: "ok", msg: "Saved. The website is updated." });
        setReloadKey((k) => k + 1);
        if (redirectTo && r.id) router.push(redirectTo.replace("{id}", r.id));
        else router.refresh();
      } catch (err: any) {
        setStatus({ kind: "err", msg: err?.message || "Could not save" });
      }
    },
    [data, redirectTo, router, save]
  );

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        submit();
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [submit]);

  const discard = () => {
    if (!confirm("Undo all changes since the last save?")) return;
    setData(saved);
  };

  const renderField = (s: Section, f: Field) => {
    const path = `${s.key}.${f.name}`;
    return (
      <FieldWrap key={f.name} f={f} path={path}>
        {f.type === "preset" ? null : <span className="a-label">{f.label}</span>}
        {f.type === "preset" ? (
          <PresetPicker value={data?.[s.key]?.preset || ""} onPick={applyPreset} />
        ) : f.type === "list" ? (
          <ListField f={f} value={Array.isArray(data?.[s.key]?.[f.name]) ? data[s.key][f.name] : []} onChange={(v) => set(s.key, f.name, v)} path={path} />
        ) : (
          <FieldInput f={f} value={data?.[s.key]?.[f.name]} onChange={(v) => set(s.key, f.name, v)} />
        )}
        {f.help ? <small className="a-help">{f.help}</small> : null}
        {s.key === "seo" && (f.name === "title" || f.name === "description") ? (
          <Counter n={String(data?.[s.key]?.[f.name] || "").length} lo={f.name === "title" ? 30 : 110} hi={f.name === "title" ? 62 : 162} />
        ) : null}
      </FieldWrap>
    );
  };

  return (
    <form ref={formRef} onSubmit={submit} onFocusCapture={onFocusCapture} className={`editor ${showPreview && previewSrc ? "with-preview" : ""}`}>
      <div className="editor-main">
        {previewSrc ? (
          <div className="howto">
            <b>How to edit:</b> click any text or photo in the preview {showPreview ? "on the right" : ""} and its box opens here. Type your change, see it in the preview, then press <b>{submitLabel}</b>.
          </div>
        ) : null}
        {notice ? (
          <div className="notice">
            <span>{notice.text}</span>
            {notice.href ? (
              <Link href={notice.href} className="a-btn small">
                {notice.link}
              </Link>
            ) : null}
            <button suppressHydrationWarning type="button" className="a-link" onClick={() => setNotice(null)} aria-label="Close">
              <Svg name="close" size={18} />
            </button>
          </div>
        ) : null}
        {ordered.length > 2 ? (
          <nav className="sec-jump" aria-label="Sections">
            {ordered.map((s) => (
              <a
                key={s.key}
                href={`#sec-${s.key}`}
                className={style(s.key).hidden ? "off" : ""}
                onClick={() => {
                  setClosed((c) => ({ ...c, [s.key]: false }));
                  setHighlight({ key: `section:${s.key}`, n: Date.now(), scroll: true });
                }}
              >
                {s.icon ? <Svg name={s.icon} size={15} /> : null}
                {s.label}
              </a>
            ))}
          </nav>
        ) : null}
        {ordered.map((s) => {
          const isVisual = !s.fixed && layout;
          const st = style(s.key);
          const idx = order.indexOf(s.key);
          const isClosed = !!closed[s.key];
          const basic = s.fields.filter((f) => !f.advanced);
          const more = s.fields.filter((f) => f.advanced);
          return (
            <section className={`a-card sec ${st.hidden ? "is-hidden" : ""} ${isClosed ? "is-closed" : ""}`} id={`sec-${s.key}`} key={s.key}>
              <div className="a-card-head">
                <button suppressHydrationWarning type="button" className="sec-title" onClick={() => setClosed((c) => ({ ...c, [s.key]: !isClosed }))} aria-expanded={!isClosed}>
                  <span className="chev"><Svg name={isClosed ? "arrow" : "chevdown"} size={16} /></span>
                  {s.icon ? <span className="sec-ico"><Svg name={s.icon} size={22} /></span> : null}
                  <span>
                    <h2>
                      {isVisual ? <span className="sec-no">{idx + 1}</span> : null}
                      {s.label}
                      {st.hidden ? <span className="pill off">Hidden on website</span> : null}
                    </h2>
                    {s.description ? <p>{s.description}</p> : null}
                  </span>
                </button>
                <div className="sec-tools">
                  {previewSrc && showPreview && isVisual ? (
                    <button suppressHydrationWarning type="button" className="a-btn ghost small" onClick={() => setHighlight({ key: `section:${s.key}`, n: Date.now(), scroll: true })} title="Scroll the preview to this part">
                      <Svg name="eye" size={16} /> Show me
                    </button>
                  ) : null}
                  {isVisual ? (
                    <>
                      <label className="switch" title={st.hidden ? "Show this part on the website" : "Hide this part from the website"}>
                        <input suppressHydrationWarning type="checkbox" checked={!st.hidden} onChange={(e) => setStyle(s.key, "hidden", !e.target.checked)} />
                        <i />
                        <span>{st.hidden ? "Hidden" : "Shown"}</span>
                      </label>
                      <button suppressHydrationWarning type="button" className="icon-btn" onClick={() => move(s.key, -1)} disabled={idx === 0} title="Move this part up the page">
                        <Svg name="chevup" size={18} />
                      </button>
                      <button suppressHydrationWarning type="button" className="icon-btn" onClick={() => move(s.key, 1)} disabled={idx === order.length - 1} title="Move this part down the page">
                        <Svg name="chevdown" size={18} />
                      </button>
                      <button suppressHydrationWarning type="button" className={`a-btn ghost small ${openDesign === s.key ? "active" : ""}`} onClick={() => setOpenDesign(openDesign === s.key ? null : s.key)}>
                        <Svg name="palette" size={16} /> Look
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
              {!isClosed ? (
                <>
                  {isVisual && openDesign === s.key ? (
                    <div className="design-panel">
                      <div className="design-head">
                        <strong>How this part looks</strong>
                        <button suppressHydrationWarning type="button" className="a-link" onClick={() => resetStyle(s.key)}>
                          Reset to normal
                        </button>
                      </div>
                      <div className="a-grid three">
                        {SECTION_STYLE_FIELDS.filter((f) => (!["bgImage", "overlay"].includes(f.name) || st.theme === "image") && (!f.advanced || adv[`d:${s.key}`])).map((f) => (
                          <FieldWrap key={f.name} f={f} path={`_style.${s.key}.${f.name}`}>
                            <span className="a-label">{f.label}</span>
                            <FieldInput f={f} value={st[f.name]} onChange={(v) => setStyle(s.key, f.name, v)} />
                            {f.help ? <small className="a-help">{f.help}</small> : null}
                          </FieldWrap>
                        ))}
                      </div>
                      <button suppressHydrationWarning type="button" className="a-btn ghost small more" onClick={() => setAdv((a) => ({ ...a, [`d:${s.key}`]: !a[`d:${s.key}`] }))}>
                        <Svg name={adv[`d:${s.key}`] ? "chevup" : "plus"} size={15} /> {adv[`d:${s.key}`] ? "Fewer options" : "Spacing & size options"}
                      </button>
                    </div>
                  ) : null}
                  <div className="a-grid">{basic.map((f) => renderField(s, f))}</div>
                  {s.key === "seo" ? <GooglePreview title={data?.seo?.title || ""} description={data?.seo?.description || ""} path={previewHref} /> : null}
                  {more.length ? (
                    <div className="more-box">
                      <button suppressHydrationWarning type="button" className="a-btn ghost small more" onClick={() => setAdv((a) => ({ ...a, [s.key]: !a[s.key] }))}>
                        <Svg name={adv[s.key] ? "chevup" : "plus"} size={15} /> {adv[s.key] ? "Hide extra options" : `More options (${more.length})`}
                      </button>
                      {adv[s.key] ? <div className="a-grid">{more.map((f) => renderField(s, f))}</div> : null}
                    </div>
                  ) : null}
                </>
              ) : null}
            </section>
          );
        })}
      </div>

      {showPreview && previewSrc ? <Preview src={previewSrc} reloadKey={reloadKey} onPick={onPick} highlight={highlight} /> : null}

      <div className="save-bar">
        <span className={`save-status ${status.kind} ${dirty && status.kind === "idle" ? "dirty" : ""}`}>
          <Svg name={status.kind === "err" ? "info" : dirty && status.kind === "idle" ? "clock" : "check"} size={17} />
          {status.kind === "saving"
            ? "Saving…"
            : status.msg || (dirty ? (saveDraft ? "You have changes. Visitors see them after you press " + submitLabel + "." : "You have unsaved changes.") : "Everything is saved")}
        </span>
        <div className="save-actions">
          {previewSrc ? (
            <button suppressHydrationWarning type="button" className="a-btn ghost" onClick={() => setShowPreview(!showPreview)}>
              <Svg name="eye" size={16} /> {showPreview ? "Hide preview" : "Show preview"}
            </button>
          ) : null}
          {previewHref ? (
            <a className="a-btn ghost hide-sm" href={previewHref} target="_blank" rel="noreferrer">
              <Svg name="external" size={16} /> Open website
            </a>
          ) : null}
          {dirty ? (
            <button suppressHydrationWarning type="button" className="a-btn ghost" onClick={discard}>
              <Svg name="undo" size={16} /> Undo changes
            </button>
          ) : null}
          <button suppressHydrationWarning className="a-btn primary big" disabled={status.kind === "saving" || (!dirty && !redirectTo)}>
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
