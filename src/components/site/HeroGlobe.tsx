"use client";

import Globe, { type GlobeLocation } from "./Globe";

export default function HeroGlobe({ locations }: { locations: GlobeLocation[] }) {
  return <Globe locations={locations} />;
}
