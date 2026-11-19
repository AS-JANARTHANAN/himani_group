import type { Section } from "./content-schema";

const positions = ["center", "top", "bottom", "left", "right", "center 30%", "center 70%"].map((v) => ({ value: v, label: v }));

export const verticalSections: Section[] = [
  {
    key: "main",
    label: "Name, icon & short text", icon: "crane",
    fields: [
      { name: "title", label: "Service name", type: "text" },
      { name: "slug", label: "Web address", type: "text", help: "The page lives at /businesses/<this>. Leave empty to make it from the name.", advanced: true },
      { name: "icon", label: "Icon", type: "icon" },
      { name: "summary", label: "Short description", type: "textarea", rows: 3, help: "Shown on the service card and at the top of the service page." },
    ],
  },
  {
    key: "media",
    icon: "image",
    label: "Photo",
    fields: [
      { name: "image", label: "Photo", type: "image" },
      { name: "imageAlt", label: "Photo description (for Google)", type: "text", advanced: true },
      { name: "imagePosition", label: "Which part of the photo to keep in view", type: "select", options: positions, advanced: true },
    ],
  },
  {
    key: "detail",
    icon: "clipboard",
    label: "Service page text",
    fields: [
      { name: "intro", label: "Big opening sentence", type: "textarea", rows: 2 },
      { name: "body", label: "Main text", type: "textarea", rows: 8, help: "Leave one empty line between paragraphs." },
      { name: "capabilities", label: "List of work (with ticks)", type: "list", itemLabel: "Line", fields: [{ name: "text", label: "Text", type: "text" }] },
    ],
  },
  {
    key: "seo",
    advanced: true,
    icon: "search",
    label: "Google & link sharing",
    fields: [
      { name: "title", label: "Page title", type: "text", help: "Leave empty to use the vertical title." },
      { name: "description", label: "Meta description", type: "textarea", rows: 3 },
    ],
  },
];

export const locationSections: Section[] = [
  {
    key: "main",
    icon: "pin",
    label: "Location",
    description: "Easiest way to place it on the globe: find the place in Google Maps, copy the link from the browser's address bar, and paste it below. Or right-click the place in Google Maps, click the two numbers (they are copied) and paste those.",
    fields: [
      { name: "city", label: "City / name", type: "text" },
      { name: "country", label: "Country", type: "text" },
      {
        name: "kind",
        label: "Type",
        type: "select",
        options: [
          { value: "hq", label: "Headquarters (routes start here)" },
          { value: "office", label: "Office / operation" },
          { value: "market", label: "Market" },
        ],
      },
      { name: "description", label: "Short description", type: "text" },
      { name: "maps", label: "Google Maps link or position", type: "text", placeholder: "https://www.google.com/maps/place/…  or  25.2048, 55.2708", help: "Latitude and longitude below are filled in automatically when you save." },
      { name: "lat", label: "Latitude", type: "number", placeholder: "25.2048", advanced: true },
      { name: "lng", label: "Longitude", type: "number", placeholder: "55.2708", advanced: true },
    ],
  },
];

export const customPageSections: Section[] = [
  {
    key: "main",
    label: "Page header",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Web address", type: "text", help: "The page will live at /<this>. Leave empty to make it from the title." },
      { name: "eyebrow", label: "Eyebrow", type: "text" },
      { name: "intro", label: "Introduction", type: "textarea", rows: 3 },
      { name: "heroImage", label: "Header image (optional)", type: "image" },
    ],
  },
  {
    key: "content",
    label: "Content sections",
    fields: [
      {
        name: "sections",
        label: "Sections",
        type: "list",
        itemLabel: "Section",
        fields: [
          { name: "heading", label: "Heading", type: "text" },
          { name: "text", label: "Text", type: "textarea", rows: 6, help: "Separate paragraphs with a blank line." },
          { name: "image", label: "Image (optional)", type: "image" },
          { name: "imageAlt", label: "Image description", type: "text" },
        ],
      },
    ],
  },
  {
    key: "seo",
    advanced: true,
    icon: "search",
    label: "Google & link sharing",
    fields: [
      { name: "title", label: "Page title", type: "text" },
      { name: "description", label: "Meta description", type: "textarea", rows: 3 },
    ],
  },
];
