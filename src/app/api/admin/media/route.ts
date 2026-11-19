import { randomBytes } from "node:crypto";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { ALLOWED, MAX_BYTES, UPLOAD_DIR } from "@/lib/uploads";
import { slugify } from "@/lib/utils";

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.media.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
  // Built-in images shipped with the site
  const builtIn: { url: string; filename: string }[] = [];
  for (const dir of ["media/stock", "brand", "media"]) {
    const files = await readdir(path.join(process.cwd(), "public", dir)).catch(() => [] as string[]);
    for (const f of files) if (/\.(webp|png|jpe?g|svg|avif)$/i.test(f)) builtIn.push({ url: `/${dir}/${f}`, filename: f });
  }
  return NextResponse.json({ items, builtIn });
}

export async function POST(req: Request) {
  // Only accept uploads sent from this website's own admin (blocks cross-site requests).
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== (req.headers.get("x-forwarded-host") || req.headers.get("host"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const files = form.getAll("file").filter((f): f is File => f instanceof File);
  if (!files.length) return NextResponse.json({ error: "No file" }, { status: 400 });
  await mkdir(UPLOAD_DIR, { recursive: true });
  const out = [];
  for (const f of files) {
    if (!ALLOWED.includes(f.type)) return NextResponse.json({ error: `Unsupported file type: ${f.type || "unknown"}` }, { status: 400 });
    if (f.size > MAX_BYTES) return NextResponse.json({ error: `${f.name} is larger than 12 MB` }, { status: 400 });
    const ext = path.extname(f.name).toLowerCase().replace(/[^.a-z0-9]/g, "") || ".bin";
    const base = slugify(path.basename(f.name, path.extname(f.name))) || "file";
    const filename = `${base}-${randomBytes(4).toString("hex")}${ext}`;
    await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await f.arrayBuffer()));
    out.push(await db.media.create({ data: { url: `/uploads/${filename}`, filename, mime: f.type, size: f.size, alt: base.replace(/-/g, " ") } }));
  }
  return NextResponse.json({ items: out });
}
