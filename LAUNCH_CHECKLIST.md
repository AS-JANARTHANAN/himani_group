# Himani Group: Launch, SEO, GEO & AEO Checklist

_Prepared 19 Nov 2026. ✅ = already done in the code. ☐ = needs your accounts / the client / the server._

- **SEO** (Search Engine Optimization): ranking in normal Google / Bing results.
- **AEO** (Answer Engine Optimization): being the answer Google shows directly (featured snippets, "People also ask", voice assistants, Google AI Overviews).
- **GEO** (Generative Engine Optimization): being mentioned and recommended inside AI answers (ChatGPT, Gemini, Claude, Perplexity, Copilot).

---

## A. Already done in the code ✅

### SEO on every page
- ✅ Each page has its own **Google title + description**, editable in the admin (each page → bottom box "Google & link sharing (SEO)"). Live letter counter + "How it looks in Google" preview.
- ✅ Default titles/descriptions written for **Dubai / UAE** searches (e.g. "Construction & Earthmoving Company in Dubai | Himani Group").
- ✅ Each service page gets its title from a template: Google & SEO → "Google title for each service page" (`{service} in Dubai | Himani Group`), or its own title in Services → Google & link sharing.
- ✅ **Canonical URL** on every page (stops duplicate-page problems).
- ✅ **Open Graph + X/Twitter cards**: correct title, description and photo when shared on WhatsApp, LinkedIn, Facebook, X. Share photo can be changed per page.
- ✅ **"Hide this page from Google"** switch per page (More options in the SEO box).
- ✅ `lang="en-AE"`, `og:locale = en_AE`, geo tags (`geo.region AE-DU`, `geo.placename Dubai`, `geo.position`, `ICBM`).
- ✅ One `<h1>` per page, real headings in order, alt text fields for photos.

### Structured data (Google rich results / Google Maps)
- ✅ `GeneralContractor` (LocalBusiness) schema on every page: name, legal name, logo, address, map position, phone, email, opening hours (Sat–Thu), areas served (Dubai, Abu Dhabi, Sharjah, UAE), social profiles, contact point (English + Arabic).
  Edited in admin → **Google & SEO → Business details for Google Maps & search**.
- ✅ `WebSite` schema.
- ✅ `Service` + `BreadcrumbList` schema on every service page.

### Sitemap, robots, manifest
- ✅ `/sitemap.xml`: all pages + all shown services + shown extra pages, with last-modified dates, priorities and image entries. Hidden pages are left out automatically.
- ✅ `/robots.txt`: blocks `/admin` and `/api`, points to the sitemap.
  **Safety switch:** while the website address is not a real `https://` domain, robots.txt blocks everything (so test copies never get indexed). It opens automatically once the address is set (see B1).
- ✅ `/manifest.webmanifest` (name, theme colour, icons) + browser theme colour.

### Tracking (loads only when an ID is filled in)
- ✅ Google Analytics 4, Google Tag Manager, Meta (Facebook) Pixel: admin → **Google & SEO → Google Analytics & Search Console**.
- ✅ Google Search Console + Bing verification meta tags from the same screen.
- ✅ Tracking is switched off inside the admin preview, so editing doesn't count as visits.

### AEO & GEO (answers and AI assistants)
- ✅ **FAQ section** on the home page (admin → Home page → "Questions & answers (FAQ)"): 5 starter questions written the way clients ask, each answered directly in the first sentence. Add, edit, reorder or hide questions there.
- ✅ **FAQPage structured data** generated from those questions, so Google can show them as rich answers.
- ✅ **`/llms.txt`**: a plain-text summary of the company for AI assistants (who you are, key facts, every service with link, pages, locations, FAQ). Built automatically from the admin content, so it stays up to date.
- ✅ Admin → Google & SEO → **"Short company summary for AI assistants"**: the 2–4 sentence factual summary used at the top of `/llms.txt`.
- ✅ **AI crawlers allowed** in robots.txt (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, Meta-ExternalAgent), with `/admin` and `/api` still closed. One switch blocks them all: admin → Google & SEO → "Let AI assistants … read the website".
- ✅ Clean, crawlable HTML: real text (not images of text), one H1 per page, clear H2/H3 headings, service pages with ticked "What we do" lists. AI systems and answer boxes extract these easily.
- ✅ Consistent entity data everywhere (name, legal name, address, phone, areas served, social profiles) in the business schema + `sameAs` links, which helps AI tools recognise "Himani Group" as one company.

