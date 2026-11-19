// Starting content for every page. Construction and earthmoving lead; the
// group's other business lines follow. Everything is editable in the admin.

import { DEFAULT_PRESET } from "./themes";

const S = (title: string, description: string) => ({ title, description, ogImage: "", noindex: false });

const cta = {
  eyebrow: "Start your project",
  title: "Have a site to clear, a road to build or machines to hire?",
  text: "Tell us what you need. Our team will come back to you with a clear plan and a quote.",
  buttonLabel: "Request a Quote",
  buttonHref: "/contact",
  buttonIcon: "arrow",
};

export const contentDefaults: Record<string, any> = {
  settings: {
    brand: {
      name: "Himani Group",
      showName: true,
      fullName: "Himani Group International",
      tagline: "Construction · Earthmoving · Equipment",
      logo: "/brand/logo-192.png",
    },
    topbar: {
      show: true,
      items: [
        { icon: "pin", text: "Dubai, United Arab Emirates", href: "" },
        { icon: "clock", text: "Sat – Thu · 8:00 – 18:00", href: "" },
        { icon: "hardhat", text: "Construction · Earthmoving · Equipment Rental", href: "/businesses" },
      ],
      showSocial: true,
    },
    navigation: {
      links: [
        { label: "About", href: "/about", icon: "", hidden: false, newTab: false },
        { label: "Services", href: "/businesses", icon: "", hidden: false, newTab: false },
        { label: "Where We Work", href: "/global-presence", icon: "", hidden: false, newTab: false },
        { label: "Vision", href: "/vision", icon: "", hidden: false, newTab: false },
        { label: "Contact", href: "/contact", icon: "", hidden: false, newTab: false },
      ],
      ctaShow: true,
      ctaLabel: "Get a Quote",
      ctaHref: "/contact",
      ctaIcon: "hardhat",
      homeLabel: "Home",
      menuLabel: "Menu",
    },
    contact: {
      email: "",
      phone: "",
      whatsapp: "",
      address: "Dubai, United Arab Emirates",
      hours: "Saturday – Thursday, 8:00 – 18:00",
      mapUrl: "",
      whatsappButton: true,
      whatsappLabel: "Chat with us",
    },
    social: { instagram: "", linkedin: "", facebook: "", x: "", youtube: "", tiktok: "", snapchat: "", threads: "", showInFooter: true, showOnContact: true },
    theme: { preset: DEFAULT_PRESET.key, font: DEFAULT_PRESET.font, ...DEFAULT_PRESET.colors, accentOnDark: DEFAULT_PRESET.colors.accent, gradient: false, baseSize: "16", headingScale: "100" },
    footer: {
      statement: "Groundwork to handover. Machines, people and know-how for projects across the UAE and beyond.",
      exploreTitle: "Company",
      businessesTitle: "Services",
      contactTitle: "Contact",
      copyright: "© {year} Himani Group. All rights reserved.",
    },
    labels: {
      notFoundEyebrow: "Error 404",
      notFoundTitle: "This page could not be found",
      notFoundText: "The page may have moved. Let's get you back on site.",
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
    },
    seo: {
      siteUrl: "",
      title: "Construction & Earthmoving Company in Dubai | Himani Group",
      description:
        "Himani Group is a Dubai-based construction and earthmoving company: excavation, site works, civil works and heavy equipment rental across the UAE.",
      serviceTitle: "{service} in Dubai | Himani Group",
      allowAI: true,
      aiSummary:
        "Himani Group is a construction and earthmoving company based in Dubai, United Arab Emirates. It provides construction and civil works, earthmoving and site preparation (clearing, excavation, levelling, haulage) and heavy equipment rental with or without operators across the UAE. The group also runs general trading, property development, international trade, engineering drafting, handmade artisanal tiles, heritage woodwork and agriculture businesses.",
      ogImage: "/media/stock/hero-excavator.webp",
      xHandle: "",
      locale: "en_AE",
    },
    business: {
      type: "GeneralContractor",
      street: "",
      city: "Dubai",
      region: "Dubai",
      postalCode: "",
      country: "AE",
      lat: "25.2048",
      lng: "55.2708",
      areaServed: "Dubai, Abu Dhabi, Sharjah, United Arab Emirates",
      days: "sat-thu",
      opens: "08:00",
      closes: "18:00",
      foundingYear: "",
      license: "",
    },
    tracking: { ga4: "", gtm: "", gsc: "", bing: "", metaPixel: "" },
  },

  home: {
    seo: S(
      "Construction & Earthmoving Company in Dubai | Himani Group",
      "Dubai construction and earthmoving company. Excavation, site preparation, civil works and heavy equipment rental across the UAE. Request a free quote."
    ),
    hero: {
      eyebrow: "Construction · Earthmoving · Equipment",
      title: "We Move Earth.",
      titleAccent: "We Build What Lasts.",
      text: "Site clearing, excavation, civil works and heavy machinery, delivered by one dependable team, together with the trading, property and specialist businesses of Himani Group.",
      image: "/media/stock/hero-excavator.webp",
      imageAlt: "Yellow excavator digging against a clear blue sky",
      primaryLabel: "Our Services",
      primaryHref: "/businesses",
      primaryIcon: "arrow",
      secondaryLabel: "Request a Quote",
      secondaryHref: "/contact",
      highlights: [
        { icon: "excavator", text: "Excavation & Earthmoving", href: "/businesses/earthmoving-site-works" },
        { icon: "crane", text: "Construction & Civil Works", href: "/businesses/construction-infrastructure" },
        { icon: "dumptruck", text: "Equipment Rental", href: "/businesses/equipment-rental-leasing" },
        { icon: "hardhat", text: "Safe, Supervised Sites", href: "/about" },
      ],
    },
    ticker: { items: [] },
    intro: {
      eyebrow: "Who We Are",
      title: "One team from the first dig to the final handover",
      text:
        "Himani Group brings together construction, earthmoving and heavy equipment under one roof. We prepare the ground, move the material, supply the machines and build the structures that follow.\n\nAlongside our site work, the group runs trading, property, engineering, export, artisanal tile, heritage wood and agricultural businesses, so clients can rely on one partner for much more than a single job.",
      image: "/media/stock/site-crew.webp",
      imageAlt: "Site engineers in high-visibility vests reviewing an excavation",
      badgeTitle: "10",
      badgeText: "business lines, one team",
      linkLabel: "More about us",
      linkHref: "/about",
    },
    verticals: {
      eyebrow: "What We Do",
      title: "Our Services",
      text: "From heavy groundwork to fine finishing materials. Choose a service to see what we can do for you.",
      linkLabel: "See all services",
    },
    strengths: {
      eyebrow: "Why Himani",
      title: "Built for tough sites and tight deadlines",
      text: "Clients come back to us because the work gets done properly, safely and when we said it would.",
      image: "/media/stock/earthmoving.webp",
      items: [
        { icon: "hardhat", title: "Safety first", text: "Trained crews, clear site rules and supervision on every job." },
        { icon: "excavator", title: "Machines ready to work", text: "Excavators, loaders and trucks available for short or long hire." },
        { icon: "clipboard", title: "Clear planning", text: "Agreed scope, timeline and cost before work starts." },
        { icon: "handshake", title: "One partner", text: "Groundwork, construction, materials and equipment from one group." },
      ],
    },
    presence: {
      eyebrow: "Where We Work",
      title: "Based in the UAE.",
      titleAccent: "Working wherever the job is.",
      text: "From our base in Dubai we take on projects and supply partners across the region, with sourcing links to India and beyond.",
      linkLabel: "See our locations",
      statVerticals: "Services",
      statCountries: "Countries",
      statLocations: "Locations",
    },
    faq: {
      eyebrow: "Questions & Answers",
      title: "Frequently asked questions",
      items: [
        {
          question: "What construction services does Himani Group offer in Dubai?",
          answer:
            "Himani Group offers construction and civil works, earthmoving and site preparation (clearing, excavation, levelling, compaction and haulage) and heavy equipment rental in Dubai and across the UAE. The group also supplies construction materials through its trading business.",
        },
        {
          question: "Can I rent an excavator or dump truck with an operator?",
          answer:
            "Yes. Excavators, loaders, dump trucks and other heavy machinery can be hired with or without a trained operator, for short jobs or long projects. Contact the team with your site location and dates for a quote.",
        },
        {
          question: "Which areas do you work in?",
          answer: "Himani Group is based in Dubai and works across the United Arab Emirates, including Dubai, Abu Dhabi and Sharjah.",
        },
        {
          question: "How do I get a quote for my project?",
          answer:
            "Send the enquiry form on the Contact page, call or message on WhatsApp with the site location, the type of work and your timeline. The team replies with a plan and a quote.",
        },
        {
          question: "Do you prepare the site before building starts?",
          answer:
            "Yes. Site preparation is a core service: clearing, excavation and trenching, cut and fill, levelling and compaction, and removal of soil and materials, so the ground is ready for foundations.",
        },
      ],
    },
    vision: {
      eyebrow: "Our Vision",
      title: "Strong foundations.",
      titleAccent: "Lasting results.",
      text: "To be the partner contractors and developers call first, for honest work, reliable machines and projects that stand the test of time.",
      image: "/media/stock/dubai-sunset.webp",
      linkLabel: "Read our vision",
      linkHref: "/vision",
    },
    cta,
  },

  about: {
    seo: S("About Himani Group | Construction Company in Dubai, UAE", "Meet Himani Group, a Dubai construction and earthmoving company built on safety, quality and honest work, with trading, property and engineering businesses."),
    hero: {
      eyebrow: "About Us",
      title: "Ground-up builders.",
      titleAccent: "Straight-talking partners.",
      text: "A multi-business group with construction and earthmoving at its core.",
      image: "/media/stock/aerial-site.webp",
      imageAlt: "Aerial view of heavy equipment working on a quarry site",
    },
    story: {
      eyebrow: "Our Story",
      title: "Built on hard work and kept promises",
      text:
        "Himani Group started with a simple idea: do the heavy work properly. Today our teams handle site preparation, excavation, earthmoving and construction, and supply the machines that keep projects moving.\n\nAround that core we have grown trading, property, engineering, export, artisanal tile, heritage wood and agricultural businesses. Each one has its own specialists, and all of them follow the same rule: do what you said you would do.\n\nWhether you need one machine for a week or a full team for a full project, you deal with people who know the work.",
      quote: "Good projects start in the ground. We make sure that part is done right.",
    },
    pillars: {
      eyebrow: "What We Stand For",
      title: "Three things we never compromise on",
      items: [
        { icon: "hardhat", title: "Safety", text: "Every person goes home safe. Site rules, trained operators and proper equipment come first." },
        { icon: "check", title: "Quality", text: "We measure, check and finish properly, because rework costs everyone time and money." },
        { icon: "handshake", title: "Honesty", text: "Clear prices, clear timelines and straight answers, from the first call to handover." },
      ],
    },
    approach: {
      eyebrow: "How We Work",
      title: "Four simple steps",
      image: "/media/stock/rebar-inspection.webp",
      steps: [
        { icon: "clipboard", title: "Survey & plan", text: "We visit the site, understand the job and agree the scope, timeline and price." },
        { icon: "excavator", title: "Mobilise", text: "The right crew and machines arrive on site, ready to start." },
        { icon: "crane", title: "Build", text: "We carry out the work with daily supervision and clear progress updates." },
        { icon: "check", title: "Hand over", text: "Final checks, a clean site and a handover you can be proud of." },
      ],
    },
    cta,
  },

  businesses: {
    seo: S("Construction & Earthmoving Services in Dubai | Himani Group", "Construction, earthmoving, site works, heavy equipment rental, trading, property and engineering services in Dubai and across the UAE."),
    hero: {
      eyebrow: "Our Services",
      title: "Everything your project needs",
      titleAccent: "",
      text: "Heavy site work at the core, supported by trading, property, engineering and specialist craft businesses.",
      image: "/media/stock/cranes-sunset.webp",
      imageAlt: "Tower cranes over a building site at sunset",
    },
    detail: {
      eyebrow: "Himani Group Service",
      capabilitiesTitle: "What we do",
      enquireTitle: "Need this service?",
      enquireText: "Tell us about your project and we will reply with a plan and a quote.",
      enquireButton: "Request a Quote",
      nextLabel: "Next service",
      cardLinkLabel: "View service",
    },
    note: { text: "" },
    cta,
  },

  presence: {
    seo: S("Where We Work: Dubai, UAE & Beyond | Himani Group", "Himani Group is based in Dubai and works across the UAE, with sourcing and trade links to India and other markets."),
    hero: {
      eyebrow: "Where We Work",
      title: "Based in the UAE.",
      titleAccent: "Working wherever the job is.",
      text: "Our head office is in Dubai. Our teams, partners and suppliers connect the Gulf with India and other markets.",
      hint: "Drag the globe to turn it · Tap a place to zoom in",
      statCountries: "Countries",
      statLocations: "Locations",
      statRoutes: "Supply routes",
    },
    reach: {
      eyebrow: "Our Reach",
      title: "Local crews, wider network",
      text: "Projects are run by local teams, backed by a supply network that brings in the materials and products each job needs.",
      points: [
        { icon: "excavator", title: "Site teams", text: "Crews and machines for groundwork and construction across the region." },
        { icon: "ship", title: "Trade & supply", text: "Sourcing, shipping and delivery of materials and goods." },
        { icon: "tile", title: "Craft sourcing", text: "Handmade tiles and heritage woodwork from South India." },
        { icon: "handshake", title: "Partners", text: "Trusted suppliers and subcontractors we work with again and again." },
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
    seo: S("Our Vision & Values | Himani Group Dubai", "The vision, mission and values behind Himani Group, a construction and earthmoving company in Dubai, UAE."),
    hero: {
      eyebrow: "Our Vision",
      title: "Strong foundations.",
      titleAccent: "Lasting results.",
      text: "What drives us, and the standards we work to every day.",
      image: "/media/stock/dubai-blue.webp",
      imageAlt: "Dubai skyline under a bright blue sky",
    },
    statement: {
      visionLabel: "Vision",
      vision: "To be the partner contractors and developers call first, for honest work, reliable machines and projects that last.",
      missionLabel: "Mission",
      mission: "To prepare the ground, supply the equipment and build with care, safely, on time and at a fair price.",
    },
    values: {
      eyebrow: "Our Values",
      title: "How we behave on every site",
      items: [
        { icon: "hardhat", title: "Safety", text: "No job is so urgent that it cannot be done safely." },
        { icon: "check", title: "Quality", text: "Measured, checked and finished properly." },
        { icon: "shield", title: "Integrity", text: "Fair prices and promises we keep." },
        { icon: "users", title: "Teamwork", text: "Crews, clients and suppliers working as one team." },
        { icon: "clock", title: "On time", text: "We plan carefully and respect deadlines." },
        { icon: "recycle", title: "Responsibility", text: "Clean sites and care for the environment around them." },
      ],
    },
    horizon: {
      eyebrow: "Looking Ahead",
      title: "Growing with the region",
      text: "As the Gulf keeps building, we keep investing in machines, people and partnerships so we are ready for bigger and more demanding projects.",
      image: "/media/stock/cranes-tower.webp",
    },
    cta,
  },

  contact: {
    seo: S("Contact Himani Group | Get a Construction Quote in Dubai", "Call, email or WhatsApp Himani Group in Dubai for construction, earthmoving and equipment rental quotes. We reply the same working day."),
    hero: {
      eyebrow: "Contact Us",
      title: "Let's talk about your project",
      titleAccent: "",
      text: "Send us a few details and our team will get back to you quickly.",
      image: "/media/stock/dump-unload.webp",
      imageAlt: "Dump truck unloading sand on a construction site",
    },
    form: {
      title: "Send an enquiry",
      name: "Full name",
      email: "Email",
      phone: "Phone",
      company: "Company",
      message: "Tell us about your project",
      interestLabel: "What do you need?",
      generalOption: "General enquiry",
      submitLabel: "Send Enquiry",
      successTitle: "Thank you!",
      successText: "We have received your enquiry. Our team will contact you shortly.",
      privacyNote: "We only use your details to reply to you.",
    },
    details: {
      title: "Talk to our team",
      text: "Call, email or message us on WhatsApp. We usually reply the same working day.",
      addressLabel: "Address",
      hoursLabel: "Opening hours",
      mapLabel: "Open in Google Maps",
    },
  },
};
