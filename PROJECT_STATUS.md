# Himani Group Website: Project Status & Next Steps

_Last updated: 20 Nov 2026 (approved HTML design)_

## 00. Approved HTML design of 20 Nov 2026 (current)

The site now follows the client-approved single-page HTML design, split into separate pages.

- **Look:** "Himani Original" colour template (default): deep forest green, gold #c6a268, champagne, warm cream; Georgia headings, Arial text. Other templates remain selectable.
- **Images:** the 12 design images in `public/media/design/` (hero = Golden-Hour Himani Group Complex). Logo: `public/brand/himani-logo.svg`.
- **Home (design order):** building photo + headline band → running strip of business names (the one small extra) → Who We Are → 9 business rows → Vision banner → Connect With Us → one-line footer.
- **Pages:** About (Who We Are), Our Businesses (9 rows), each business page, Vision (the banner), Contact (form). All wording is the design's wording.
- **Hidden, not deleted (switch on in the admin "Look" settings):** home Why-choose-us, globe and FAQ; About principles and steps; Vision hero, vision/mission, values, looking-ahead; the Where-We-Work page (noindex, menu link hidden); the Earthmoving service.
- **Removed:** interactive service scene, section edges, shaped photos.
- **Database:** backed up to `backups/himani-2026-11-20-before-html-design.db`, then moved to the new content with `scripts/qa/migrate-html-design.ts` (contact details, socials, tracking and locations kept).
- **4K images (update):** the hero and the six smaller HTML photos (who-we-are, equipment, construction, tiles, heritage wood, agriculture, vision banner) were AI-upscaled with Real-ESRGAN x4plus to 3840 px wide 4K masters; the four 2600 px photos were already sharp and are unchanged. Large / retina screens now load up to 3840 px.
- **Fuller pages (update, same day):** the client asked for more components and content. Re-enabled with new copy in the design's voice, using only the HTML photos: Home (Why Himani Group, new self-running business photo carousel, Where We Work globe, FAQ), About (principles, 4-step approach), Vision (vision & mission, 6 values, looking ahead), Where We Work page (indexed again, linked from Home). The running name strip under the hero stays. Backup before this step: `backups/himani-2026-11-20-before-fuller-content.db`.

## 0. Redesign of 19 Nov 2026 (replaces the old green/gold look)

The client asked for a site that does **not** copy the reference site (fadarus.ae: dark green, gold, Cinzel/Montserrat).

- **New look:** industrial, high-contrast design for a construction & earthmoving group. Sticky dark header with a highlight-colour bar, yellow/black "hazard stripe" motif, condensed bold headings, service cards with icon badges, coloured call-to-action band, WhatsApp button.
- **3 colour templates** (admin → Colours & fonts): *Site Yellow* (default, night-blue + machine yellow), *Royal Blue & Orange*, *Desert Sand & Red*. Each colour can still be changed by hand. 3 heading fonts (Barlow Condensed, Space Grotesk, Archivo) + Inter for text.
- **New photos:** 21 real stock photos from Unsplash (free licence) in `public/media/stock/` (credits in `CREDITS.txt`). The old images in `public/media/` are no longer used.
- **New copy:** construction & earthmoving first; new service "Earthmoving & Site Works" (10 services in total). All text is draft and editable.
- **Admin rebuilt for non-technical users:** pages listed directly in the left menu; "Whole website" screens (Logo, menu & top bar · Colours & fonts · Phone, email & social · Footer · Small words & messages · Google & sharing); plain-language labels; rarely used settings under "More options".
- **Click-to-edit preview:** click any text/photo in the live preview and its box opens and flashes; clicking a box highlights the matching spot on the page.
- **Everything editable:** top info bar (icon + text + link per item), menu links (text, link, icon, hide, new tab), header button (text, link, icon, show/hide), hero service strip, ticker words, footer headings, social icons, 404 page, form error messages, "Sending…", breadcrumbs, page-title suffix.
- **SEO (19 Nov):** per-page Google title/description/share photo/hide-from-Google, Dubai-focused default titles, canonical + Open Graph + X cards, GeneralContractor / WebSite / Service / Breadcrumb structured data, sitemap with images, robots.txt (blocks all until a real https address is set), manifest, GA4 / Tag Manager / Meta Pixel / Search Console / Bing fields in admin → Google & SEO. Admin emojis replaced by SVG icons. Photos auto-resized (≈50 KB on phones). **See `LAUNCH_CHECKLIST.md` for what is left (domain, Search Console, Analytics, Google Business Profile…).**
- Database was reset to the new content (content was still the untouched defaults). Backup of the old database: `backups/himani-2026-11-19-before-redesign.db`.

---

## 1. Client brief: checklist

| # | Client requirement | Status |
|---|---|---|
| 1 | Unique theme (not like the reference site) | ✅ Redone 19 Nov: industrial high-contrast look, 3 colour templates (see Section 0) |
| 2 | Headings & content | ✅ Rewritten 19 Nov for construction & earthmoving (draft, editable) |
| 3 | Replace images with sharp, high-res, premium images | ✅ 21 Unsplash stock photos; swap in real project photos when available |
| 4 | Use original vector logo | ⏳ **Waiting for client's SVG**: upload slot is ready |
| 5 | Subtle animations, interactive effects | ✅ Done: see Section 2 |
| 6 | Fully editable: text, images, divisions, pages | ✅ Done: full CMS (Content Studio) |

---

## 2. What has been done