### Security, sessions, caching, cookies
- ✅ **Admin sessions:** secure, script-proof cookie (`HttpOnly`, `SameSite=Lax`, `Secure` in production). Ends after 8 h without activity, renews itself while you work, and always ends after 7 days.
- ✅ **Sign out / password change really log out:** every login carries a version number. "Sign out everywhere" (My password & email) or changing the password cancels all other logins at once.
- ✅ **Login protection:** 5 wrong passwords per email or 20 per network address → 5-minute pause. Unknown emails get the same answer and timing as wrong passwords.
- ✅ **Production refuses to start without a strong `AUTH_SECRET`** (32+ characters).
- ✅ **Unsaved preview edits are thrown away** when you leave an editor screen or close the tab, so the public site never shows half-finished work.
- ✅ **Security headers** on every page: HTTPS-only (HSTS), no MIME sniffing, no framing by other sites, strict referrer policy, camera/microphone/location blocked. "Powered by" header removed.
- ✅ **Caching:** pages are pre-built and refreshed the moment you publish; code files cached 1 year (renamed on every update); photos 30 days; resized photos 30 days; uploads 1 year (unique names). Admin and API are never cached and never indexed.
- ✅ **Cookie consent:** Analytics / Tag Manager / Meta Pixel load only after the visitor taps "Accept" (choice saved 1 year, "Cookie settings" link in the footer to change it). Banner wording: admin → Small words & messages. The banner only appears once a tracking ID is filled in.

### Speed
- ✅ Photos are resized and compressed automatically (phones get ~50 KB instead of ~580 KB per photo), lazy-loaded below the fold, AVIF/WebP.
- ✅ Fonts self-hosted via Next.js (no Google Fonts request), only the chosen heading font is used.
- ✅ Pages are pre-rendered and refresh when the admin publishes.

---

## B. To do before / at launch ☐

### B1. Domain & server
- ☐ Buy/confirm the domain (a `.ae` domain helps local trust, e.g. `himanigroup.ae`; needs a UAE trade licence).
- ☐ Host on a Node.js server with a persistent disk (VPS, Railway, Render, Fly.io). See README → Deployment.
- ☐ SSL / HTTPS on, and redirect `http://` → `https://` and non-www → www (or the other way), one version only.
- ☐ Production `.env`: new long `AUTH_SECRET`, strong `ADMIN_PASSWORD`, `SITE_URL=https://www.<domain>`.
- ☐ Admin → **Google & SEO → Website address**: enter `https://www.<domain>` and press Save & publish.
  Then open `https://www.<domain>/robots.txt`: it must say `Allow: /` (not `Disallow: /`), and `https://www.<domain>/llms.txt` must show the company summary.
- ☐ Run `npm run build` and `npm start` (PM2 or similar). Daily backup of `prisma/himani.db` and `storage/uploads/`.

- ☐ If you put a CDN (e.g. Cloudflare) in front: keep its default of **not caching HTML pages**, or purge the cache after publishing. Images and `/_next/static` can be cached at the CDN.
- ☐ Login lockout counters live in the server's memory: fine for one server. If you ever run several servers, move them to a shared store (e.g. Redis).

### B2. Real business details (admin)
- ☐ **Phone, email & social**: phone, email, WhatsApp number, full address, opening hours, Google Maps link, social links. (WhatsApp button and footer contact appear only when filled.)
- ☐ **Google & SEO → Business details**: street address, PO Box, exact map position (lat/long of the office), trade licence number, founding year. Keep them **exactly the same** as on Google Business Profile (name, address, phone = "NAP").
- ☐ Replace the logo (SVG), and swap stock photos with real project / fleet / team photos where available.
- ☐ Review all draft copy (services, About, Vision).
- ☐ Create a **Privacy Policy** page (admin → Extra pages), required under the UAE data-protection law (PDPL) because the contact form collects personal data. Link it in the footer menu.
- ☐ If Analytics / Meta Pixel are used: consider a cookie-consent banner (ask if you want one added).

### B3. Google Search Console
1. ☐ search.google.com/search-console → **Add property** → URL prefix `https://www.<domain>`.
2. ☐ Choose **HTML tag**, copy only the code inside `content="…"`, paste into admin → Google & SEO → "Google Search Console – verification code" → Save & publish → click **Verify**.
   (Or use a Domain property with a DNS TXT record at the domain provider.)
3. ☐ **Sitemaps** → submit `sitemap.xml`.
4. ☐ **URL Inspection** → test the home page and 2–3 service pages → "Request indexing".
5. ☐ Check after a few days: Pages (indexed / not indexed), Core Web Vitals, Mobile usability, Enhancements (structured data).
6. ☐ Settings → Users: add the client as owner.

