import Link from "next/link";
import { getSettings } from "@/lib/content";
import { themeCss } from "@/lib/theme-css";

export default async function NotFound() {
  const s = await getSettings();
  const L = s.labels;
  return (
    <div className="notfound">
      <style dangerouslySetInnerHTML={{ __html: themeCss(s.theme) }} />
      <div>
        <div className="tag">{L.notFoundEyebrow}</div>
        <h1 className="display">404</h1>
        <p className="lede">{L.notFoundTitle}</p>
        {L.notFoundText ? <p>{L.notFoundText}</p> : null}
        <Link href="/" className="btn">
          {L.notFoundButton}
        </Link>
      </div>
      <div className="hazard" aria-hidden />
    </div>
  );
}
