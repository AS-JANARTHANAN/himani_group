import ConfirmButton from "@/components/admin/ConfirmButton";
import { db } from "@/lib/db";
import { deleteEnquiry, markEnquiry } from "../../actions";

export default async function Enquiries() {
  const rows = await db.enquiry.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <div className="a-top">
        <div>
          <div className="a-crumb">Inbox</div>
          <h1>Enquiries</h1>
          <p>Messages sent through the website contact form.</p>
        </div>
      </div>
      {rows.length ? (
        rows.map((e) => (
          <div className={`enq ${e.read ? "" : "unread"}`} key={e.id}>
            <div className="enq-head">
              <div>
                <b>{e.name}</b> {!e.read ? <span className="pill gold">New</span> : null}
                <div className="enq-meta">
                  <a href={`mailto:${e.email}`}>{e.email}</a>
                  {e.phone ? <a href={`tel:${e.phone}`}>{e.phone}</a> : null}
                  {e.company ? <span>{e.company}</span> : null}
                  <span>{e.interest || "General enquiry"}</span>
                </div>
              </div>
              <span className="enq-meta">{e.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
            </div>
            <p>{e.message}</p>
            <div className="enq-acts">
              <a className="a-link" href={`mailto:${e.email}?subject=${encodeURIComponent("Re: Your enquiry")}`}>
                Reply by email
              </a>
              <form action={markEnquiry.bind(null, e.id, !e.read)}>
                <button suppressHydrationWarning className="a-link">{e.read ? "Mark as unread" : "Mark as read"}</button>
              </form>
              <form action={deleteEnquiry.bind(null, e.id)}>
                <ConfirmButton className="a-link danger" message="Delete this enquiry?">
                  Delete
                </ConfirmButton>
              </form>
            </div>
          </div>
        ))
      ) : (
        <div className="a-card">
          <p className="a-hint" style={{ margin: 0 }}>No enquiries yet.</p>
        </div>
      )}
    </>
  );
}
