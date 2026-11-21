// Declarative description of every editable page. The admin panel renders its
// forms from this file, and the public site reads the same keys.
// Labels are written in plain words for non-technical editors.

import { FONT_OPTIONS } from "./themes";

export type FieldType = "text" | "textarea" | "image" | "list" | "url" | "select" | "number" | "icon" | "color" | "toggle" | "preset";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  rows?: number;
  fields?: Field[]; // for lists
  itemLabel?: string; // for lists
  options?: { value: string; label: string }[]; // for selects
  placeholder?: string;
  /** Rarely needed settings, tucked under "More options". */
  advanced?: boolean;
};

export type Section = {
  key: string;
  label: string;
  description?: string;
  fields: Field[];
  /** Fixed sections (SEO, shared labels) cannot be hidden, moved or styled. */
  fixed?: boolean;
  /** Shown collapsed at the bottom (e.g. Google settings). */
  advanced?: boolean;
  /** Icon (from the icon library) shown next to the section name in the admin. */
  icon?: string;
};
export type PageSchema = { key: string; label: string; path?: string; description: string; sections: Section[]; noLayout?: boolean };

/** Layout & style controls available on every visual section (stored under data._layout). */
export const SECTION_STYLE_FIELDS: Field[] = [
  {
    name: "theme",
    label: "Background colour",
    type: "select",
    options: [
      { value: "", label: "Normal (as designed)" },
      { value: "dark", label: "Dark colour" },
      { value: "accent", label: "Highlight colour" },
      { value: "cream", label: "Light grey / sand" },
      { value: "white", label: "White" },
      { value: "image", label: "A photo" },
    ],
  },
  { name: "bgImage", label: "Background photo", type: "image", help: "Used when Background colour is set to \"A photo\"." },
  { name: "overlay", label: "Darken the photo (%)", type: "number", placeholder: "70", help: "0 = photo only, 100 = fully dark." },
  { name: "align", label: "Text position", type: "select", options: [{ value: "", label: "Normal" }, { value: "left", label: "Left" }, { value: "center", label: "Centre" }] },
  { name: "padTop", label: "Space above, computer (px)", type: "number", placeholder: "auto", advanced: true },
  { name: "padBottom", label: "Space below, computer (px)", type: "number", placeholder: "auto", advanced: true },
  { name: "padTopMobile", label: "Space above, phone (px)", type: "number", placeholder: "auto", advanced: true },
  { name: "padBottomMobile", label: "Space below, phone (px)", type: "number", placeholder: "auto", advanced: true },
  { name: "headingSize", label: "Heading size, computer (px)", type: "number", placeholder: "auto", advanced: true },
  { name: "headingSizeMobile", label: "Heading size, phone (px)", type: "number", placeholder: "auto", advanced: true },
  { name: "minHeight", label: "Minimum height, computer (px)", type: "number", placeholder: "auto", advanced: true },
];

/* ---------------- reusable field builders ---------------- */

const eyebrow: Field = { name: "eyebrow", label: "Small text above the heading", type: "text" };
const title: Field = { name: "title", label: "Heading", type: "text" };
const titleAccent: Field = { name: "titleAccent", label: "Heading, second line (in highlight colour)", type: "text", help: "Optional. Leave empty for a one-line heading." };
const text = (rows = 3, label = "Text"): Field => ({ name: "text", label, type: "textarea", rows });
const paras = (rows = 6): Field => ({ name: "text", label: "Paragraphs", type: "textarea", rows, help: "Leave one empty line between paragraphs." });
const image = (label = "Photo"): Field => ({ name: "image", label, type: "image" });
const imageAlt: Field = { name: "imageAlt", label: "Photo description (for Google & blind visitors)", type: "text", advanced: true };
const linkLabel = (label = "Link text"): Field => ({ name: "linkLabel", label, type: "text" });
const linkHref: Field = { name: "linkHref", label: "Link goes to", type: "url", help: "A page address like /about or a full web address." };
const iconItems = (name: string, label: string, itemLabel: string, rows = 3): Field => ({
  name,
  label,
  type: "list",
  itemLabel,
  fields: [
    { name: "icon", label: "Icon", type: "icon" },
    { name: "title", label: "Title", type: "text" },
    { name: "text", label: "Text", type: "textarea", rows },
  ],
});

