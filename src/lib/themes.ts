// Ready-made colour templates. Picking one in the admin copies its colours into
// Site → Colours & fonts, where every colour can still be adjusted by hand.

export type ThemeColors = {
  dark: string; // header, footer and dark sections
  accent: string; // buttons, icons, highlight lines
  onAccent: string; // text on top of the highlight colour
  accentText: string; // highlight-coloured text on white/light backgrounds (must stay readable)
  light: string; // light section background
  paper: string; // page background
  text: string; // body text
  accentOnDark?: string; // highlight colour for text on dark backgrounds (defaults to accent)
};

export type Preset = { key: string; label: string; description: string; font: string; colors: ThemeColors; gradient?: boolean };

export const PRESETS: Preset[] = [
  {
    key: "site-yellow",
    label: "Site Yellow",
    description: "Night-blue and machine yellow. Bold and industrial, like heavy equipment on site.",
    font: "industrial",
    colors: { dark: "#0f1824", accent: "#ffc21a", onAccent: "#0f1824", accentText: "#9a6200", light: "#f2f4f7", paper: "#ffffff", text: "#1c2430" },
  },
  {
    key: "royal-orange",
    label: "Royal Blue & Orange",
    description: "Deep royal blue with a bright safety orange. Strong contrast, corporate and energetic.",
    font: "modern",
    colors: { dark: "#0a2a6b", accent: "#ff6a13", onAccent: "#ffffff", accentText: "#c2410c", light: "#eef3fb", paper: "#ffffff", text: "#162033" },
  },
  {
    key: "desert-red",
    label: "Desert Sand & Red",
    description: "Warm dark brown, desert sand and a rich Arabian red. Warm and premium.",
    font: "bold",
    colors: { dark: "#2a1712", accent: "#d7262f", onAccent: "#ffffff", accentText: "#b4161f", light: "#f7efe3", paper: "#fffdf9", text: "#2b211c" },
  },
  {
    key: "heritage-green",
    label: "Heritage Green & Gold",
    description: "Deep forest green with shiny champagne-gold buttons and warm cream, with elegant serif headings.",
    font: "classic",
    gradient: true,
    colors: { dark: "#052c23", accent: "#c69b42", onAccent: "#03211a", accentText: "#a67d2c", light: "#f8f3e8", paper: "#fdfbf6", text: "#17241f", accentOnDark: "#e8cd86" },
  },
];

export const DEFAULT_PRESET = PRESETS[0];

export const FONT_OPTIONS = [
  { value: "industrial", label: "Industrial: tall, strong headings (Barlow Condensed)" },
  { value: "modern", label: "Modern: clean, geometric headings (Space Grotesk)" },
  { value: "bold", label: "Bold: heavy, wide headings (Archivo)" },
  { value: "classic", label: "Classic: elegant serif headings (Cormorant Garamond)" },
];

export const getPreset = (key?: string) => PRESETS.find((p) => p.key === key);