### B4. Google Analytics 4
1. ☐ analytics.google.com → create a **GA4 property** (time zone: Dubai, currency: AED) → Web data stream for the domain.
2. ☐ Copy the **Measurement ID** (`G-…`) → admin → Google & SEO → "Google Analytics 4" → Save & publish.
3. ☐ Check **Realtime** while opening the site on your phone.
4. ☐ Link GA4 with Search Console (GA4 Admin → Product links).
5. ☐ Mark key events (enquiry form sent, WhatsApp click, phone click). If you want, ask and I will add these click events in the code.
   (Use Tag Manager instead only if you prefer managing tags there; do not add GA4 in both.)

### B5. Local SEO for Dubai (biggest win for a contractor)
- ☐ **Google Business Profile** (business.google.com): category "Construction company" / "Excavating contractor" / "Equipment rental agency"; same name, address, phone as the website; add website link, hours, services, real photos; verify the listing; ask happy clients for reviews.
- ☐ Bing Places + Apple Business Connect (same details).
- ☐ UAE directories with the same NAP: Yellow Pages UAE, Dubai Chamber listing, ConstructionWeek / industry directories.
- ☐ Bing Webmaster Tools: import from Search Console or paste the Bing code in the admin.

### B6. Final QA
- ☐ PageSpeed Insights (pagespeed.web.dev) on home + one service page, mobile and desktop.
- ☐ Rich Results Test (search.google.com/test/rich-results) on home + a service page: GeneralContractor, FAQ, Service, Breadcrumb found with no errors.
- ☐ Share the home link on WhatsApp to check the preview card.
- ☐ Send a test enquiry from the contact form → it appears in admin → Enquiries.
- ☐ Test on a real iPhone and Android, plus Chrome / Safari / Edge on desktop.
- ☐ Check every menu link and button, the 404 page (`/anything`), and that `/admin` asks for login.
- ☐ Optional: email notification for new enquiries (needs SMTP or a Resend account; ask and I'll wire it up).

### B7. Later (growth)
- ☐ **Arabic version** of the site (`/ar`, right-to-left) with `hreflang` en-AE / ar-AE. Strongly recommended for UAE / GCC clients; ask when ready.
- ☐ A "Projects" page with real completed jobs (photos, location, scope); great for SEO and trust.
- ☐ One article a month on topics clients search (e.g. "Site preparation costs in Dubai", "Excavator rental in Dubai: what to know").

### B8. AEO checklist (answer boxes, "People also ask", voice)
- ☐ Search Google for your main services ("excavator rental Dubai", "site preparation company Dubai", "earthmoving contractor UAE") and note the **"People also ask"** questions. Add the best ones to the FAQ (admin → Home page → FAQ).
- ☐ Keep each FAQ answer **40–60 words**, with the direct answer in the first sentence, then one supporting detail.
- ☐ Add 2–3 service-specific questions to each service page text (e.g. "How long does site levelling take?"). Ask me if you want a FAQ box on every service page with its own schema.
- ☐ Use real numbers where true: fleet size, machine models and tonnage, years in business, projects completed, response time. Answer engines prefer specific facts.
- ☐ Check in Search Console → Performance which questions bring visitors, and answer them more clearly.
- ☐ Test: Rich Results Test on the home page must show **FAQ** with no errors.

### B9. GEO checklist (ChatGPT, Gemini, Claude, Perplexity, Copilot)
- ☐ After launch, open `https://www.<domain>/llms.txt` and check every fact is correct (address, phone, services).
- ☐ Fill in **"Short company summary for AI assistants"** with confirmed facts only (founding year, licence, fleet, key clients if allowed).
- ☐ Be listed on the sources AI tools read most: **Google Business Profile**, Bing Places, LinkedIn company page, Yellow Pages UAE, Dubai Chamber, industry directories, Wikipedia/Wikidata only if notable. Same name, address and phone everywhere.
- ☐ Get **reviews** on Google Business Profile (AI assistants quote ratings and review text).
- ☐ Get mentioned on other websites: supplier/partner pages, local news, construction trade sites (ConstructionWeek Middle East, Zawya press releases). Mentions matter more for GEO than links.
- ☐ Publish a **Projects** page with real case studies (location, scope, machines used, duration, result). AI answers love concrete examples.
- ☐ Monthly test: ask ChatGPT, Gemini, Perplexity and Copilot "best earthmoving company in Dubai", "excavator rental with operator Dubai", "construction company Dubai for site preparation". Note whether Himani Group appears and which sources they cite; improve those sources.
- ☐ Bing Webmaster Tools verified + sitemap submitted (ChatGPT search and Copilot use Bing's index).
- ☐ Keep the robots.txt AI switch **on**, unless the client decides not to appear in AI answers.
- ☐ An **Arabic version** (B7) also helps: many Gulf users ask AI assistants in Arabic.
