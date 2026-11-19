"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { draftMode, headers } from "next/headers";
import { redirect } from "next/navigation";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { endSession, requireAdmin, revokeAllSessions, startSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPageSchema } from "@/lib/content-schema";
import { UPLOAD_DIR } from "@/lib/uploads";
import { parseCoords } from "@/lib/geo";
import { slugify } from "@/lib/utils";

export type Result = { ok: boolean; error?: string; id?: string };

const refresh = () => revalidatePath("/", "layout");
const str = (v: unknown, max = 20000) => (typeof v === "string" ? v : v == null ? "" : String(v)).slice(0, max);
const parse = (json: string) => {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};

/* ---------------- auth ---------------- */

// Brute-force protection: 5 wrong passwords per email, 20 per network address, then a 5-minute pause.
const attempts = new Map<string, { n: number; until: number }>();
let dummyHash: string | undefined;
const blocked = (k: string) => (attempts.get(k)?.until || 0) > Date.now();
const fail = (k: string, limit: number) => {
  const n = (attempts.get(k)?.n || 0) + 1;
  attempts.set(k, { n, until: n >= limit ? Date.now() + 5 * 60_000 : 0 });
};

export async function login(_: { error?: string }, form: FormData): Promise<{ error?: string }> {
  const email = str(form.get("email"), 160).trim().toLowerCase();
  const password = str(form.get("password"), 200);
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const ek = "e:" + email, ik = "i:" + ip;
  if (blocked(ek) || blocked(ik)) return { error: "Too many attempts. Please wait a few minutes." };
  const user = await db.adminUser.findUnique({ where: { email } });
  // Unknown emails still run a hash check, so response time does not reveal which emails exist.
  dummyHash ??= await bcrypt.hash("not-a-real-password", 12);
  const ok = await bcrypt.compare(password, user ? user.passwordHash : dummyHash);
  if (!user || !ok) {
    fail(ek, 5);
    fail(ik, 20);
    return { error: "Invalid email or password." };
  }
  attempts.delete(ek);
  await startSession(user);
  redirect("/admin");
}

/** Signs out this browser only. */
export async function logout() {
  await endSession();
  try {
    (await draftMode()).disable();
  } catch {}
  redirect("/admin/login");
}

/** Signs out every browser and device where this admin is logged in. */
export async function logoutEverywhere() {
  const admin = await requireAdmin();
  await revokeAllSessions(admin.id);
  await endSession();
  try {
    (await draftMode()).disable();
  } catch {}
  redirect("/admin/login");
}

export async function changePassword(_: Result, form: FormData): Promise<Result> {
  const admin = await requireAdmin();
  const current = str(form.get("current"));
  const next = str(form.get("next"));
  const confirm = str(form.get("confirm"));
  const user = await db.adminUser.findUniqueOrThrow({ where: { id: admin.id } });
  if (!(await bcrypt.compare(current, user.passwordHash))) return { ok: false, error: "Current password is incorrect." };
  if (next.length < 10) return { ok: false, error: "New password must be at least 10 characters." };
  if (next !== confirm) return { ok: false, error: "The new passwords do not match." };
  // New password: cancel all other logins, keep this browser signed in.
  const updated = await db.adminUser.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(next, 12), sessionVersion: { increment: 1 } } });
  await startSession(updated);
  return { ok: true };
}

export async function updateProfile(_: Result, form: FormData): Promise<Result> {
  const admin = await requireAdmin();
  const name = str(form.get("name"), 120).trim();
  const email = str(form.get("email"), 160).trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: "Please enter a valid email." };
  const clash = await db.adminUser.findFirst({ where: { email, NOT: { id: admin.id } } });
  if (clash) return { ok: false, error: "That email is already in use." };
  await db.adminUser.update({ where: { id: admin.id }, data: { name: name || "Administrator", email } });
  return { ok: true };
}

/* ---------------- page content ---------------- */

export async function savePage(key: string, json: string): Promise<Result> {
  await requireAdmin();
  if (!getPageSchema(key)) return { ok: false, error: "Unknown page" };
  const data = parse(json);
  if (!data || typeof data !== "object") return { ok: false, error: "Invalid data" };
  await db.pageContent.upsert({ where: { key }, create: { key, data: JSON.stringify(data) }, update: { data: JSON.stringify(data) } });
  await db.pageDraft.deleteMany({ where: { key } });
  refresh();
  return { ok: true };
}

