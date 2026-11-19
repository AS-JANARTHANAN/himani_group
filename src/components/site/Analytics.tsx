"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const ok = (v: unknown, re: RegExp) => (typeof v === "string" && re.test(v.trim()) ? v.trim() : "");
const COOKIE = "hg_consent";
type Choice = "granted" | "denied" | null;

const readChoice = (): Choice => {
  const m = document.cookie.match(/(?:^|; )hg_consent=(granted|denied)/);
  return m ? (m[1] as Choice) : null;
};
const saveChoice = (c: "granted" | "denied") => {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${c}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax${secure}`;
};

type Labels = { cookieText?: string; cookieAccept?: string; cookieDecline?: string; cookieSettings?: string };

/**
 * Google Analytics 4, Tag Manager and Meta Pixel. Each loads only when its ID is
 * filled in the admin AND the visitor has accepted cookies.
 */
export default function Analytics({ ga4, gtm, metaPixel, labels = {} }: { ga4?: string; gtm?: string; metaPixel?: string; labels?: Labels }) {
  const g = ok(ga4, /^G-[A-Z0-9]{4,20}$/i);
  const t = ok(gtm, /^GTM-[A-Z0-9]{4,12}$/i);
  const p = ok(metaPixel, /^\d{6,20}$/);
  const any = !!(g || t || p);
  const [choice, setChoice] = useState<Choice>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setChoice(readChoice());
    setReady(true);
    const reopen = () => setOpen(true);
    window.addEventListener("hg:cookie-settings", reopen);
    return () => window.removeEventListener("hg:cookie-settings", reopen);
  }, []);

  if (!any) return null;
  const decide = (c: "granted" | "denied") => {
    const wasGranted = choice === "granted";
    saveChoice(c);
    setChoice(c);
    setOpen(false);
    // Trackers already running can only be removed by reloading the page.
    if (c === "denied" && wasGranted) location.reload();
  };
  const granted = choice === "granted";
  const showBanner = ready && (choice === null || open);

  return (
    <>
      {granted && g ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${g}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${g}',{anonymize_ip:true});`}</Script>
        </>
      ) : null}
      {granted && t ? (
        <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${t}');`}</Script>
      ) : null}
      {granted && p ? (
        <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${p}');fbq('track','PageView');`}</Script>
      ) : null}
      {showBanner ? (
        <div className="cookie-bar" role="dialog" aria-live="polite" aria-label="Cookies" data-edit="settings:labels.cookieText">
          <p>{labels.cookieText}</p>
          <div className="cookie-acts">
            <button type="button" suppressHydrationWarning className="btn outline-dark" onClick={() => decide("denied")}>
              {labels.cookieDecline}
            </button>
            <button type="button" suppressHydrationWarning className="btn" onClick={() => decide("granted")}>
              {labels.cookieAccept}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Footer link that reopens the cookie choice. */
export function CookieSettingsLink({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <button type="button" suppressHydrationWarning className="cookie-link" onClick={() => window.dispatchEvent(new Event("hg:cookie-settings"))}>
      {label}
    </button>
  );
}
