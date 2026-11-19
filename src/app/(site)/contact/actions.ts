"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getSettings } from "@/lib/content";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2, "name").max(120, "name"),
  email: z.string().trim().email("email").max(160, "email"),
  phone: z.string().trim().max(40).optional().default(""),
  company: z.string().trim().max(160).optional().default(""),
  interest: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(10, "message").max(4000, "message"),
});

export type EnquiryState = { ok: boolean; errors?: Record<string, string>; error?: string };

const hits = new Map<string, number[]>();

export async function submitEnquiry(_: EnquiryState, form: FormData): Promise<EnquiryState> {
  // Honeypot: bots fill hidden fields
  if (String(form.get("website") || "")) return { ok: true };

  const L = (await getSettings()).labels;
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 5) return { ok: false, error: L.errTooMany };

  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    const msg: Record<string, string> = { name: L.errName, email: L.errEmail, message: L.errMessage };
    for (const i of parsed.error.issues) {
      const k = String(i.path[0]);
      errors[k] ??= msg[k] || L.errFix;
    }
    return { ok: false, errors, error: L.errFix };
  }
  await db.enquiry.create({ data: parsed.data });
  hits.set(ip, [...recent, now]);
  return { ok: true };
}
