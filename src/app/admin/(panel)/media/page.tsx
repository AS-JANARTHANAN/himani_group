import { db } from "@/lib/db";
import MediaManager from "./MediaManager";

export default async function Media() {
  const items = await db.media.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <div className="a-top">
        <div>
          <div className="a-crumb">Files</div>
          <h1>Photos & files</h1>
          <p>Drag photos here to upload them (JPG, PNG, WebP, SVG, up to 12 MB). Any uploaded photo can then be chosen in any photo box.</p>
        </div>
      </div>
      <MediaManager items={items.map((m) => ({ id: m.id, url: m.url, filename: m.filename, alt: m.alt, mime: m.mime, size: m.size }))} />
    </>
  );
}
