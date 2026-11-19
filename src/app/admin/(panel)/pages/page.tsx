import Link from "next/link";
import { db } from "@/lib/db";
import { pageSchemas } from "@/lib/content-schema";

export default async function Pages() {
  const rows = await db.pageContent.findMany({ select: { key: true, updatedAt: true } });
  const updated = Object.fromEntries(rows.map((r) => [r.key, r.updatedAt]));
  return (
    <>
      <div className="a-top">
        <div>
          <div className="a-crumb">Website</div>
          <h1>Pages</h1>
          <p>The main pages of the website. To add a brand-new page, use Custom Pages.</p>
        </div>
        <Link href="/admin/custom-pages" className="a-btn ghost">
          Custom pages →
        </Link>
      </div>
      <table className="a-table">
        <thead>
          <tr>
            <th>Page</th>
            <th className="hide-sm">Address</th>
            <th className="hide-sm">Last updated</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {pageSchemas.map((p) => (
            <tr key={p.key}>
              <td>
                <div className="t">{p.label}</div>
                <div className="s">{p.description}</div>
              </td>
              <td className="hide-sm s">{p.path ?? "Global"}</td>
              <td className="hide-sm s">{updated[p.key] ? new Date(updated[p.key]).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—"}</td>
              <td>
                <div className="acts">
                  {p.path ? (
                    <a className="a-btn ghost" href={p.path} target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : null}
                  <Link className="a-btn" href={`/admin/pages/${p.key}`}>
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
