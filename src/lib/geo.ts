/**
 * Reads a map position from what people usually paste:
 *  - a Google Maps address-bar link  (…/@25.2048,55.2708,15z…)
 *  - a link with a dropped pin        (…!3d25.2048!4d55.2708…)
 *  - links with ?q= / ?ll= / ?query=   (…?q=25.2048,55.2708)
 *  - the two numbers copied from Google Maps ("25.2048, 55.2708")
 */
export function parseCoords(input: string): { lat: number; lng: number } | { error: string } | null {
  const s = (input || "").trim();
  if (!s) return null;
  if (/maps\.app\.goo\.gl|goo\.gl\/maps/i.test(s))
    return { error: "Short share links can't be read. Open the link, then copy the long address from the browser bar, or right-click the place in Google Maps and click the two numbers." };
  const num = String.raw`(-?\d{1,3}(?:\.\d+)?)`;
  const patterns = [
    new RegExp(String.raw`!3d${num}!4d${num}`),
    new RegExp(String.raw`@${num},\s*${num}`),
    new RegExp(String.raw`[?&](?:q|ll|query|center|destination)=${num}(?:,|%2C)\s*${num}`, "i"),
    new RegExp(String.raw`^${num}\s*[,;\s]\s*${num}$`),
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m) {
      const lat = Number(m[1]), lng = Number(m[2]);
      if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
    }
  }
  return { error: "Couldn't find a position in that link. Paste the Google Maps address-bar link, or the two numbers like 25.2048, 55.2708." };
}
