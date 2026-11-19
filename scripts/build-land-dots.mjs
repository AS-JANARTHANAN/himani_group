// Precomputes an evenly spaced grid of land points for the globe (run once: npm run globe:dots)
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve("world-atlas/land-50m.json"), "utf8"));
const land = feature(topo, topo.objects.land);

const STEP = 1.15; // degrees between rows
const pts = [];
for (let lat = -58; lat <= 82; lat += STEP) {
  const ring = Math.cos((lat * Math.PI) / 180);
  const step = STEP / Math.max(ring, 0.15);
  for (let lng = -180; lng < 180; lng += step) {
    if (geoContains(land, [lng, lat])) pts.push(Math.round(lat * 10) / 10, Math.round(lng * 10) / 10);
  }
}
writeFileSync("src/lib/land-dots.json", JSON.stringify(pts));
console.log("dots:", pts.length / 2);