/** Stores unpublished edits so the admin live preview can show them. */
export async function savePageDraft(key: string, json: string): Promise<Result> {
  await requireAdmin();
  if (!getPageSchema(key)) return { ok: false, error: "Unknown page" };
  const data = parse(json);
  if (!data || typeof data !== "object") return { ok: false, error: "Invalid data" };
  await db.pageDraft.upsert({ where: { key }, create: { key, data: JSON.stringify(data) }, update: { data: JSON.stringify(data) } });
  return { ok: true };
}

export async function discardPageDraft(key: string) {
  await requireAdmin();
  await db.pageDraft.deleteMany({ where: { key } });
}

/* ---------------- verticals ---------------- */

export async function saveVertical(id: string | null, json: string): Promise<Result> {
  await requireAdmin();
  const d = parse(json);
  if (!d) return { ok: false, error: "Invalid data" };
  const title = str(d.main?.title, 200).trim();
  if (!title) return { ok: false, error: "Title is required." };
  const slug = slugify(str(d.main?.slug).trim() || title);
  if (!slug) return { ok: false, error: "Please provide a valid URL slug." };
  const clash = await db.vertical.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) } });
  if (clash) return { ok: false, error: `Another vertical already uses the slug "${slug}".` };
  const caps = Array.isArray(d.detail?.capabilities) ? d.detail.capabilities.map((c: any) => str(c?.text, 300).trim()).filter(Boolean) : [];
  const data = {
    title,
    slug,
    summary: str(d.main?.summary, 2000),
    intro: str(d.detail?.intro, 2000),
    body: str(d.detail?.body),
    capabilities: JSON.stringify(caps),
    image: str(d.media?.image, 500),
    imageAlt: str(d.media?.imageAlt, 300),
    imagePosition: str(d.media?.imagePosition, 40) || "center",
    icon: str(d.main?.icon, 40),
    seoTitle: str(d.seo?.title, 200),
    seoDescription: str(d.seo?.description, 500),
  };
  let saved;
  if (id) saved = await db.vertical.update({ where: { id }, data });
  else {
    const max = await db.vertical.aggregate({ _max: { order: true } });
    saved = await db.vertical.create({ data: { ...data, order: (max._max.order || 0) + 1 } });
  }
  refresh();
  return { ok: true, id: saved.id };
}

async function reorder(model: "vertical" | "location", id: string, dir: -1 | 1) {
  const rows: { id: string; order: number }[] =
    model === "vertical"
      ? await db.vertical.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }], select: { id: true, order: true } })
      : await db.location.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }], select: { id: true, order: true } });
  const i = rows.findIndex((r) => r.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= rows.length) return;
  [rows[i], rows[j]] = [rows[j], rows[i]];
  await db.$transaction(
    rows.map((r, k) =>
      model === "vertical" ? db.vertical.update({ where: { id: r.id }, data: { order: k + 1 } }) : db.location.update({ where: { id: r.id }, data: { order: k + 1 } })
    )
  );
}

export async function moveVertical(id: string, dir: -1 | 1) {
  await requireAdmin();
  await reorder("vertical", id, dir);
  refresh();
}

export async function toggleVertical(id: string) {
  await requireAdmin();
  const v = await db.vertical.findUniqueOrThrow({ where: { id } });
  await db.vertical.update({ where: { id }, data: { published: !v.published } });
  refresh();
}

export async function deleteVertical(id: string) {
  await requireAdmin();
  await db.vertical.delete({ where: { id } });
  refresh();
  redirect("/admin/verticals");
}

/* ---------------- locations ---------------- */

export async function saveLocation(id: string | null, json: string): Promise<Result> {
  await requireAdmin();
  const d = parse(json)?.main;
  if (!d) return { ok: false, error: "Invalid data" };
  const fromLink = parseCoords(str(d.maps, 2000));
  if (fromLink && "error" in fromLink) return { ok: false, error: fromLink.error };
  const lat = fromLink ? fromLink.lat : Number(d.lat), lng = fromLink ? fromLink.lng : Number(d.lng);
  if (d.lat === "" && d.lng === "" && !fromLink) return { ok: false, error: "Please paste a Google Maps link (or the two numbers) so the place can be shown on the globe." };
  if (!str(d.city).trim()) return { ok: false, error: "City / name is required." };
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) return { ok: false, error: "Latitude must be between -90 and 90." };
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) return { ok: false, error: "Longitude must be between -180 and 180." };
  const kind = ["hq", "office", "market"].includes(d.kind) ? d.kind : "market";
  const data = { city: str(d.city, 120).trim(), country: str(d.country, 120).trim(), kind, description: str(d.description, 300), lat, lng };
  let saved;
  if (id) saved = await db.location.update({ where: { id }, data });
  else {
    const max = await db.location.aggregate({ _max: { order: true } });
    saved = await db.location.create({ data: { ...data, order: (max._max.order || 0) + 1 } });
  }
  if (kind === "hq") await db.location.updateMany({ where: { kind: "hq", NOT: { id: saved.id } }, data: { kind: "office" } });
  refresh();
  return { ok: true, id: saved.id };
}

