import Link from "next/link";
import { db } from "@/lib/db";
import { toggleCustomPage } from "../../actions";

export default async function CustomPages() {
  const rows = await db.customPage.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <>
      <div className="a-top">
        <div>
          <div className="a-crumb">Services & places</div>
          <h1>Extra pages</h1>
          <p>Make a new page (for example Careers or Projects). New pages start hidden. When ready, show it, then add it to the menu under "Logo, menu & top bar".</p>
        </div>
        <Link href="/admin/custom-pages/new" className="a-btn">
          + New page
        </Link>
      </div>
      {rows.length ? (
        <table className="a-table">
          <thead>
            <tr>
              <th>Page</th>
              <th className="hide-sm">Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="t">{p.title}</div>
                  <div className="s">/{p.slug}</div>
                </td>
                <td className="hide-sm">
                  <form action={toggleCustomPage.bind(null, p.id)}>
                    <button suppressHydrationWarning className={`pill ${p.published ? "" : "off"}`}>{p.published ? "Published" : "Hidden"}</button>
                  </form>
                </td>
                <td>
                  <div className="acts">
                    {p.published ? (
                      <a className="a-btn ghost" href={`/${p.slug}`} target="_blank" rel="noreferrer">
                        View
                      </a>
                    ) : null}
                    <Link className="a-btn" href={`/admin/custom-pages/${p.id}`}>
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="a-card">
          <p className="a-hint" style={{ margin: 0 }}>
            No custom pages yet. Click <b>New page</b> to create one.
          </p>
        </div>
      )}
    </>
  );
}
