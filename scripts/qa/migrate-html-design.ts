// One-off: moves stored content to the approved HTML design. Keeps contact details,
// social links, tracking IDs and locations. Run: npx tsx scripts/qa/migrate-html-design.ts
import { PrismaClient } from "@prisma/client";
import { contentDefaults } from "../../src/lib/content-defaults";
import { verticals } from "../../prisma/seed-data";

const db = new PrismaClient();
async function main() {
  for (const [key, def] of Object.entries(contentDefaults)) {
    const row = await db.pageContent.findUnique({ where: { key } });
    const old = row ? JSON.parse(row.data) : {};
    const data: any = structuredClone(def);
    if (key === "settings") {
      for (const k of ["email", "phone", "whatsapp", "mapUrl"]) if (old.contact?.[k]) data.contact[k] = old.contact[k];
      for (const sec of ["social", "tracking"]) if (old[sec]) data[sec] = { ...data[sec], ...old[sec] };
      for (const k of ["siteUrl", "xHandle"]) if (old.seo?.[k]) data.seo[k] = old.seo[k];
      for (const k of ["street", "postalCode", "foundingYear", "license"]) if (old.business?.[k]) data.business[k] = old.business[k];
    }
    await db.pageContent.upsert({ where: { key }, create: { key, data: JSON.stringify(data) }, update: { data: JSON.stringify(data) } });
    console.log("page", key, "updated");
  }
  const drafts = await db.pageDraft.deleteMany();
  console.log("old drafts cleared:", drafts.count);
  for (const [i, v] of verticals.entries()) {
    const data = { ...v, capabilities: JSON.stringify(v.capabilities), order: i + 1, published: (v as any).published !== false };
    await db.vertical.upsert({ where: { slug: v.slug }, create: data, update: data });
    console.log("vertical", i + 1, v.title, data.published ? "" : "(hidden)");
  }
  const extra = await db.vertical.findMany({ where: { slug: { notIn: verticals.map((v) => v.slug) } } });
  for (const v of extra) console.log("left as is (not in design):", v.slug, v.published ? "published" : "hidden");
}
main().finally(() => db.$disconnect());
