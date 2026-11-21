"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminViews } from "@/lib/content-schema";
import { ICONS } from "@/lib/icons";

const Svg = ({ name }: { name: string }) =>
  ICONS[name] ? (
    <svg viewBox="0 0 24 24" width={19} height={19} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={ICONS[name].d} />
    </svg>
  ) : null;

type Item = { href: string; label: string; icon: string; exact?: boolean; badge?: boolean };

const groups: { label: string; items: Item[] }[] = [
  { label: "", items: [{ href: "/admin", label: "Start here", icon: "home", exact: true }] },
  { label: "Edit a page", items: adminViews.filter((v) => v.group === "pages").map((v) => ({ href: `/admin/pages/${v.slug}`, label: v.label, icon: v.icon })) },
  {
    label: "Services & places",
    items: [
      { href: "/admin/verticals", label: "Businesses", icon: "excavator" },
      { href: "/admin/locations", label: "Locations (globe)", icon: "pin" },
      { href: "/admin/custom-pages", label: "Extra pages", icon: "layers" },
    ],
  },
  { label: "Whole website", items: adminViews.filter((v) => v.group === "site").map((v) => ({ href: `/admin/pages/${v.slug}`, label: v.label, icon: v.icon })) },
  {
    label: "Files & messages",
    items: [
      { href: "/admin/media", label: "Photos & files", icon: "box" },
      { href: "/admin/enquiries", label: "Enquiries", icon: "mail", badge: true },
      { href: "/admin/account", label: "My password", icon: "shield" },
    ],
  },
];

export default function AdminNav({ unread }: { unread: number }) {
  const path = usePathname();
  const on = (i: Item) => (i.exact ? path === i.href : path === i.href || path.startsWith(i.href + "/"));
  return (
    <nav className="a-nav">
      {groups.map((g) => (
        <div key={g.label || "top"} className="a-grp">
          {g.label ? <span className="grp">{g.label}</span> : null}
          {g.items.map((i) => (
            <Link key={i.href} href={i.href} className={on(i) ? "on" : ""}>
              <Svg name={i.icon} />
              <span>{i.label}</span>
              {i.badge && unread > 0 ? <span className="badge">{unread}</span> : null}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
