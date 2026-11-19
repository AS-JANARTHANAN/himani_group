import Link from "next/link";
import { db } from "@/lib/db";
import { moveLocation, toggleLocation } from "../../actions";

const KIND: Record<string, string> = { hq: "Headquarters", office: "Office", market: "Market" };

export default async function Locations() {
  const rows = await db.location.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return (
    <>
      <div className="a-top">
        <div>
          <div className="a-crumb">Services & places</div>
          <h1>Locations on the globe</h1>
          <p>The places shown as dots on the turning globe. Lines are drawn from the head office to every other shown location.</p>
        </div>
        <Link href="/admin/locations/new" className="a-btn">
          + Add location
        </Link>
      </div>
      <table className="a-table">
        <thead>
          <tr>
            <th style={{ width: 70 }}>#</th>
            <th>Location</th>
            <th className="hide-sm">Type</th>
            <th className="hide-sm">Coordinates</th>
            <th className="hide-sm">Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((l, i) => (
            <tr key={l.id}>
              <td>
                <div style={{ display: "flex", gap: 4 }}>
                  <form action={moveLocation.bind(null, l.id, -1)}>
                    <button suppressHydrationWarning className="icon-btn" disabled={i === 0} aria-label="Move up">↑</button>
                  </form>
                  <form action={moveLocation.bind(null, l.id, 1)}>
                    <button suppressHydrationWarning className="icon-btn" disabled={i === rows.length - 1} aria-label="Move down">↓</button>
                  </form>
                </div>
              </td>
              <td>
                <div className="t">{l.city}</div>
                <div className="s">
                  {l.country}
                  {l.description ? ` · ${l.description}` : ""}
                </div>
              </td>
              <td className="hide-sm">
                <span className={`pill ${l.kind === "hq" ? "gold" : "off"}`}>{KIND[l.kind] || l.kind}</span>
              </td>
              <td className="hide-sm s">
                {l.lat.toFixed(3)}, {l.lng.toFixed(3)}
              </td>
              <td className="hide-sm">
                <form action={toggleLocation.bind(null, l.id)}>
                  <button suppressHydrationWarning className={`pill ${l.published ? "" : "off"}`}>{l.published ? "Published" : "Hidden"}</button>
                </form>
              </td>
              <td>
                <div className="acts">
                  <Link className="a-btn" href={`/admin/locations/${l.id}`}>
                    Edit
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
