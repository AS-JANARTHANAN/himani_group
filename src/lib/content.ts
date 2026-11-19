import "server-only";
import { draftMode } from "next/headers";
import { cache } from "react";
import { db } from "./db";
import { contentDefaults } from "./content-defaults";

type Obj = Record<string, any>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);

/** Fill any missing keys in stored content from the defaults, so new fields never break a page. */
export function mergeDefaults(def: any, val: any): any {
  if (isObj(def)) {
    const out: Obj = {};
    const src = isObj(val) ? val : {};
    for (const k of new Set([...Object.keys(def), ...Object.keys(src)])) out[k] = mergeDefaults(def[k], src[k]);
    return out;
  }
  if (val === undefined || val === null) return def;
  return val;
}

export const getContent = cache(async (key: string): Promise<Obj> => {
  // In preview mode (admin live preview) show unpublished drafts when present
  let preview = false;
  try {
    preview = (await draftMode()).isEnabled;
  } catch {}
  const draft = preview ? await db.pageDraft.findUnique({ where: { key } }) : null;
  const row = draft ?? (await db.pageContent.findUnique({ where: { key } }));
  let stored: Obj = {};
  try {
    stored = row ? JSON.parse(row.data) : {};
  } catch {}
  return mergeDefaults(contentDefaults[key] ?? {}, stored);
});

export const getSettings = () => getContent("settings");

export const parseList = (s: string): string[] => {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
};

export const getVerticals = cache(async () => {
  const rows = await db.vertical.findMany({ where: { published: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return rows.map((v) => ({ ...v, capabilities: parseList(v.capabilities) }));
});

export const getLocations = cache(async () =>
  db.location.findMany({ where: { published: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] })
);

export const paragraphs = (s: string) =>
  (s || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
