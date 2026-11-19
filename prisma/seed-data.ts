// Business lines (services). Construction and earthmoving lead.
// Body text and "what we do" lists are draft copy for the client to refine in the admin.

export const verticals = [
  {
    slug: "construction-infrastructure",
    icon: "crane",
    title: "Construction & Infrastructure",
    summary: "Building works, civil works and infrastructure projects, planned and delivered by experienced site teams.",
    intro: "From foundations to finished structures, built with care and on schedule.",
    body:
      "Our construction teams handle building and civil works for commercial, residential and infrastructure projects.\n\nWe plan each job carefully, put the right crews and machines on site, and keep clients informed from the first day to handover.",
    capabilities: ["Building construction", "Civil works", "Infrastructure projects", "Site supervision & coordination"],
    image: "/media/stock/cranes-tower.webp",
    imageAlt: "Yellow tower crane beside a building under construction",
  },
  {
    slug: "earthmoving-site-works",
    icon: "bulldozer",
    title: "Earthmoving & Site Works",
    summary: "Site clearing, excavation, levelling, backfilling and haulage, done safely with the right machines.",
    intro: "Every good project starts with well-prepared ground.",
    body:
      "We prepare sites for building: clearing, excavation, cutting and filling, levelling and compaction, plus haulage of soil and materials.\n\nOur operators work with excavators, loaders, dozers and dump trucks to move material quickly and safely, ready for the next stage of work.",
    capabilities: ["Site clearing & demolition prep", "Excavation & trenching", "Cut, fill, levelling & compaction", "Soil & material haulage"],
    image: "/media/stock/earthmoving.webp",
    imageAlt: "Excavator loading soil into a dump truck on a construction site",
  },
  {
    slug: "equipment-rental-leasing",
    icon: "excavator",
    title: "Equipment Rental & Leasing",
    summary: "Excavators, loaders, trucks and other heavy machinery for hire, with or without operators.",
    intro: "The right machine, for as long as you need it.",
    body:
      "We rent and lease heavy machinery and equipment for short jobs and long projects.\n\nChoose the machines you need, with or without trained operators, and keep your capital free for the rest of your business.",
    capabilities: ["Excavators & loaders", "Dump trucks & haulage", "Short and long-term hire", "Machines with operators"],
    image: "/media/stock/haul-truck.webp",
    imageAlt: "Large yellow haul truck driving on a dusty site road",
  },
  {
    slug: "general-trading",
    icon: "box",
    title: "General Trading",
    summary: "Sourcing and supply of construction materials, industrial products and general goods.",
    intro: "Reliable supply, so your work never stops for materials.",
    body:
      "Our trading business sources and supplies construction materials, industrial products and general goods for companies across the region.\n\nWe handle procurement, storage and delivery so our clients can focus on their own operations.",
    capabilities: ["Construction materials", "Industrial products", "Procurement & sourcing", "Storage & delivery"],
    image: "/media/stock/warehouse.webp",
    imageAlt: "Warehouse aisles stacked with pallets and goods",
  },
  {
    slug: "property-development-real-estate",
    icon: "home",
    title: "Property Development & Real Estate",
    summary: "Property investment and development of quality residential and commercial spaces.",
    intro: "Well-built places that hold their value.",
    body:
      "We invest in and develop residential and commercial property, using our own construction know-how to deliver quality.\n\nWe focus on good locations, sound construction and spaces people enjoy using.",
    capabilities: ["Property investment", "Residential & commercial development", "Development management", "Leasing support"],
    image: "/media/stock/villa-pool.webp",
    imageAlt: "Modern white villa with a swimming pool",
  },
  {
    slug: "international-trade-exports",
    icon: "ship",
    title: "International Trade & Exports",
    summary: "Import and export of goods, with sourcing, shipping and paperwork handled for you.",
    intro: "Moving goods reliably between markets.",
    body:
      "Our international trade team buys, ships and delivers goods between the Gulf, India and other markets.\n\nWe take care of sourcing, documentation and logistics so every shipment arrives as planned.",
    capabilities: ["Import & export", "Overseas sourcing", "Shipping & logistics", "Trade documentation"],
    image: "/media/stock/port-cranes.webp",
    imageAlt: "Container ship being loaded by cranes at a busy port",
  },
  {
    slug: "engineering-services",
    icon: "ruler",
    title: "Engineering Services",
    summary: "CAD drafting, technical design and engineering drawings for construction and fabrication.",
    intro: "Clear, accurate drawings that sites can build from.",
    body:
      "Our engineering team prepares CAD drawings, technical designs and engineering documents.\n\nWe turn ideas into clear, checked drawings ready for approval, fabrication or construction.",
    capabilities: ["CAD drafting", "Technical design", "Shop & as-built drawings", "Engineering documents"],
    image: "/media/stock/engineers.webp",
    imageAlt: "Two engineers in hard hats checking work on site",
  },
  {
    slug: "artisanal-tiles-bespoke-designs",
    icon: "tile",
    title: "Artisanal Tiles & Bespoke Designs",
    summary: "Handmade patterned tiles in custom colours and designs, made for each client's space.",
    intro: "Colour and pattern made by hand.",
    body:
      "Inspired by the Athangudi tile-making tradition, our tiles are made by hand with colour and pattern built into every piece.\n\nWe work with owners, architects and designers to create patterns and colours that suit each space.",
    capabilities: ["Handmade patterned tiles", "Custom colours & patterns", "Work with architects & designers", "Heritage-inspired designs"],
    image: "/media/stock/tiles.webp",
    imageAlt: "Colourful handmade patterned tiles",
  },
  {
    slug: "heritage-wood-luxury-furnishings",
    icon: "pillar",
    title: "Heritage Wood & Luxury Furnishings",
    summary: "Hand-carved doors, pillars, screens and furniture for homes and buildings of character.",
    intro: "The beauty of hand-carved wood.",
    body:
      "We supply heritage woodwork: hand-carved doors, pillars, screens, furniture and architectural wood products.\n\nEach piece is made by skilled craftsmen and brings warmth and character to homes, offices and hospitality spaces.",
    capabilities: ["Hand-carved doors", "Pillars & screens", "Heritage & luxury furniture", "Architectural woodwork"],
    image: "/media/stock/mashrabiya.webp",
    imageAlt: "Intricately carved wooden doors and lattice windows",
  },
  {
    slug: "agriculture-livestock-operations",
    icon: "palm",
    title: "Agriculture & Livestock",
    summary: "Farming, plantations and livestock, run responsibly for the long term.",
    intro: "Working the land with patience and care.",
    body:
      "Our agriculture business covers cultivation, plantations and livestock.\n\nWe focus on responsible farming and steady, sustainable production.",
    capabilities: ["Crop cultivation", "Date palm & plantation care", "Livestock management", "Sustainable farming"],
    image: "/media/stock/date-palms.webp",
    imageAlt: "Grove of date palm trees",
  },
];

// UAE and India come from the supplied material. Others are hidden sample markets: edit or remove in the admin.
export const locations = [
  { city: "Dubai", country: "United Arab Emirates", kind: "hq", lat: 25.2048, lng: 55.2708, description: "Head office" },
  { city: "Chennai", country: "India", kind: "office", lat: 13.0827, lng: 80.2707, description: "Sourcing and trade coordination" },
  { city: "Karaikudi", country: "India", kind: "office", lat: 10.0735, lng: 78.7732, description: "Heritage woodwork and handmade tiles" },
  { city: "Riyadh", country: "Saudi Arabia", kind: "market", lat: 24.7136, lng: 46.6753, description: "Sample market: publish only if accurate", published: false },
  { city: "Singapore", country: "Singapore", kind: "market", lat: 1.3521, lng: 103.8198, description: "Sample market: publish only if accurate", published: false },
  { city: "London", country: "United Kingdom", kind: "market", lat: 51.5072, lng: -0.1276, description: "Sample market: publish only if accurate", published: false },
];