const seo: Section = {
  key: "seo",
  fixed: true,
  advanced: true,
  icon: "search",
  label: "Google & link sharing (SEO)",
  description: "How this page looks in Google search results and when its link is shared on WhatsApp, Facebook or LinkedIn.",
  fields: [
    { name: "title", label: "Title in Google (best: 50–60 letters)", type: "text", help: "Put the main search words first, e.g. \"Diversified Business Group in Dubai\"." },
    { name: "description", label: "Description in Google (best: 140–160 letters)", type: "textarea", rows: 3, help: "One or two sentences that make people want to click." },
    { name: "ogImage", label: "Picture when the link is shared", type: "image", help: "Leave empty to use the page's banner photo." },
    { name: "noindex", label: "Hide this page from Google", type: "toggle", advanced: true },
  ],
};

const cta: Section = {
  key: "cta",
  icon: "megaphone",
  label: "Call-to-action band",
  description: "The coloured band near the bottom that invites visitors to contact you.",
  fields: [
    eyebrow,
    title,
    text(3),
    { name: "buttonLabel", label: "Button text", type: "text" },
    { name: "buttonHref", label: "Button goes to", type: "url" },
    { name: "buttonIcon", label: "Button icon", type: "icon" },
  ],
};

const heroBasic = (withImage: boolean): Section => ({
  key: "hero",
  icon: "image",
  label: "Top banner",
  description: "The big banner at the top of the page.",
  fields: [eyebrow, title, titleAccent, text(3, "Introduction"), ...(withImage ? [image("Banner photo"), imageAlt] : [])],
});

/* ---------------- pages ---------------- */