### Tech setup
- Next.js 15, Prisma + SQLite, custom admin with secure login (bcrypt + signed cookies)
- Public pages are pre-rendered as static pages (fast) and refresh automatically when the admin publishes
- Production build tested (`npm run build` → `npm start`)

### Website pages
| Page | Path |
|---|---|
| Home | `/` |
| About Us | `/about` |
| Our Businesses | `/businesses` |
| 9 vertical detail pages | `/businesses/<slug>` |
| Global Presence (interactive globe) | `/global-presence` |
| Our Vision | `/vision` |
| Contact (enquiry form) | `/contact` |
| Custom pages created from admin | `/<slug>` |
| 404, sitemap.xml, robots.txt | ✅ |

### Design & interactions
- Hero image with slow zoom, line-by-line headline reveal, scroll cue
- Scrolling verticals ticker, scroll-reveal animations, image reveal, hover zooms
- Mobile full-screen menu, sticky header that shrinks on scroll
- **Interactive 3D dotted globe** (our own canvas code, not a copy of the reference site):
  - drag to rotate, gentle auto-sway
  - gold routes from HQ with a travelling light effect
  - city chips that focus the globe, info card, stat counters
  - colours follow the CMS theme
- Line-icon set (35 predefined SVG icons)
- Mobile-first spacing pass. No horizontal scroll at 375px on any page.
- Next.js "N" dev badge removed

### Content Studio (admin CMS)
- **Pages editor**: every text, image, button and link on every page, plus SEO title and description
- **Per-section controls**:
  - show/hide switch
  - ↑↓ reorder
  - **✎ Design** panel: background (green / cream / ivory / white / own image + darkness %), alignment, spacing in px (desktop & mobile separately), heading size in px, minimum height
- **Live preview**: real site beside the editor with Desktop / Tablet / Mobile views. Changes show before publishing. Publish / Discard / Ctrl+S.
- **Business Verticals**: add, edit, delete, reorder, publish/hide, image, icon, detail copy, areas of focus, SEO
- **Global Locations**: globe markers (HQ / office / market), lat/long, reorder, publish/hide
- **Custom Pages**: create new pages from sections (heading, text, image), with preview before publishing
- **Media Library**: upload JPG/PNG/WebP/SVG/PDF (12 MB), drag & drop, alt text, copy link, delete
- **Enquiries inbox**: contact form submissions, read/unread, reply by email, delete (spam honeypot + rate limit)
- **Site Settings**: logo, brand name, menu links, header button, contact details, social links, footer, theme colours, font size, heading scale, default SEO
- **My Account**: change email and password

### Tested end to end
- Admin login and route protection (admin pages redirect without login, upload API returns 401)
- Edit → publish → live site updates (dev and production)
- Live preview drafts are not visible to the public
- Section reorder, hide and design settings, theme colour change
- Location create/delete, image upload and serving, contact form → enquiries inbox
- Desktop (1440px) and mobile (375px) visual pass

---

## 3. Pending: what needs to be done next

### A. Needed from the client
- [ ] **Original logo (SVG/vector).** Upload in Media Library → select in Site Settings → Brand → Logo.
- [ ] **High-resolution photos (2000px+ wide)** for:
  - [ ] Himani Group complex (home hero). The current file is only 1672px wide, so it looks soft on large screens.
  - [ ] Artisanal tiles (Athangudi)
  - [ ] Heritage wood / Chettinad furnishings
  - [ ] Any real project, office or site photos they want to use
- [ ] **Contact details**: email, phone, WhatsApp, full address, office hours, Google Maps link
- [ ] **Social media links** (LinkedIn, Instagram, etc.)
- [ ] **Confirm locations / markets.** Riyadh, Singapore and London are hidden samples; publish only the real ones and add others.
- [ ] **Review draft copy**: vertical detail page text, guiding principles, values, "How we work", Global Presence text
- [ ] Final domain name (for SEO links and the sitemap)

### B. Our side (development)
- [ ] Source licensed high-res stock photos for generic divisions (trading, equipment, construction, property, export, engineering, agriculture), **if approved**
- [ ] Replace the Dubai skyline image (1400px) used in the vision band with a sharper one
- [ ] Contact form email notification (send enquiries to the client's inbox via SMTP / Resend)
- [ ] Add a favicon and share image from the final logo
- [ ] Optional: Google Analytics / Search Console
- [ ] Optional: WhatsApp floating button (number from Site Settings)
- [ ] Optional: multi-user admin (more than one login)
- [ ] Optional: automatic image resizing/compression on upload

### C. Deployment
- [ ] Choose hosting: VPS / Railway / Render / Fly.io (needs a persistent disk for the database + uploads)
  - For Vercel: switch the database to PostgreSQL and uploads to cloud storage first
- [ ] Set production `.env`: a new long `AUTH_SECRET`, `SITE_URL=https://<domain>`, a strong admin password
- [ ] `npm install` → `npm run setup` → `npm run build` → `npm start` (run with PM2 or similar)
- [ ] Connect domain + SSL (HTTPS)
- [ ] Set up daily backups of `prisma/himani.db` and `storage/uploads/`
- [ ] Final QA on real phones (iPhone + Android) and desktop browsers

### D. Handover
- [ ] Client walkthrough of the Content Studio (how to edit, preview, publish, upload, hide sections)
- [ ] Hand over admin login and ask the client to change the password
- [ ] Share README.md (technical) + a short admin guide

---

## 4. Useful commands

```bash
npm run dev            # development server → http://localhost:3100
npm run build          # production build
npm start              # run production build
npm run setup          # create database + admin + starting content (first time)
npm run db:seed -- --force   # reset all content to the original copy (keeps admin user)
```
