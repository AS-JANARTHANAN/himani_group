"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";

type NavLink = { label: string; href: string; icon?: string; newTab?: boolean; index: number };
type Props = {
  brand: { name: string; logo: string; showName: boolean };
  links: NavLink[];
  cta: { show: boolean; label: string; href: string; icon?: string };
  contactLine?: string;
  homeLabel?: string;
  menuLabel?: string;
};

export default function Header({ brand, links, cta, contactLine, homeLabel = "Home", menuLabel = "Menu" }: Props) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  const ext = (l: NavLink) => (l.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {});

  return (
    <div className={`header-wrap ${open ? "menu-open" : ""}`}>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="wrap bar">
          <Link href="/" className="brand" aria-label={brand.name} data-edit="settings:brand.logo">
            {brand.logo ? <img src={brand.logo} alt="" width={48} height={48} /> : null}
            {brand.showName ? <span data-edit="settings:brand.name">{brand.name}</span> : null}
          </Link>
          <nav className="nav" aria-label="Main">
            {links.map((l) => (
              <Link key={l.href + l.label} href={l.href} className={active(l.href) ? "active" : ""} data-edit={`settings:navigation.links.${l.index}`} {...ext(l)}>
                {l.icon ? <Icon name={l.icon} size={16} /> : null}
                {l.label}
              </Link>
            ))}
          </nav>
          {cta.show ? (
            <Link href={cta.href || "/contact"} className="header-cta" data-edit="settings:navigation.ctaLabel">
              {cta.icon ? <Icon name={cta.icon} size={18} /> : null}
              {cta.label}
            </Link>
          ) : null}
          <button suppressHydrationWarning className="menu-toggle" aria-label={menuLabel} aria-expanded={open} onClick={() => setOpen(!open)}>
            <span className="bars">
              <i />
              <i />
              <i />
            </span>
            <span className="mt-label">{menuLabel}</span>
          </button>
        </div>
      </header>
      <div className="mobile-menu" aria-hidden={!open}>
        <nav aria-label="Mobile">
          {[{ label: homeLabel, href: "/", icon: "home", index: -1 } as NavLink, ...links].map((l, i) => (
            <Link key={l.href + l.label} href={l.href} tabIndex={open ? 0 : -1} {...ext(l)}>
              <small>{String(i + 1).padStart(2, "0")}</small>
              {l.label}
            </Link>
          ))}
        </nav>
        {cta.show ? (
          <Link href={cta.href || "/contact"} className="btn" tabIndex={open ? 0 : -1}>
            {cta.icon ? <Icon name={cta.icon} size={18} /> : null}
            {cta.label}
          </Link>
        ) : null}
        {contactLine ? <p className="meta">{contactLine}</p> : null}
      </div>
    </div>
  );
}