export const pageSchemas: PageSchema[] = [
  {
    key: "settings",
    label: "Site settings",
    noLayout: true,
    description: "Things that appear on every page: logo, menu, contact details, colours and footer.",
    sections: [
      {
        key: "brand",
        icon: "tag",
        label: "Logo & company name",
        description: "Shown at the top-left of every page.",
        fields: [
          { name: "logo", label: "Logo", type: "image", help: "PNG or SVG with a transparent background works best." },
          { name: "name", label: "Company name next to the logo", type: "text" },
          { name: "showName", label: "Show the company name next to the logo", type: "toggle" },
          { name: "fullName", label: "Full company name", type: "text", help: "Used on the contact page and in the footer." },
          { name: "tagline", label: "Short slogan", type: "text" },
        ],
      },
      {
        key: "topbar",
        icon: "pin",
        label: "Thin bar above the menu",
        description: "The slim strip at the very top with phone, email or opening hours. Each item has its own icon.",
        fields: [
          { name: "show", label: "Show this bar", type: "toggle" },
          {
            name: "items",
            label: "Items in the bar",
            type: "list",
            itemLabel: "Item",
            fields: [
              { name: "icon", label: "Icon", type: "icon" },
              { name: "text", label: "Text", type: "text" },
              { name: "href", label: "Clicking goes to (optional)", type: "url", help: "e.g. tel:+971500000000 or mailto:info@company.com" },
            ],
          },
          { name: "showSocial", label: "Show social media icons on the right", type: "toggle" },
        ],
      },
      {
        key: "navigation",
        icon: "menu",
        label: "Menu & header button",
        description: "The menu links at the top of every page and the highlighted button on the right.",
        fields: [
          {
            name: "links",
            label: "Menu links",
            type: "list",
            itemLabel: "Menu link",
            fields: [
              { name: "label", label: "Text", type: "text" },
              { name: "href", label: "Goes to", type: "url", help: "A page address like /about" },
              { name: "icon", label: "Icon (optional)", type: "icon" },
              { name: "hidden", label: "Hide this link", type: "toggle" },
              { name: "newTab", label: "Open in a new tab", type: "toggle" },
            ],
          },
          { name: "ctaShow", label: "Show the header button", type: "toggle" },
          { name: "ctaLabel", label: "Header button text", type: "text" },
          { name: "ctaHref", label: "Header button goes to", type: "url" },
          { name: "ctaIcon", label: "Header button icon", type: "icon" },
          { name: "homeLabel", label: "\"Home\" link text (phone menu)", type: "text" },
          { name: "menuLabel", label: "Phone menu button text", type: "text", advanced: true },
        ],
      },
      {
        key: "contact",
        icon: "phone",
        label: "Phone, email & address",
        description: "Used in the header bar, contact page and footer. Leave a box empty to hide it.",
        fields: [
          { name: "phone", label: "Phone", type: "text" },
          { name: "email", label: "Email", type: "text" },
          { name: "whatsapp", label: "WhatsApp number", type: "text", help: "With country code, digits only, e.g. 971500000000" },
          { name: "address", label: "Address", type: "textarea", rows: 3 },
          { name: "hours", label: "Opening hours", type: "text" },
          { name: "mapUrl", label: "Google Maps link", type: "url" },
          { name: "whatsappButton", label: "Show the round WhatsApp button at the bottom corner", type: "toggle" },
          { name: "whatsappLabel", label: "WhatsApp button text", type: "text" },
        ],
      },
      {
        key: "social",
        icon: "globe",
        label: "Social media",
        description: "Paste the full link to each profile (e.g. https://instagram.com/yourname). A box left empty hides that icon. The thin bar above the menu has its own switch under \"Logo, menu & top bar\".",
        fields: [
          { name: "instagram", label: "Instagram link", type: "url" },
          { name: "linkedin", label: "LinkedIn link", type: "url" },
          { name: "facebook", label: "Facebook link", type: "url" },
          { name: "x", label: "X / Twitter link", type: "url" },
          { name: "youtube", label: "YouTube link", type: "url" },
          { name: "tiktok", label: "TikTok link", type: "url" },
          { name: "snapchat", label: "Snapchat link", type: "url" },
          { name: "threads", label: "Threads link", type: "url" },
          { name: "showInFooter", label: "Show social icons in the footer", type: "toggle" },
          { name: "showOnContact", label: "Show social icons on the contact page", type: "toggle" },
        ],
      },
      {
        key: "theme",
        icon: "palette",
        label: "Colours & fonts",
        description: "Pick a ready-made colour template, then fine-tune any colour if you like. The preview shows the result straight away.",
        fields: [
          { name: "preset", label: "Colour template", type: "preset" },
          { name: "font", label: "Heading font", type: "select", options: FONT_OPTIONS },
          { name: "dark", label: "Dark colour: header, footer, dark sections", type: "color" },
          { name: "accent", label: "Highlight colour: buttons, icons, lines", type: "color" },
          { name: "onAccent", label: "Text on highlight-coloured buttons", type: "color" },
          { name: "accentText", label: "Highlight text on white backgrounds", type: "color", help: "Keep this dark enough to read on white." },
          { name: "accentOnDark", label: "Highlight text on dark backgrounds", type: "color", help: "Gold/yellow words on the dark header, footer and dark sections." },
          { name: "deep", label: "Dark section background", type: "color", help: "Background of dark sections such as Our Businesses. Leave empty to use the dark colour." },
          { name: "card", label: "Rows / cards on dark sections", type: "color", help: "Leave empty for an automatic slightly lighter shade." },
          { name: "gradient", label: "Shiny gradient on buttons and badges", type: "toggle" },
          { name: "light", label: "Light section background", type: "color" },
          { name: "paper", label: "Page background", type: "color" },
          { name: "text", label: "Normal text colour", type: "color" },
          { name: "baseSize", label: "Normal text size (px)", type: "number", placeholder: "16", advanced: true },
          { name: "headingScale", label: "Make all headings bigger / smaller (%)", type: "number", placeholder: "100", help: "e.g. 90 = smaller, 110 = bigger", advanced: true },
        ],
      },
      {
        key: "footer",
        icon: "layers",
        label: "Footer",
        description: "The dark area at the bottom of every page: logo, short statement and button, then columns of links (company pages, businesses, contact details) and the copyright line.",
        fields: [
          { name: "statement", label: "Short statement under the logo", type: "textarea", rows: 2 },
          { name: "buttonLabel", label: "Button text (leave empty to hide)", type: "text" },
          { name: "buttonHref", label: "Button goes to", type: "url" },
          { name: "showLinks", label: "Show the link columns", type: "toggle", help: "Off = one slim line (logo, slogan, copyright), as in the first approved design." },
          { name: "exploreTitle", label: "Heading above the page links", type: "text" },
          { name: "businessesTitle", label: "Heading above the business links", type: "text" },
          { name: "contactTitle", label: "Heading above the contact details", type: "text" },
          { name: "copyright", label: "Copyright line", type: "text", help: "{year} is replaced with the current year." },
        ],
      },
      {
        key: "labels",
        icon: "type",
        label: "Small words & messages",
        description: "Little bits of text used around the website: error messages, the 404 page, button states.",
        fields: [
          { name: "notFoundEyebrow", label: "404 page: small text", type: "text" },
          { name: "notFoundTitle", label: "404 page: heading", type: "text" },
          { name: "notFoundText", label: "404 page: text", type: "textarea", rows: 2 },
          { name: "notFoundButton", label: "404 page: button text", type: "text" },
          { name: "scrollLabel", label: "\"Scroll down\" hint on the home banner", type: "text" },
          { name: "breadcrumbHome", label: "\"Home\" in the path above page headings", type: "text" },
          { name: "sending", label: "Form button while sending", type: "text" },
          { name: "errName", label: "Form error: name missing", type: "text" },
          { name: "errEmail", label: "Form error: email wrong", type: "text" },
          { name: "errMessage", label: "Form error: message too short", type: "text" },
          { name: "errTooMany", label: "Form error: too many messages", type: "text" },
          { name: "errFix", label: "Form error: please check the fields", type: "text" },
          { name: "phoneLabel", label: "\"Phone\" label", type: "text" },
          { name: "emailLabel", label: "\"Email\" label", type: "text" },
          { name: "whatsappLabel", label: "\"WhatsApp\" label", type: "text" },
          { name: "titleSuffix", label: "Added after page titles in Google", type: "text", help: "e.g. \" | Himani Group\"" },
          { name: "cookieText", label: "Cookie notice: text", type: "textarea", rows: 2, help: "Shown only when a Google Analytics, Tag Manager or Meta Pixel ID is filled in." },
          { name: "cookieAccept", label: "Cookie notice: accept button", type: "text" },
          { name: "cookieDecline", label: "Cookie notice: decline button", type: "text" },
          { name: "cookieSettings", label: "\"Cookie settings\" link in the footer", type: "text" },
          { name: "footerEnquiry", label: "Enquiry link in the footer", type: "text" },
        ],
      },
      {
        key: "seo",
        icon: "search",
        label: "Google basics (whole site)",
        description: "Used for every page that has no Google title or description of its own.",
        fields: [
          { name: "siteUrl", label: "Website address", type: "url", placeholder: "https://www.himanigroup.ae", help: "Your real domain with https://. Used for Google, the sitemap and share links." },
          { name: "title", label: "Website title in Google", type: "text" },
          { name: "description", label: "Website description in Google", type: "textarea", rows: 3 },
          { name: "serviceTitle", label: "Google title for each service page", type: "text", help: "{service} is replaced with the service name. Used when a service has no title of its own." },
          { name: "ogImage", label: "Picture shown when the link is shared", type: "image" },
          { name: "allowAI", label: "Let AI assistants (ChatGPT, Gemini, Claude, Perplexity) read the website", type: "toggle", help: "Recommended: lets AI answers recommend and quote your company." },
          { name: "aiSummary", label: "Short company summary for AI assistants", type: "textarea", rows: 4, help: "Plain facts: who you are, what you do, where. Used in /llms.txt." },
          { name: "xHandle", label: "X / Twitter username (optional)", type: "text", placeholder: "@himanigroup", advanced: true },
          {
            name: "locale",
            label: "Main language & country",
            type: "select",
            advanced: true,
            options: [
              { value: "en_AE", label: "English – United Arab Emirates" },
              { value: "ar_AE", label: "Arabic – United Arab Emirates" },
              { value: "en_GB", label: "English – United Kingdom" },
              { value: "en_IN", label: "English – India" },
            ],
          },
        ],
      },
      {
        key: "business",
        icon: "building",
        label: "Business details for Google Maps & search",
        description: "Google reads these to show your company with address, hours and phone in local (Dubai) searches. They are not shown on the page itself.",
        fields: [
          {
            name: "type",
            label: "Type of business",
            type: "select",
            options: [
              { value: "GeneralContractor", label: "Construction / general contractor" },
              { value: "HomeAndConstructionBusiness", label: "Construction & home services" },
              { value: "LocalBusiness", label: "Local business (general)" },
              { value: "Organization", label: "Company / group (no customer visits)" },
            ],
          },
          { name: "street", label: "Street address", type: "text", placeholder: "Office 000, Building name, Area" },
          { name: "city", label: "City", type: "text" },
          { name: "region", label: "Emirate / state", type: "text" },
          { name: "postalCode", label: "PO Box / postal code", type: "text" },
          { name: "country", label: "Country code", type: "text", help: "Two letters, e.g. AE for the UAE." },
          { name: "lat", label: "Latitude (map position)", type: "text", placeholder: "25.2048" },
          { name: "lng", label: "Longitude (map position)", type: "text", placeholder: "55.2708" },
          { name: "areaServed", label: "Areas you work in", type: "text", help: "Separate with commas, e.g. Dubai, Abu Dhabi, Sharjah, United Arab Emirates" },
          {
            name: "days",
            label: "Working days",
            type: "select",
            options: [
              { value: "sat-thu", label: "Saturday to Thursday" },
              { value: "mon-fri", label: "Monday to Friday" },
              { value: "mon-sat", label: "Monday to Saturday" },
              { value: "all", label: "Every day" },
            ],
          },
          { name: "opens", label: "Opens at (24h)", type: "text", placeholder: "08:00" },
          { name: "closes", label: "Closes at (24h)", type: "text", placeholder: "18:00" },
          { name: "foundingYear", label: "Year the company started (optional)", type: "text", advanced: true },
          { name: "license", label: "Trade licence number (optional)", type: "text", advanced: true },
        ],
      },
      {
        key: "tracking",
        icon: "chart",
        label: "Google Analytics & Search Console",
        description: "Paste the codes from your Google accounts. Leave empty until you have them. Nothing is added to the website while a box is empty.",
        fields: [
          { name: "ga4", label: "Google Analytics 4 – Measurement ID", type: "text", placeholder: "G-XXXXXXXXXX", help: "Google Analytics → Admin → Data streams → your website." },
          { name: "gtm", label: "Google Tag Manager – Container ID (optional)", type: "text", placeholder: "GTM-XXXXXXX", help: "Only if you use Tag Manager. Don't add Analytics in both places." },
          { name: "gsc", label: "Google Search Console – verification code", type: "text", placeholder: "abc123…", help: "Search Console → Add property → HTML tag. Paste only the code inside content=\"…\"." },
          { name: "bing", label: "Bing Webmaster – verification code (optional)", type: "text", advanced: true },
          { name: "metaPixel", label: "Facebook / Meta Pixel ID (optional)", type: "text", advanced: true },
        ],
      },
    ],
  },
  {
    key: "home",
    label: "Home page",
    path: "/",
    description: "The first page visitors see.",
    sections: [
      {
        key: "hero",
        icon: "image",
        label: "Big top banner",
        description: "The large photo with the main headline and buttons.",
        fields: [
          eyebrow,
          { name: "title", label: "Main headline", type: "text" },
          titleAccent,
          text(3, "Introduction"),
          image("Banner photo"),
          imageAlt,
          { name: "primaryLabel", label: "Main button text", type: "text" },
          { name: "primaryHref", label: "Main button goes to", type: "url" },
          { name: "secondaryLabel", label: "Second button text", type: "text" },
          { name: "secondaryHref", label: "Second button goes to", type: "url" },
        ],
      },
      {
        key: "ticker",
        icon: "arrow",
        label: "Moving text strip",
        description: "The coloured strip with words that scroll sideways. Leave the list empty to show your service names.",
        fields: [
          { name: "items", label: "Words", type: "list", itemLabel: "Word", fields: [{ name: "text", label: "Text", type: "text" }] },
        ],
      },
      {
        key: "intro",
        icon: "users",
        label: "About us (short)",
        fields: [
          eyebrow,
          title,
          paras(6),
          image(),
          imageAlt,
          linkLabel(),
          linkHref,
        ],
      },
      {
        key: "verticals",
        icon: "crane",
        label: "Business verticals",
        description: "The business rows. Add, remove or edit the businesses themselves under \"Businesses\" in the left menu.",
        fields: [eyebrow, title, text(3), linkLabel("Button text under the cards")],
      },
      {
        key: "carousel",
        icon: "image",
        label: "Business photo carousel",
        description: "A photo slider of your businesses that moves by itself. The photos and names come from \"Businesses\" in the left menu.",
        fields: [eyebrow, title, titleAccent, text(3)],
      },
      {
        key: "strengths",
        icon: "star",
        label: "Why choose us",
        fields: [eyebrow, title, text(3), image("Photo beside the list"), iconItems("items", "Reasons", "Reason", 2)],
      },
      {
        key: "presence",
        icon: "globe",
        label: "Where we work (globe)",
        fields: [
          eyebrow,
          title,
          titleAccent,
          text(3),
          linkLabel(),
          { name: "statVerticals", label: "Counter text: services", type: "text" },
          { name: "statCountries", label: "Counter text: countries", type: "text" },
          { name: "statLocations", label: "Counter text: locations", type: "text" },
        ],
      },
      {
        key: "vision",
        icon: "sun",
        label: "Vision banner",
        fields: [
          eyebrow,
          title,
          titleAccent,
          text(3),
          image("Banner photo"),
          { name: "showText", label: "Show these words over the photo", type: "toggle", help: "Leave off when the photo already has the words in it (as in the approved design). Phones always show the words under the photo." },
          linkLabel("Button text"),
          { name: "linkHref", label: "Button goes to", type: "url" },
        ],
      },
      {
        key: "faq",
        icon: "info",
        label: "Questions & answers (FAQ)",
        description: "Short, clear answers to questions clients ask. Google and AI assistants (ChatGPT, Gemini, Perplexity) often quote these directly.",
        fields: [
          eyebrow,
          title,
          {
            name: "items",
            label: "Questions",
            type: "list",
            itemLabel: "Question",
            fields: [
              { name: "question", label: "Question", type: "text", help: "Write it the way a client would ask, e.g. \"Do you rent excavators with operators in Dubai?\"" },
              { name: "answer", label: "Answer", type: "textarea", rows: 3, help: "Answer directly in the first sentence (40–60 words is ideal)." },
            ],
          },
        ],
      },
      cta,
      seo,
    ],
  },
  {
    key: "about",
    label: "About page",
    path: "/about",
    description: "Your story, your principles and how you work.",
    sections: [
      heroBasic(true),
      {
        key: "story",
        icon: "book",
        label: "Who we are",
        fields: [eyebrow, title, paras(8), image(), imageAlt, { name: "quote", label: "Highlighted quote (optional)", type: "textarea", rows: 2 }],
      },
      { key: "pillars", icon: "brick", label: "What we stand for", fields: [eyebrow, title, iconItems("items", "Points", "Point")] },
      {
        key: "approach",
        icon: "route",
        label: "How we work (steps)",
        fields: [eyebrow, title, image(), iconItems("steps", "Steps", "Step")],
      },
      cta,
      seo,
    ],
  },
  {
    key: "businesses",
    label: "Our Businesses page",
    path: "/businesses",
    description: "The page listing all your services, plus the wording used on each service page.",
    sections: [
      heroBasic(true),
      {
        key: "note",
        icon: "crane",
        label: "Service cards",
        description: "The businesses themselves are edited under \"Businesses\" in the left menu.",
        fields: [{ name: "text", label: "Small note under the cards (optional)", type: "textarea", rows: 2 }],
      },
      {
        key: "detail",
        fixed: true,
        icon: "clipboard",
        label: "Wording on every service page",
        description: "Shared words shown on each individual service page.",
        fields: [
          { name: "eyebrow", label: "Small text above the service name", type: "text" },
          { name: "capabilitiesTitle", label: "Heading above the list of work", type: "text" },
          { name: "enquireTitle", label: "Side box heading", type: "text" },
          { name: "enquireText", label: "Side box text", type: "textarea", rows: 2 },
          { name: "enquireButton", label: "Side box button text", type: "text" },
          { name: "nextLabel", label: "\"Next service\" text", type: "text" },
          { name: "cardLinkLabel", label: "Link text on the service cards", type: "text" },
        ],
      },
      cta,
      seo,
    ],
  },
  {
    key: "presence",
    label: "Where we work",
    path: "/global-presence",
    description: "The page with the turning globe. The places on the globe are edited under \"Locations\".",
    sections: [
      {
        key: "hero",
        icon: "globe",
        label: "Top banner with globe",
        fields: [
          eyebrow,
          title,
          titleAccent,
          text(3, "Introduction"),
          { name: "hint", label: "Small hint under the globe", type: "text" },
          { name: "statCountries", label: "Counter text: countries", type: "text" },
          { name: "statLocations", label: "Counter text: locations", type: "text" },
          { name: "statRoutes", label: "Counter text: routes", type: "text" },
        ],
      },
      { key: "reach", icon: "pin", label: "Our reach", fields: [eyebrow, title, text(3), iconItems("points", "Highlights", "Highlight", 2)] },
      {
        key: "locations",
        icon: "layers",
        label: "List of locations",
        fields: [
          eyebrow,
          title,
          { name: "hqLabel", label: "Label for head office", type: "text" },
          { name: "officeLabel", label: "Label for offices", type: "text" },
          { name: "marketLabel", label: "Label for markets", type: "text" },
        ],
      },
      cta,
      seo,
    ],
  },
  {
    key: "vision",
    label: "Vision page",
    path: "/vision",
    description: "Your vision, mission and values.",
    sections: [
      heroBasic(true),
      {
        key: "banner",
        icon: "image",
        label: "Vision banner",
        description: "The approved vision picture (it has the words in it).",
        fields: [image("Banner photo"), { name: "imageAlt", label: "Words in the picture (for Google & blind visitors)", type: "text" }],
      },
      {
        key: "statement",
        icon: "target",
        label: "Vision & mission",
        fields: [
          { name: "visionLabel", label: "Vision: small title", type: "text" },
          { name: "vision", label: "Vision sentence", type: "textarea", rows: 3 },
          { name: "missionLabel", label: "Mission: small title", type: "text" },
          { name: "mission", label: "Mission sentence", type: "textarea", rows: 3 },
        ],
      },
      { key: "values", icon: "diamond", label: "Our values", fields: [eyebrow, title, iconItems("items", "Values", "Value")] },
      { key: "horizon", icon: "eye", label: "Looking ahead", fields: [eyebrow, title, text(5), image()] },
      cta,
      seo,
    ],
  },
  {
    key: "contact",
    label: "Contact page",
    path: "/contact",
    description: "The contact page and the wording of the enquiry form. Phone and email are edited under \"Phone, email & address\".",
    sections: [
      heroBasic(true),
      {
        key: "form",
        icon: "mail",
        label: "Enquiry form",
        fields: [
          { name: "title", label: "Form heading", type: "text" },
          { name: "name", label: "Name box label", type: "text" },
          { name: "email", label: "Email box label", type: "text" },
          { name: "phone", label: "Phone box label", type: "text" },
          { name: "company", label: "Company box label", type: "text" },
          { name: "interestLabel", label: "\"What do you need?\" label", type: "text" },
          { name: "generalOption", label: "First choice in that list", type: "text" },
          { name: "message", label: "Message box label", type: "text" },
          { name: "submitLabel", label: "Send button text", type: "text" },
          { name: "successTitle", label: "After sending: heading", type: "text" },
          { name: "successText", label: "After sending: message", type: "textarea", rows: 2 },
          { name: "privacyNote", label: "Small note beside the button", type: "textarea", rows: 2 },
        ],
      },
      {
        key: "details",
        fixed: true,
        icon: "phone",
        label: "Contact details box",
        description: "Phone, email and address themselves come from \"Phone, email & address\".",
        fields: [
          { name: "title", label: "Heading", type: "text" },
          { name: "text", label: "Text", type: "textarea", rows: 3 },
          { name: "addressLabel", label: "\"Address\" label", type: "text" },
          { name: "hoursLabel", label: "\"Opening hours\" label", type: "text" },
          { name: "mapLabel", label: "Map link text", type: "text" },
        ],
      },
      seo,
    ],
  },
];

