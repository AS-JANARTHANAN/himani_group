import Link from "next/link";
import { db } from "@/lib/db";
import { moveVertical, toggleVertical } from "../../actions";

export default async function Verticals() {
  const rows = await db.vertical.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return (
    <>
      <div className="a-top">
        <div>
          <div className="a-crumb">Services & places</div>
          <h1>Services</h1>
          <p>Each service gets a card on the Home and Services pages, plus its own page. Use the arrows to change the order. Click "Shown/Hidden" to show or hide a service.</p>
        </div>
        <Link href="/admin/verticals/new" className="a-btn">
          ＋ Add a service
        </Link>
      </div>
      <table className="a-table">
        <thead>
          <tr>
            <th style={{ width: 70 }}>#</th>
            <th>Service</th>
            <th className="hide-sm">Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((v, i) => (
            <tr key={v.id}>
              <td>
                <div style={{ display: "flex", gap: 4 }}>
                  <form action={moveVertical.bind(null, v.id, -1)}>
                    <button suppressHydrationWarning className="icon-btn" disabled={i === 0} aria-label="Move up">
                      ↑
                    </button>
                  </form>
                  <form action={moveVertical.bind(null, v.id, 1)}>
                    <button suppressHydrationWarning className="icon-btn" disabled={i === rows.length - 1} aria-label="Move down">
                      ↓
                    </button>
                  </form>
                </div>
              </td>
              <td>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  {v.image ? <img className="thumb" src={v.image} alt="" /> : <span className="thumb" />}
                  <div>
                    <div className="t">
                      {String(i + 1).padStart(2, "0")} · {v.title}
                    </div>
                    <div className="s">/businesses/{v.slug}</div>
                  </div>
                </div>
              </td>
              <td className="hide-sm">
                <form action={toggleVertical.bind(null, v.id)}>
                  <button suppressHydrationWarning className={`pill ${v.published ? "" : "off"}`} title="Click to show / hide on the website">
                    {v.published ? "Shown" : "Hidden"}
                  </button>
                </form>
              </td>
              <td>
                <div className="acts">
                  <a className="a-btn ghost" href={`/businesses/${v.slug}`} target="_blank" rel="noreferrer">
                    View
                  </a>
                  <Link className="a-btn" href={`/admin/verticals/${v.id}`}>
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
