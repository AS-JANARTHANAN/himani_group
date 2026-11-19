import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { contentDefaults } from "../src/lib/content-defaults";
import { verticals, locations } from "./seed-data";

const db = new PrismaClient();
const force = process.argv.includes("--force");

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@himanigroup.local";
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD is not set in .env");

  const existing = await db.adminUser.findUnique({ where: { email } });
  if (!existing) {
    await db.adminUser.create({ data: { email, passwordHash: await bcrypt.hash(password, 12) } });
    console.log(`Admin created: ${email}`);
  }

  for (const [key, data] of Object.entries(contentDefaults)) {
    const row = await db.pageContent.findUnique({ where: { key } });
    if (!row || force) {
      await db.pageContent.upsert({ where: { key }, create: { key, data: JSON.stringify(data) }, update: { data: JSON.stringify(data) } });
    }
  }

  if (force || (await db.vertical.count()) === 0) {
    await db.vertical.deleteMany();
    for (const [i, v] of verticals.entries()) {
      await db.vertical.create({ data: { ...v, capabilities: JSON.stringify(v.capabilities), order: i + 1 } });
    }
  }

  if (force || (await db.location.count()) === 0) {
    await db.location.deleteMany();
    for (const [i, l] of locations.entries()) await db.location.create({ data: { ...l, order: i + 1 } });
  }

  console.log("Seed complete.");
}

main().finally(() => db.$disconnect());