export async function moveLocation(id: string, dir: -1 | 1) {
  await requireAdmin();
  await reorder("location", id, dir);
  refresh();
}

export async function toggleLocation(id: string) {
  await requireAdmin();
  const v = await db.location.findUniqueOrThrow({ where: { id } });
  await db.location.update({ where: { id }, data: { published: !v.published } });
  refresh();
}

export async function deleteLocation(id: string) {
  await requireAdmin();
  await db.location.delete({ where: { id } });
  refresh();
  redirect("/admin/locations");
}

/* ---------------- custom pages ---------------- */

const RESERVED = new Set(["admin", "api", "about", "businesses", "global-presence", "vision", "contact", "uploads", "media", "brand", "sitemap.xml", "robots.txt"]);

export async function saveCustomPage(id: string | null, json: string): Promise<Result> {
  await requireAdmin();
  const d = parse(json);
  if (!d) return { ok: false, error: "Invalid data" };
  const title = str(d.main?.title, 200).trim();
  if (!title) return { ok: false, error: "Title is required." };
  const slug = slugify(str(d.main?.slug).trim() || title);
  if (!slug || RESERVED.has(slug)) return { ok: false, error: `The URL "${slug}" is reserved. Please choose another.` };
  const clash = await db.customPage.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) } });
  if (clash) return { ok: false, error: `Another page already uses "/${slug}".` };
  const sections = Array.isArray(d.content?.sections)
    ? d.content.sections.map((s: any) => ({ heading: str(s?.heading, 300), text: str(s?.text), image: str(s?.image, 500), imageAlt: str(s?.imageAlt, 300) }))
    : [];
  const data = {
    title,
    slug,
    eyebrow: str(d.main?.eyebrow, 200),
    intro: str(d.main?.intro, 2000),
    heroImage: str(d.main?.heroImage, 500),
    sections: JSON.stringify(sections),
    seoTitle: str(d.seo?.title, 200),
    seoDescription: str(d.seo?.description, 500),
  };
  const saved = id ? await db.customPage.update({ where: { id }, data }) : await db.customPage.create({ data });
  refresh();
  return { ok: true, id: saved.id };
}

export async function toggleCustomPage(id: string) {
  await requireAdmin();
  const p = await db.customPage.findUniqueOrThrow({ where: { id } });
  await db.customPage.update({ where: { id }, data: { published: !p.published } });
  refresh();
}

export async function deleteCustomPage(id: string) {
  await requireAdmin();
  await db.customPage.delete({ where: { id } });
  refresh();
  redirect("/admin/custom-pages");
}

/* ---------------- enquiries ---------------- */

export async function markEnquiry(id: string, read: boolean) {
  await requireAdmin();
  await db.enquiry.update({ where: { id }, data: { read } });
  revalidatePath("/admin", "layout");
}

export async function deleteEnquiry(id: string) {
  await requireAdmin();
  await db.enquiry.delete({ where: { id } });
  revalidatePath("/admin", "layout");
}

/* ---------------- media ---------------- */

export async function updateMediaAlt(id: string, alt: string) {
  await requireAdmin();
  await db.media.update({ where: { id }, data: { alt: str(alt, 300) } });
  revalidatePath("/admin/media");
}

export async function deleteMedia(id: string): Promise<Result> {
  await requireAdmin();
  const m = await db.media.findUnique({ where: { id } });
  if (!m) return { ok: true };
  const file = path.join(UPLOAD_DIR, m.filename);
  if (file.startsWith(UPLOAD_DIR + path.sep)) await unlink(file).catch(() => {});
  await db.media.delete({ where: { id } });
  revalidatePath("/admin/media");
  return { ok: true };
}
