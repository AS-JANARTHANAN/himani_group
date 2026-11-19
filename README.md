# Himani Group — Website & Content Studio

A premium corporate website for Himani Group with a fully editable, built-in CMS ("Content Studio").
Every heading, paragraph, image, business vertical, globe location, menu link and page can be changed from `/admin` — no code edits needed.

## Stack

- **Next.js 15** (App Router, server components, server actions)
- **Prisma + SQLite** (single-file database at `prisma/himani.db`; switch `provider` to `postgresql` for managed hosting)
- Custom admin with bcrypt-hashed passwords and signed httpOnly session cookies
- Hand-built canvas globe (no third-party globe library), land dots precomputed in `src/lib/land-dots.json`

## Getting started

```bash
npm install
cp .env.example .env        # then set AUTH_SECRET and ADMIN_PASSWORD
npm run setup               # creates the database, admin user and starting content
npm run dev                 # http://localhost:3100   ·   admin: http://localhost:3100/admin
```

Production:

```bash
npm run build && npm start
```

`npm run db:seed -- --force` resets all content back to the original copy (the admin user is kept).

## Site structure

| Page | Path | Edited in |
| --- | --- | --- |
| Home | `/` | Pages → Home |
| About Us | `/about` | Pages → About Us |
| Our Businesses | `/businesses` | Pages → Our Businesses + Business Verticals |
| Vertical detail (×9) | `/businesses/<slug>` | Business Verticals |
| Global Presence (interactive globe) | `/global-presence` | Pages → Global Presence + Global Locations |
| Our Vision | `/vision` | Pages → Our Vision |
| Contact (enquiry form) | `/contact` | Pages → Contact + Site Settings → Contact details |
| Custom pages | `/<slug>` | Custom Pages |

## Website editor (`/admin`)

Built for non-technical users. The left menu lists every page directly.

- **Edit a page** (Home, About, Services page, Where we work, Vision, Contact): each box is one part of the page, in website order. Each part can be shown/hidden, moved up/down, and restyled with **🎨 Look** (background: dark / highlight colour / light / white / photo; text position; spacing under "Spacing & size options").
- **Click-to-edit preview:** the real website is shown beside the boxes (Computer / Tablet / Phone). Click any text or photo in the preview and its box opens and flashes. Clicking in a box outlines the matching spot on the page. Changes appear in the preview straight away; visitors see them after **Save & publish** (or Ctrl+S).
- **Whole website:** *Logo, menu & top bar* (logo, name, top info bar items with icons, menu links with icon / hide / new tab, header button text + link + icon), *Colours & fonts*, *Phone, email & social* (incl. WhatsApp button), *Footer*, *Small words & messages* (404 page, form errors, "Sending…"), *Google & sharing*.
- **Colour templates:** Site Yellow (default), Royal Blue & Orange, Desert Sand & Red. Picking one fills in all colours and the heading font; each colour can then be adjusted.
- **Services:** add, edit, reorder, show/hide, delete. Each has a photo, icon, short text, page text and a ticked "list of work".
- **Locations (globe)**, **Extra pages**, **Photos & files** (ready-made stock photos + your uploads), **Enquiries**, **My password**.

### Replacing the logo
Upload the vector logo (SVG) in Media Library, then choose it under Site Settings → Brand → Logo.

### Replacing images
Open any image field → **Replace** → upload. Use images at least 2000px wide for sharp results on large screens.

## Notes on content

- Headings and descriptions from the approved design are kept word for word.
- Longer vertical-page copy, guiding principles, values and "How we work" are **draft text** written at capability level. Please review them in the Content Studio.
- Locations: Dubai (HQ), Chennai and Karaikudi come from the supplied material and are published. Riyadh, Singapore and London are **hidden sample markets**: publish them only if they are accurate. The counters on the site (countries, locations, routes) are calculated from the published locations.
- Contact email and phone are empty until set in Site Settings. Empty fields are hidden on the site.

## Deployment

The site needs a Node.js host with a persistent disk (for SQLite and uploads), for example a VPS, Railway, Render or Fly.io.
Back up `prisma/himani.db` and `storage/uploads/`.
For serverless hosts (e.g. Vercel), switch Prisma to PostgreSQL and move uploads to object storage.
