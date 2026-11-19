import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { getPageSchema } from "@/lib/content-schema";
import { db } from "@/lib/db";

/** Throws away unsaved preview edits for one page (called when the editor is closed). */
export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== (req.headers.get("x-forwarded-host") || req.headers.get("host"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const key = new URL(req.url).searchParams.get("key") || "";
  if (!getPageSchema(key)) return NextResponse.json({ error: "Unknown page" }, { status: 400 });
  await db.pageDraft.deleteMany({ where: { key } });
  return NextResponse.json({ ok: true });
}
