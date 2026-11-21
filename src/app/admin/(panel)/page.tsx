import Link from "next/link";
import { adminViews } from "@/lib/content-schema";
import { db } from "@/lib/db";
import { ICONS } from "@/lib/icons";

const Svg = ({ name, size = 28 }: { name: string; size?: number }) =>
  ICONS[name] ? (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={ICONS[name].d} />
    </svg>
  ) : null;

export default async function Dashboard() {
  const [verticals, locations, unread, latest] = await Promise.all([
    db.vertical.count(),
    db.location.count(),
    db.enquiry.count({ where: { read: false } }),
    db.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const pages = adminViews.filter((v) => v.group === "pages");
  const site = adminViews.filter((v) => v.group === "site");
  return (
    <>
      <div className="a-top">
        <div>
          <div className="a-crumb">Website editor</div>
          <h1>What would you like to change?</h1>
          <p>Pick a page below. You will see the real website next to the boxes. Click on any text or photo in it to change it, then press Save & publish.</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="a-btn ghost">
          <Svg name="external" size={17} /> Open website
        </a>
      </div>

      <div className="steps-help">
        <div>
          <span>1</span>
          <p>
            <b>Choose a page</b> from the list on the left or below.
          </p>
        </div>
        <div>
          <span>2</span>
          <p>
            <b>Click what you want to change</b> in the preview, or type in the boxes.
          </p>
        </div>
        <div>
          <span>3</span>
          <p>
            <b>Press “Save & publish”.</b> Visitors see it straight away.
          </p>
        </div>
      </div>

      <h2 className="a-h2"><Svg name="file" size={22} /> Pages</h2>
      <div className="a-tiles">
        {pages.map((v) => (
          <Link key={v.slug} href={`/admin/pages/${v.slug}`} className="a-tile">
            <span className="t-ic">
              <Svg name={v.icon} />
            </span>
            <h3>{v.label}</h3>
            <p>{v.hint}</p>
          </Link>
        ))}
        <Link href="/admin/verticals" className="a-tile">
          <span className="t-ic">
            <Svg name="excavator" />
          </span>
          <h3>Services ({verticals})</h3>
          <p>Add, remove or change your service cards and service pages</p>
        </Link>
        <Link href="/admin/locations" className="a-tile">
          <span className="t-ic">
            <Svg name="pin" />
          </span>
          <h3>Locations ({locations})</h3>
          <p>Places shown on the compass dial</p>
        </Link>
      </div>

      <h2 className="a-h2"><Svg name="globe" size={22} /> Every page (logo, menu, colours, Google…)</h2>
      <div className="a-tiles">
        {site.map((v) => (
          <Link key={v.slug} href={`/admin/pages/${v.slug}`} className="a-tile alt">
            <span className="t-ic">
              <Svg name={v.icon} />
            </span>
            <h3>{v.label}</h3>
            <p>{v.hint}</p>
          </Link>
        ))}
      </div>

      <div className="a-card" style={{ marginTop: 30 }}>
        <div className="a-card-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>
            <Svg name="mail" size={22} /> New enquiries {unread ? <span className="pill gold">{unread} unread</span> : null}
          </h2>
          <Link href="/admin/enquiries" className="a-btn ghost small">
            See all <Svg name="arrow" size={16} />
          </Link>
        </div>
        {latest.length ? (
          <table className="a-table">
            <tbody>
              {latest.map((e) => (
                <tr key={e.id}>
                  <td>
                    <div className="t">
                      {e.name} {!e.read ? <span className="pill gold">New</span> : null}
                    </div>
                    <div className="s">{e.email}</div>
                  </td>
                  <td className="hide-sm s">{e.interest || "General"}</td>
                  <td className="s" style={{ textAlign: "right" }}>
                    {e.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="a-hint">No enquiries yet. Messages sent from the contact form will show up here.</p>
        )}
      </div>
    </>
  );
}
