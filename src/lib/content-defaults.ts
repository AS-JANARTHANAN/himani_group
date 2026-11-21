// Starting content for every page, taken word for word from the approved
// Himani Group design and split into separate pages. Sections that are not in
// the design are kept (so nothing is lost) but hidden; switch them on in the admin.

import { DEFAULT_PRESET } from "./themes";

const S = (title: string, description: string, noindex = false) => ({ title, description, ogImage: "", noindex });

/** "Connect With Us" strip, as in the design. */
const cta = {
  eyebrow: "Connect With Us",
  title: "Let's Build What Comes Next.",
  text: "We welcome conversations about commercial opportunities, suppliers, and strategic partnerships.",
  buttonLabel: "Business Enquiries",
  buttonHref: "/contact",
  buttonIcon: "",
};

const hide = (...keys: string[]) => ({ sections: Object.fromEntries(keys.map((k) => [k, { hidden: true }])) });

const SUMMARY =
  "Himani Group represents a diversified business vision across trading, equipment rental and leasing, construction, real estate, engineering services, Artisanal Tiles & Bespoke Designs, Heritage Wood and Luxury Furnishings, and agricultural operations.";

export const contentDefaults: Record<string, any> = {
  settings: {
    brand: {
      name: "Himani Group",
      showName: true,
      fullName: "Himani Group",
      tagline: "Diversified Businesses. One Vision.",
      logo: "/brand/himani-logo.svg",
    },
    topbar: {
      show: false,
      items: [{ icon: "pin", text: "Dubai, United Arab Emirates", href: "" }],
      showSocial: true,
    },
    navigation: {
      links: [
        { label: "About Us", href: "/about", icon: "", hidden: false, newTab: false },
        { label: "Our Businesses", href: "/businesses", icon: "", hidden: false, newTab: false },
        { label: "Our Vision", href: "/vision", icon: "", hidden: false, newTab: false },
        { label: "Contact", href: "/contact", icon: "", hidden: false, newTab: false },
        { label: "Where We Work", href: "/global-presence", icon: "", hidden: true, newTab: false },
      ],
      ctaShow: true,
      ctaLabel: "Get in Touch",
      ctaHref: "/contact",
      ctaIcon: "",
      homeLabel: "Home",
      menuLabel: "Menu",
    },
    contact: {
      email: "",
      phone: "",
      whatsapp: "",
      address: "Dubai, United Arab Emirates",
      hours: "",
      mapUrl: "",
      whatsappButton: true,
      whatsappLabel: "Chat with us",
    },
    social: { instagram: "", linkedin: "", facebook: "", x: "", youtube: "", tiktok: "", snapchat: "", threads: "", showInFooter: true, showOnContact: true },
    theme: { preset: DEFAULT_PRESET.key, font: DEFAULT_PRESET.font, ...DEFAULT_PRESET.colors, gradient: false, baseSize: "16", headingScale: "100" },
    footer: {
      statement: "Connecting industries, cultivating opportunities, and shaping a future of sustainable growth through a diversified business vision.",
      buttonLabel: "Get in Touch",
      buttonHref: "/contact",
      showLinks: true,
      exploreTitle: "Company",
      businessesTitle: "Our Businesses",
      contactTitle: "Contact",
      copyright: "© {year} Himani Group. All rights reserved.",
    },
    labels: {
      notFoundEyebrow: "Error 404",
      notFoundTitle: "This page could not be found",
      notFoundText: "The page may have moved.",
      notFoundButton: "Back to home",
      scrollLabel: "Scroll",
      breadcrumbHome: "Home",
      sending: "Sending…",
      errName: "Please enter your name.",
      errEmail: "Please enter a valid email.",
      errMessage: "Please write a short message.",
      errTooMany: "Too many messages. Please try again in a few minutes.",
      errFix: "Please check the highlighted fields.",
      phoneLabel: "Phone",
      emailLabel: "Email",
      whatsappLabel: "WhatsApp",
      titleSuffix: " | Himani Group",
      cookieText: "We use cookies to understand how visitors use this website and to improve it. You can accept or decline analytics cookies.",
      cookieAccept: "Accept",
      cookieDecline: "Decline",
      cookieSettings: "Cookie settings",
      footerEnquiry: "Business Enquiries",
    },
    seo: {
      siteUrl: "",
      title: "Himani Group | Diversified Businesses. One Vision. | Dubai, UAE",
      description:
        "Himani Group, Dubai: a diversified business group in trading, equipment rental and leasing, construction, real estate, engineering services, artisanal tiles, heritage wood and agriculture.",
      serviceTitle: "{service} in Dubai | Himani Group",
      allowAI: true,
      aiSummary:
        SUMMARY +
        " With an emphasis on reliable relationships, practical solutions, and long-term value, it aims to connect opportunities and build enduring business capabilities. The group is based in Dubai, United Arab Emirates.",
      ogImage: "/media/design/himani-complex.webp",
      xHandle: "",
      locale: "en_AE",
    },
    business: {
      type: "Organization",
      street: "",
      city: "Dubai",
      region: "Dubai",
      postalCode: "",
      country: "AE",
      lat: "25.2048",
      lng: "55.2708",
      areaServed: "Dubai, United Arab Emirates",
      days: "",
      opens: "",
      closes: "",
      foundingYear: "",
      license: "",
    },
    tracking: { ga4: "", gtm: "", gsc: "", bing: "", metaPixel: "" },
  },

  home: {
    _layout: { order: ["hero", "ticker", "intro", "verticals", "strengths", "carousel", "presence", "vision", "faq", "cta"] },
    seo: S(
      "Himani Group | Diversified Businesses. One Vision. | Dubai, UAE",
      "Connecting industries, cultivating opportunities, and shaping a future of sustainable growth through a diversified business vision. Himani Group, Dubai."
    ),
    hero: {
      eyebrow: "Diversified Businesses. One Vision.",
      title: "Excellence in Every Endeavour.",
      titleAccent: "Vision Beyond Boundaries.",
      text: "Connecting industries, cultivating opportunities, and shaping a future of sustainable growth through a diversified business vision.",
      image: "/media/design/himani-complex.webp",
      imageAlt: "Himani Group architectural building",
      primaryLabel: "Explore Our Businesses",
      primaryHref: "/businesses",
      secondaryLabel: "Discover Our Story",
      secondaryHref: "/about",
    },
    ticker: { items: [] },
    intro: {
      eyebrow: "Who We Are",
      title: "A Vision That Spans Industries",
      text:
        SUMMARY +
        "\n\nWith an emphasis on reliable relationships, practical solutions, and long-term value, we aim to connect opportunities and build enduring business capabilities.",
      image: "/media/design/who-we-are-dubai.webp",
      imageAlt: "Dubai skyline",
      linkLabel: "",
      linkHref: "/about",
    },
    verticals: {
      eyebrow: "Explore Our Industries",
      title: "Our Business Verticals",
      text: "Distinct areas of enterprise united by a commitment to progress, quality, and long-term partnerships.",
      linkLabel: "",
    },
    strengths: {
      eyebrow: "Why Himani Group",
      title: "One group. Many strengths. One standard.",
      text: "Clients, suppliers and partners work with Himani Group because every business we run follows the same principles: reliable relationships, practical solutions, and long-term value.",
      image: "/media/design/property-development.webp",
      items: [
        { icon: "layers", title: "Diversified expertise", text: "Nine business verticals, from trading and construction to heritage craft and agriculture." },
        { icon: "handshake", title: "Trusted partnerships", text: "Long-term relationships with clients, suppliers and strategic partners." },
        { icon: "check", title: "Practical solutions", text: "Clear, workable answers to real commercial needs, delivered with care." },
        { icon: "target", title: "Long-term value", text: "Enduring business capabilities built for sustainable growth." },
      ],
    },
    carousel: {
      eyebrow: "A Closer Look",
      title: "Every Vertical,",
      titleAccent: "One Commitment.",
      text: "Swipe through our businesses, or let them move by. Tap any one to see what it offers.",
    },
    presence: {
      eyebrow: "Where We Work",
      title: "Rooted in Dubai.",
      titleAccent: "Connected Beyond Borders.",
      text: "From our base in the United Arab Emirates, Himani Group connects markets, suppliers and partners across the Gulf, India and beyond.",
      linkLabel: "See Where We Work",
      statVerticals: "Business verticals",
      statCountries: "Countries",
      statLocations: "Locations",
    },
    faq: {
      eyebrow: "Questions & Answers",
      title: "Frequently Asked Questions",
      items: [
        { question: "What does Himani Group do?", answer: SUMMARY },
        { question: "Where is Himani Group based?", answer: "Himani Group is based in Dubai, United Arab Emirates, with sourcing and trade links to India and other markets." },
        {
          question: "Does Himani Group rent or lease equipment?",
          answer: "Yes. Our Equipment Rental & Leasing vertical offers flexible rental and leasing solutions for machinery, equipment, and operational assets.",
        },
        {
          question: "Can Himani Group create bespoke tiles and heritage woodwork?",
          answer:
            "Yes. Our Artisanal Tiles & Bespoke Designs vertical creates bespoke tiles designed around each client's taste and architectural vision, and our Heritage Wood and Luxury Furnishings vertical supplies handcrafted wooden doors, pillars, furniture and architectural wood products.",
        },
        {
          question: "How can I partner with or supply to Himani Group?",
          answer: "We welcome conversations about commercial opportunities, suppliers, and strategic partnerships. Send a business enquiry through the Contact page and our team will reply.",
        },
      ],
    },
    vision: {
      eyebrow: "Our Vision",
      title: "Growing with Purpose.",
      titleAccent: "Advancing with Vision.",
      text: "To create lasting value through diversified enterprise, responsible operations, trusted partnerships, and the pursuit of new opportunities.",
      image: "/media/design/vision-banner.webp",
      showText: false,
      linkLabel: "",
      linkHref: "/vision",
    },
    cta,
  },

  about: {
    seo: S("About Himani Group | A Vision That Spans Industries | Dubai", SUMMARY),
    hero: {
      eyebrow: "About Us",
      title: "A Vision That Spans Industries",
      titleAccent: "",
      text: "Connecting industries, cultivating opportunities, and shaping a future of sustainable growth through a diversified business vision.",
      image: "/media/design/himani-complex.webp",
      imageAlt: "Himani Group architectural building",
    },
    story: {
      eyebrow: "Who We Are",
      title: "Diversified Businesses. One Vision.",
      text:
        SUMMARY +
        "\n\nWith an emphasis on reliable relationships, practical solutions, and long-term value, we aim to connect opportunities and build enduring business capabilities." +
        "\n\nFrom our base in Dubai, each of our verticals is led by people who know their field, and all of them share one way of working: listen first, plan clearly, and deliver what was agreed.",
      image: "/media/design/who-we-are-dubai.webp",
      imageAlt: "Dubai skyline",
      quote: "Excellence in Every Endeavour. Vision Beyond Boundaries.",
    },
    pillars: {
      eyebrow: "What We Stand For",
      title: "The Principles Behind Every Business",
      items: [
        { icon: "handshake", title: "Reliable relationships", text: "Partnerships built on trust with clients, suppliers and partners, and kept for the long term." },
        { icon: "check", title: "Practical solutions", text: "Clear, workable answers to real commercial needs, without unnecessary complexity." },
        { icon: "target", title: "Long-term value", text: "Enduring business capabilities and sustainable growth across every vertical we run." },
      ],
    },
    approach: {
      eyebrow: "How We Work",
      title: "From First Conversation to Lasting Partnership",
      image: "/media/design/engineering-services.webp",
      steps: [
        { icon: "users", title: "Listen", text: "We start by understanding the opportunity and what our clients and partners need." },
        { icon: "clipboard", title: "Plan", text: "We agree a clear, practical way forward: scope, responsibilities and timelines." },
        { icon: "briefcase", title: "Deliver", text: "The right vertical and the right people carry it through with care and quality." },
        { icon: "handshake", title: "Grow together", text: "We stay in touch and build on each success for the long term." },
      ],
    },
    cta,
  },

  businesses: {
    seo: S(
      "Our Business Verticals | Himani Group Dubai",
      "Trading, equipment rental and leasing, construction, property development, international trade, engineering services, artisanal tiles, heritage wood and agriculture: the business verticals of Himani Group, Dubai."
    ),
    hero: {
      eyebrow: "Explore Our Industries",
      title: "Our Business Verticals",
      titleAccent: "",
      text: "Distinct areas of enterprise united by a commitment to progress, quality, and long-term partnerships.",
      image: "/media/design/international-trade.webp",
      imageAlt: "International Trade & Exports representative image",
    },
    detail: {
      eyebrow: "Himani Group / Business Vertical",
      capabilitiesTitle: "What we do",
      enquireTitle: "Business Enquiries",
      enquireText: "We welcome conversations about commercial opportunities, suppliers, and strategic partnerships.",
      enquireButton: "Get in Touch",
      nextLabel: "Next business",
      cardLinkLabel: "",
    },
    note: { text: "Business imagery is illustrative. Woodwork photograph is adapted from the supplied Chettinad heritage brochure." },
    cta,
  },

  presence: {
    seo: S("Where We Work | Dubai, UAE & Beyond | Himani Group", "Himani Group is based in Dubai, United Arab Emirates, with sourcing and trade links to India and other markets."),
    hero: {
      eyebrow: "Where We Work",
      title: "Rooted in Dubai.",
      titleAccent: "Connected Beyond Borders.",
      text: "Our head office is in Dubai. Our teams, partners and suppliers connect the Gulf with India and other markets.",
      hint: "Drag the dial or tap a place to turn it",
      statCountries: "Countries",
      statLocations: "Locations",
      statRoutes: "Supply routes",
    },
    reach: {
      eyebrow: "Our Reach",
      title: "A Network Built on Partnerships",
      text: "Our verticals are supported by a network of suppliers, partners and specialists that brings each business what it needs.",
      points: [
        { icon: "ship", title: "Trade & exports", text: "Sourcing, shipping and overseas commercial relationships." },
        { icon: "excavator", title: "Equipment & projects", text: "Machinery, equipment and construction capability where it is needed." },
        { icon: "tile", title: "Craft sourcing", text: "Bespoke tiles and heritage woodwork from skilled artisans." },
        { icon: "handshake", title: "Partners", text: "Trusted suppliers and partners we work with again and again." },
      ],
    },
    locations: {
      eyebrow: "Locations",
      title: "Our network",
      hqLabel: "Head office",
      officeLabel: "Office",
      marketLabel: "Market",
    },
    cta,
  },

  vision: {
    _layout: hide("hero"),
    seo: S(
      "Our Vision | Growing with Purpose. Advancing with Vision. | Himani Group",
      "To create lasting value through diversified enterprise, responsible operations, trusted partnerships, and the pursuit of new opportunities."
    ),
    hero: {
      eyebrow: "Our Vision",
      title: "Growing with Purpose.",
      titleAccent: "Advancing with Vision.",
      text: "To create lasting value through diversified enterprise, responsible operations, trusted partnerships, and the pursuit of new opportunities.",
      image: "",
      imageAlt: "",
    },
    banner: {
      image: "/media/design/vision-banner.webp",
      imageAlt:
        "Our Vision. Growing with Purpose. Advancing with Vision. Building sustainable value across diverse sectors, with a long-term commitment to people, progress, and a better tomorrow.",
    },
    statement: {
      visionLabel: "Vision",
      vision: "To create lasting value through diversified enterprise, responsible operations, trusted partnerships, and the pursuit of new opportunities.",
      missionLabel: "Mission",
      mission: "To connect opportunities and build enduring business capabilities through reliable relationships, practical solutions, and long-term value.",
    },
    values: {
      eyebrow: "Our Values",
      title: "What Guides Every Vertical",
      items: [
        { icon: "handshake", title: "Trusted partnerships", text: "Relationships with clients, suppliers and partners that are built to last." },
        { icon: "shield", title: "Responsible operations", text: "Doing business the right way, with care for people and places." },
        { icon: "award", title: "Quality", text: "A commitment to progress and quality in everything we deliver." },
        { icon: "check", title: "Integrity", text: "Fair dealing and promises we keep." },
        { icon: "leaf", title: "Sustainable growth", text: "Long-term value over short-term gain." },
        { icon: "compass", title: "New opportunities", text: "Always looking ahead, ready for what comes next." },
      ],
    },
    horizon: {
      eyebrow: "Looking Ahead",
      title: "Building What Comes Next",
      text:
        "Himani Group continues to grow with purpose: strengthening each vertical, building new partnerships, and pursuing opportunities that create lasting value.\n\nFrom Dubai to the wider region and beyond, we are building enduring business capabilities for the years ahead.",
      image: "/media/design/property-development.webp",
    },
    cta,
  },

  contact: {
    seo: S(
      "Contact Himani Group | Business Enquiries | Dubai, UAE",
      "We welcome conversations about commercial opportunities, suppliers, and strategic partnerships. Contact Himani Group in Dubai."
    ),
    hero: {
      eyebrow: "Connect With Us",
      title: "Let's Build What Comes Next.",
      titleAccent: "",
      text: "We welcome conversations about commercial opportunities, suppliers, and strategic partnerships.",
      image: "/media/design/who-we-are-dubai.webp",
      imageAlt: "Dubai skyline",
    },
    form: {
      title: "Business Enquiries",
      name: "Full name",
      email: "Email",
      phone: "Phone",
      company: "Company",
      message: "Your message",
      interestLabel: "Area of interest",
      generalOption: "General enquiry",
      submitLabel: "Send Enquiry",
      successTitle: "Thank you!",
      successText: "We have received your enquiry and will be in touch shortly.",
      privacyNote: "We only use your details to reply to you.",
    },
    details: {
      title: "Get in Touch",
      text: "Call, email or message us. We reply to every business enquiry.",
      addressLabel: "Address",
      hoursLabel: "Opening hours",
      mapLabel: "Open in Google Maps",
    },
  },
};
