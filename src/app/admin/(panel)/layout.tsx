import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/content";
import { db } from "@/lib/db";
import { logout } from "../actions";
import AdminNav from "./AdminNav";
import "../admin.css";

export const metadata: Metadata = { title: "Website editor | Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const [s, unread] = await Promise.all([getSettings(), db.enquiry.count({ where: { read: false } })]);
  return (
    <div className="admin">
      <aside className="a-side">
        <div className="a-brand">
          {s.brand.logo ? <img src={s.brand.logo} alt="" /> : null}
          <div>
            <b>{s.brand.name}</b>
            <small>Website editor</small>
          </div>
        </div>
        <AdminNav unread={unread} />
        <div className="foot">
          <a href="/" target="_blank" rel="noreferrer">
            Open website ↗
          </a>
          <span>Signed in as {admin.email}</span>
          <form action={logout}>
            <button suppressHydrationWarning style={{ width: "100%" }}>Sign out</button>
          </form>
        </div>
      </aside>
      <div className="a-main">{children}</div>
    </div>
  );
}