export const getPageSchema = (key: string) => pageSchemas.find((p) => p.key === key);

/* ---------------- admin screens ----------------
   Each screen edits one content document. "Whole website" screens edit a few
   sections of the shared settings document. */

export type AdminView = {
  slug: string;
  label: string;
  icon: string;
  group: "pages" | "site";
  contentKey: string;
  sectionKeys?: string[];
  previewPath: string;
  hint: string;
};

export const adminViews: AdminView[] = [
  { slug: "home", label: "Home page", icon: "home", group: "pages", contentKey: "home", previewPath: "/", hint: "Banner, services, why choose us and more" },
  { slug: "about", label: "About page", icon: "users", group: "pages", contentKey: "about", previewPath: "/about", hint: "Your story and how you work" },
  { slug: "businesses", label: "Our Businesses page", icon: "excavator", group: "pages", contentKey: "businesses", previewPath: "/businesses", hint: "Page listing all business verticals" },
  { slug: "presence", label: "Where we work", icon: "globe", group: "pages", contentKey: "presence", previewPath: "/global-presence", hint: "Globe page" },
  { slug: "vision", label: "Vision page", icon: "eye", group: "pages", contentKey: "vision", previewPath: "/vision", hint: "Vision, mission and values" },
  { slug: "contact", label: "Contact page", icon: "mail", group: "pages", contentKey: "contact", previewPath: "/contact", hint: "Contact page and enquiry form" },
  { slug: "header", label: "Logo, menu & top bar", icon: "menu", group: "site", contentKey: "settings", sectionKeys: ["brand", "topbar", "navigation"], previewPath: "/", hint: "Logo, menu links, icons, header button" },
  { slug: "look", label: "Colours & fonts", icon: "star", group: "site", contentKey: "settings", sectionKeys: ["theme"], previewPath: "/", hint: "Colour templates and fonts" },
  { slug: "contact-info", label: "Phone, email & social", icon: "phone", group: "site", contentKey: "settings", sectionKeys: ["contact", "social"], previewPath: "/contact", hint: "Phone, email, WhatsApp, address, social links" },
  { slug: "footer", label: "Footer", icon: "layers", group: "site", contentKey: "settings", sectionKeys: ["footer"], previewPath: "/", hint: "Bottom of every page" },
  { slug: "labels", label: "Small words & messages", icon: "info", group: "site", contentKey: "settings", sectionKeys: ["labels"], previewPath: "/contact", hint: "Error messages, 404 page" },
  { slug: "google", label: "Google & SEO", icon: "search", group: "site", contentKey: "settings", sectionKeys: ["seo", "business", "tracking"], previewPath: "/", hint: "SEO, Google Maps details, Analytics & Search Console" },
];

export const getAdminView = (slug: string) => adminViews.find((v) => v.slug === slug);

/** Which admin screen edits a settings section (used by the click-to-edit preview). */
export const settingsViewFor = (sectionKey: string) => adminViews.find((v) => v.contentKey === "settings" && v.sectionKeys?.includes(sectionKey));
