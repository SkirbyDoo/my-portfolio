export const DEFAULT_CONTENT = {
  navigation: {
    logo: 'Justi Design',
    links: [
      { label: 'Home',          href: '/' },
      { label: 'Services',      href: '#services' },
      { label: 'Pricing',       href: '#pricing' },
      { label: 'Work',          href: '#portfolio' },
      { label: 'About',         href: '#about' },
      { label: 'Testimonials',  href: '#testimonials' },
      { label: 'Contact',       href: '#contact' },
    ],
    ctaLabel: 'Start a Project',
    ctaHref: '#contact',
  },

  hero: {
    badge: 'Available for new projects',
    headline: 'Websites that turn visitors into customers.',
    subheadline: 'I design and build fast, modern sites for small businesses and growing brands — built to convert, easy for you to edit, and deployed in days, not months.',
    ctaLabel: 'See Pricing',
    ctaHref: '#pricing',
    secondaryLabel: 'View My Work',
    secondaryHref: '#portfolio',
    backgroundImage: '',
    visible: true,
  },

  about: {
    badge: 'About',
    headline: 'A designer who actually ships.',
    body: 'I help small businesses and independent operators get a professional online presence without the agency price tag or 6-month timelines. Every site comes with a built-in admin panel so you can edit your own content — no developer needed for updates. I work fast, communicate clearly, and stand behind everything I ship.',
    image: '',
    stats: [
      { value: '20+', label: 'Sites shipped' },
      { value: '< 2wk', label: 'Typical turnaround' },
      { value: '100%', label: 'Client editable' },
    ],
    visible: true,
  },

  services: {
    badge: 'Services',
    headline: 'What I build',
    subheadline: 'Modern websites built on a stack you can actually maintain.',
    items: [
      { id: '1', icon: 'Globe', title: 'Custom Websites', description: 'Bespoke marketing sites designed around your brand and your customers — not a templated theme.' },
      { id: '2', icon: 'Smartphone', title: 'Mobile-First Design', description: 'Every site looks and works great on phones, tablets, and desktops. No exceptions, no excuses.' },
      { id: '3', icon: 'Settings', title: 'Self-Serve Admin Panel', description: 'Edit your own content, prices, photos, and team info — no developer required for updates.' },
      { id: '4', icon: 'Zap', title: 'Fast & SEO-Ready', description: 'Built on Vite and React for sub-second load times, with clean semantic HTML and meta tags out of the box.' },
      { id: '5', icon: 'Headphones', title: 'Hands-On Support', description: 'I personally onboard you on the admin panel and stay available for questions after launch.' },
      { id: '6', icon: 'Code', title: 'Custom Features', description: 'Booking forms, calculators, integrations, e-commerce — if you can describe it, I can probably build it.' },
    ],
    visible: true,
  },

  pricing: {
    badge: 'Pricing',
    headline: 'Simple, project-based pricing',
    subheadline: 'No retainers, no surprise fees. Pick the tier that fits — pay once, own the site forever.',
    tiers: [
      {
        id: '1',
        name: 'Starter',
        price: '$1,500',
        billing: 'one-time',
        description: 'For solo operators and new businesses who need to look credible online — fast.',
        features: [
          'Up to 5 pages',
          'Mobile-first responsive design',
          'Self-editing content dashboard — edit text and swap images yourself',
          'Custom color + font theming',
          'Contact form (managed service — no backend to break)',
          'Social media integration',
          'Basic SEO setup',
          '2 rounds of revisions',
          'From 14-day turnaround',
          '30 days of free support',
        ],
        ctaLabel: 'Start a Project',
        ctaHref: '#contact',
        popular: false,
      },
      {
        id: '2',
        name: 'Standard',
        price: '$3,500',
        billing: 'one-time',
        description: 'For growing businesses that want more room, stronger search rankings, and a premium custom design that stands out.',
        features: [
          'Everything in Starter, plus:',
          'Up to 10 pages',
          'Advanced SEO — keyword optimization, sitemap & search-engine submission',
          'Premium animated hero + custom-designed sections',
          'Image uploads + automatic content history',
          'Up to 4 rounds of revisions during build',
          'From 21-day turnaround',
          '30 days of bug-fix support (fixing things that break — new features quoted separately)',
        ],
        ctaLabel: 'Start a Project',
        ctaHref: '#contact',
        popular: true,
      },
      {
        id: '3',
        name: 'Premium',
        price: 'From $7,500',
        billing: 'custom quote',
        description: 'Custom features built on proven platforms.',
        features: [
          'Everything in Standard',
          'E-commerce via Shopify or Stripe-hosted Checkout (never touches card data)',
          'Booking/scheduling via Cal.com or Calendly embed',
          'Blog or news section',
          'Third-party integrations (email marketing, CRM, etc.)',
          'Analytics setup (Google Analytics or Plausible — paste-in, not custom-built)',
          '60 days of bug-fix support',
          'Priority response',
        ],
        ctaLabel: 'Get a Quote',
        ctaHref: '#contact',
        popular: false,
      },
    ],
    hostingPlan: {
      enabled: true,
      badge: 'Highly Recommended',
      name: 'Hosting & Care Plan',
      price: '$49',
      billing: '/month',
      description: 'Skip the tech headache. We handle hosting, backups, security, and updates for you — so you never have to set up, pay for, or babysit any of it yourself. You also get every future dashboard upgrade automatically, free.',
      features: [
        'Managed hosting + SSL certificate',
        'Security monitoring & software updates',
        'All future dashboard updates & new features',
        'Ongoing support + small content tweaks',
        'Uptime monitoring & quick fixes',
        'Cancel anytime',
      ],
      ctaLabel: 'Add Plan',
      ctaHref: '#contact',
    },
    footnote: 'Need something added later? New pages, features, and updates are always quoted up front — flat pricing, no surprises.',
    visible: true,
  },

  portfolio: {
    badge: 'Selected Work',
    headline: 'Recent projects',
    subheadline: 'A sample of sites I\'ve designed and built for clients across different industries.',
    items: [
      { id: '1', title: 'CityHoops League', category: 'Rec Sports', description: 'Full league management site with season stats, division pages, and a player-editable admin panel.', image: '', link: '/work/cityhoops' },
      { id: '2', title: 'Quick Quote Calculator', category: 'Service Business', description: 'Interactive pricing calculator that generates instant quotes for a screen-printing shop.', image: '', link: '/work/quick-quote' },
      { id: '3', title: 'Tee Rabbit', category: 'Custom Apparel · Web App', description: 'A custom-apparel site with an in-browser t-shirt designer, browsable catalogs, and a live trust-index of real customer reviews.', image: '', link: '/work/teerabbit' },
    ],
    visible: true,
  },

  testimonials: {
    badge: 'Clients',
    headline: 'What clients are saying',
    items: [
      { id: '1', quote: 'Justi turned around our site faster than we thought possible — and the admin panel means we don\'t have to call him every time we want to change a price. Worth every penny.', name: 'Sample Client', company: 'Service Business Owner', image: '' },
      { id: '2', quote: 'I came in with a vague idea and walked away with a site that looks more professional than competitors who spent 10x as much. Communication was excellent throughout.', name: 'Sample Client', company: 'Small Business Founder', image: '' },
      { id: '3', quote: 'The post-launch support was a game changer. Real responses, real fixes — not a ticket queue.', name: 'Sample Client', company: 'Repeat Client', image: '' },
    ],
    visible: true,
  },

  contact: {
    badge: 'Get in Touch',
    headline: 'Let\'s talk about your project',
    subheadline: 'Tell me what you\'re building and I\'ll get back to you within 24 hours with a quote and a timeline.',
    phone: '',
    email: 'hello@justi.design',
    address: 'Hayward, CA — available remote',
    visible: true,
  },

  footer: {
    logo: 'Justi Design',
    tagline: 'Websites that convert. Built fast, owned by you.',
    socialLinks: [],
    columns: [
      {
        heading: 'Work',
        links: [
          { label: 'Services',     href: '#services' },
          { label: 'Pricing',      href: '#pricing' },
          { label: 'Portfolio',    href: '#portfolio' },
          { label: 'Testimonials', href: '#testimonials' },
        ],
      },
      {
        heading: 'Get Started',
        links: [
          { label: 'Start a Project', href: '#contact' },
          { label: 'About',           href: '#about' },
        ],
      },
    ],
    copyright: 'Â© 2026 Justi Design. All rights reserved.',
  },

  page_labels: {
    home: 'Home Page',
  },

  // NOTE: Custom block-pages added via /admin → Pages live here.
  custom_pages: {
    pages: [],
  },

  // CityHoops case study — HYBRID page: the LAYOUT is hard-coded in
  // src/pages/CityHoops.jsx (routed at /work/cityhoops), but all the COPY,
  // numbers, and images below are editable in the dashboard
  // (/admin → Case Studies → CityHoops). These values are the fallback/seed.
  casestudy_cityhoops: {
    eyebrow: 'Rec Sports League · Website Redesign & League Platform',
    title: 'CityHoops League',
    summary: 'Turning a busy, image-heavy league site into a fast, mobile-first platform with live schedules and real player stats.',
    liveUrl: '', // shows a "Visit Live Site" button when set

    overviewHeading: 'Overview',
    overviewBody: 'CityHoops is a Bay Area recreational basketball community running multiple weekly leagues — Sunday Family, Friday G-League, Monday Elite and more — across eight city teams. They needed one home online where players, parents, and organizers could find schedules, standings, and stats without digging through group chats or squinting at screenshots.',
    teams: ['Oakland', 'Hayward', 'San Jose', 'Tracy', 'Fremont', 'Union City', 'San Ramon', 'Daly City'],

    challengeHeading: 'The Challenge',
    challengeBody: 'The original site leaned on heavy banner graphics, and every season\'s schedule was posted as a flat image file — players had to open a picture and squint to find their game time. Stats weren\'t tracked online at all, and updating anything meant re-exporting and re-uploading a new graphic. The navigation was a long, crowded menu that buried what people actually came for.',

    builtHeading: 'What I Built',
    built: [
      'A clean, mobile-first redesign with a focused homepage — no more wall of banner graphics',
      'A live, interactive season schedule with real week-by-week tables (not a screenshot of a spreadsheet)',
      'A sortable player-stats leaderboard — points, rebounds, assists, steals, blocks, and threes',
      'Filtering by team so players can jump straight to their squad across all divisions',
      'A layout that actually works on a phone — for checking scores and matchups courtside',
    ],

    scheduleHeading: 'Schedule: from a static image to live tables',
    statsHeading: 'A brand-new player stats leaderboard',
    statsBody: 'Something the old site never had — a sortable leaderboard tracking every player across six stat categories, filterable by team.',

    highlightsHeading: 'Highlights',
    highlights: [
      { value: '8', label: 'teams tracked live across the league' },
      { value: '6', label: 'player stat categories, sortable in real time' },
      { value: '0', label: 'screenshots — schedules are now live data, not images' },
    ],

    ctaHeading: 'Want something like this?',
    ctaBody: 'I build sites your team can actually run themselves. Let\'s talk about your project.',
    ctaLabel: 'Start a Project',
    ctaHref: '/#pricing',

    // Image URLs. When blank, the page falls back to /case-studies/cityhoops/*.png
    // (files you drop into the public folder). Uploads from the dashboard fill these.
    images: {
      oldHome: '',
      oldSchedule: '',
      newHome: '',
      newSchedule: '',
      newStats: '',
    },
  },

  // Quick Quote Calculator case study — HYBRID page: the LAYOUT is hard-coded in
  // src/pages/QuickQuote.jsx (routed at /work/quick-quote), but all the COPY,
  // numbers, and images below are editable in the dashboard
  // (/admin → Case Studies → Quick Quote). These values are the fallback/seed.
  casestudy_quickquote: {
    eyebrow: 'Service Business · Pricing Tool / Web App',
    title: 'Quick Quote Calculator',
    summary: 'An instant pricing calculator for screen printers — customers get an on-the-spot estimate, and every option and price is controlled from a plain Google Sheet. No code, no database.',
    liveUrl: '', // shows a "Try the Calculator" button when set

    overviewHeading: 'Overview',
    overviewBody: 'Screen-printing quotes come down to a few variables — what garment, how many, how many print locations, and how many ink colors. I built a small web calculator that walks a customer through those choices and returns a price in seconds, right on the shop\'s site. The twist: the shop owner controls every option and price from an ordinary Google Sheet — so a non-technical person can run and reshape the calculator without ever touching code.',
    inputs: ['Garment type', 'Quantity', 'Print locations', 'Number of colors', 'Instant total'],

    sheetHeading: 'One Google Sheet runs the whole calculator',
    sheetBody: 'There\'s no database and no admin login to learn. Every variable the calculator uses — the list of garments, base prices, per-color charges, location fees, and quantity price breaks — lives in a normal Google Sheet. The left image is what a customer sees; the right is the sheet that powers it. Change a number in the sheet and the calculator picks it up. Add a row and a new option appears.',

    stepsHeading: 'How a non-technical person sets up the variables',
    sheetSteps: [
      'Open the linked Google Sheet — no dashboard login, no code editor.',
      'Each row is an option the calculator offers (a garment, a print location, a color tier), and the columns beside it are its prices.',
      'Type to change a price, or add a new row to add a new option — exactly like editing any spreadsheet.',
      'Set quantity price breaks in their own tab so bigger orders automatically cost less per piece.',
      'Save the sheet — the calculator reflects your changes instantly, with no developer and no re-launch.',
    ],

    highlightsHeading: 'Highlights',
    highlights: [
      { value: 'Seconds', label: 'from question to quote — no waiting on an email' },
      { value: '0', label: 'code or database — the whole back end is a Google Sheet' },
      { value: 'Anyone', label: 'on the team can edit the pricing, no training required' },
    ],

    ctaHeading: 'Want a tool like this for your business?',
    ctaBody: 'If your pricing comes down to a few inputs, I can turn it into an instant quote calculator your customers use themselves — controlled by a spreadsheet you already know how to edit. Let\'s talk.',
    ctaLabel: 'Start a Project',
    ctaHref: '/#pricing',

    // Image URLs. When blank, the page falls back to /case-studies/quick-quote/*.png
    // (files you drop into the public folder). Uploads from the dashboard fill these.
    images: {
      calculator: '',
      sheet: '',
    },
  },

  // Tee Rabbit case study — HYBRID feature-showcase page: the LAYOUT is
  // hard-coded in src/pages/TeeRabbit.jsx (routed at /work/teerabbit), but all
  // the COPY, numbers, and images below are editable in the dashboard
  // (/admin → Case Studies → Tee Rabbit). These values are the fallback/seed.
  casestudy_teerabbit: {
    eyebrow: 'Custom Apparel · Screen Printing · E-commerce Web App',
    title: 'Tee Rabbit',
    summary: 'A custom-apparel experience for one of the Bay Area\'s most trusted screen printers — with an in-browser t-shirt designer, browsable product catalogs, and a live trust-index of real customer reviews, all built right into the site.',
    liveUrl: 'https://www.teerabbit.com', // shows a "Visit Live Site" button when set

    overviewHeading: 'Overview',
    overviewBody: 'Tee Rabbit is a Bay Area custom-apparel shop — screen printing, embroidery, and DTF for everyone from individuals to names like Amazon and Apple. With 15+ years behind them, they needed a site that doesn\'t just describe the service but lets customers do the work themselves: design a shirt in the browser, browse the full catalog, and see real reviews that build confidence before they ever request a quote.',
    services: ['Screen printing', 'Embroidery', 'DTF transfers', 'In-browser designer', 'Product catalog', 'Customer reviews'],

    sliderHeading: 'A look at the build',
    sliderBody: 'The three pieces that turn a browser into a buyer — the custom designer, the product catalog, and a live wall of real reviews.',

    designerHeading: 'A custom t-shirt designer, built into the site',
    designerBody: 'Customers don\'t have to email a mockup and wait. Right on the site they can drop in artwork or text, pick colors and placement, and preview their design on the garment in real time — then send it straight to a quote. It turns "I have an idea" into an order without the back-and-forth.',

    catalogHeading: 'Browsable product catalogs',
    catalogBody: 'The full range — tees, hoodies, polos, performance and activewear across men\'s, women\'s, kids and unisex — is organized into clean, filterable catalogs. Shoppers find the exact blank they want and jump straight into designing or quoting it, instead of scrolling a flat product wall.',

    trustHeading: 'A trust index of real reviews',
    trustBody: 'Custom apparel is a trust purchase, so we put the proof front and center: a rotating trust-index carousel of genuine 5-star reviews pulled from Yelp and Google. It runs throughout the site so first-time visitors get real customer assurance at exactly the moment they\'re deciding whether to order.',

    highlightsHeading: 'Highlights',
    highlights: [
      { value: 'In-browser', label: 'design tool — customers mock up shirts without emailing back and forth' },
      { value: '5-star', label: 'reviews surfaced in a live trust-index carousel' },
      { value: '15+ yrs', label: 'of screen-printing credibility, now front and center on the site' },
    ],

    ctaHeading: 'Want a tool like this for your business?',
    ctaBody: 'Whether it\'s a custom designer, a product catalog, or a wall of real reviews, I can build the interactive pieces that turn a browser into a buyer. Let\'s talk.',
    ctaLabel: 'Start a Project',
    ctaHref: '/#pricing',

    // Image URLs. When blank, the page falls back to /case-studies/teerabbit/*.png
    // (files you drop into the public folder). Uploads from the dashboard fill these.
    images: {
      // Dedicated slider images. Blank → falls back to the matching feature image.
      slide1: '',
      slide2: '',
      slide3: '',
      // Feature-section images (also used as the slider fallback).
      designer: '',
      catalog: '',
      trust: '',
    },
  },

  // ── Redesigns ───────────────────────────────────────────────────────────────
  // A LIST of prospect redesign demos shown at /redesigns (index of cards) with a
  // detail page each at /redesigns/<slug>. The LAYOUT is hard-coded in
  // src/pages/Redesigns.jsx + RedesignDetail.jsx, but everything below is editable
  // in the dashboard (/admin → Redesigns). Each item's `previewUrl` should point
  // to the password-protected Vercel preview; the detail page shows a "contact for
  // the password" note. These values are the fallback/seed.
  redesigns: {
    badge: 'Redesigns',
    headline: 'Site redesigns I built',
    subheadline: 'Real before-and-after redesigns. Click any project to see the changes and request a private live preview.',
    items: [
      {
        slug: 'danville-tree-service',
        name: 'Danville Tree Service',
        category: 'Certified Arborist · East Bay',
        blurb: 'Two decades of real tree work, finally shown off — a before/after job gallery, a service-area map, and one-tap quotes.',
        thumbnail: '',
        summary: 'A 20-year arborist business, rebuilt to prove its track record and make booking a certified crew effortless.',
        previewUrl: '',
        previewNote: 'This preview is private. Contact me for the access password.',
        overviewHeading: 'Overview',
        overviewBody: 'Danville Tree Service has cared for East Bay trees since 2004 — but its old site didn\'t show it. The redesign turns 4,000+ jobs and ISA-certified credentials into visible proof, and gets a homeowner to a quote in one tap.',
        challengeHeading: '',
        challengeBody: '',
        changesHeading: 'What I changed',
        changes: [
          'A before/after gallery of real tree jobs, each viewable full-screen',
          'A horizontal-scrolling services showcase — removal, pruning, stump grinding, storm response, land clearing',
          'An interactive service-area map for Danville, Alamo, Blackhawk, San Ramon and the Tri-Valley',
          'Credentials up front: ISA-certified, licensed & insured, 4,000+ trees serviced',
        ],
        beforeImage: '/redesigns/danville-tree-service/before.png',
        afterImage: '/redesigns/danville-tree-service/after.png',
        gallery: [
          '/redesigns/danville-tree-service/section-1.png',
          '/redesigns/danville-tree-service/section-2.png',
        ],
      },
      {
        slug: 'valley-plumbing',
        name: 'Valley Plumbing Home Center',
        category: 'Family Plumber · Since 1982',
        blurb: 'A 40-year family plumber rebuilt around 24/7 tap-to-call, a credentials band, and a real project track record.',
        thumbnail: '',
        summary: 'Giving a four-decade family plumbing business a site that earns trust on sight and puts an urgent call one tap away.',
        previewUrl: '',
        previewNote: 'This preview is private. Contact me for the access password.',
        overviewHeading: 'Overview',
        overviewBody: 'Valley Plumbing Home Center has served the Tri-Valley since 1982. The redesign leads with that credibility — and recognizes that most plumbing customers are on a phone, mid-emergency, looking for one thing: a way to call now.',
        challengeHeading: '',
        challengeBody: '',
        changesHeading: 'What I changed',
        changes: [
          'A persistent 24/7 tap-to-call button — built for a customer with a leak right now',
          'A credentials band up top: CSLB-licensed, insured & bonded, family-owned since 1982',
          'A services grid with a dedicated page per service — repairs, repipes, gas lines, bath remodels',
          'A recent-projects carousel showing real completed work, plus a service-type contact form',
        ],
        beforeImage: '/redesigns/valley-plumbing/before.png',
        afterImage: '/redesigns/valley-plumbing/after.png',
        gallery: [
          '/redesigns/valley-plumbing/section-1.png',
          '/redesigns/valley-plumbing/section-2.png',
        ],
      },
      {
        slug: 'all-pro-window-cleaning',
        name: 'All Pro Window Cleaning',
        category: 'Window & Exterior Cleaning · Since 2002',
        blurb: 'A 20-year cleaning company reimagined with a bright, glassy site — and a drag-to-clean slider you can actually play with.',
        thumbnail: '',
        summary: 'Turning two decades of spotless work into a site that feels as clear and crisp as the windows they clean.',
        previewUrl: '',
        previewNote: 'This preview is private. Contact me for the access password.',
        overviewHeading: 'Overview',
        overviewBody: 'All Pro has cleaned windows, gutters, and exteriors for homes and businesses across Northern and Southern California since 2002. The redesign gives that two-decade reputation a site to match — bright, glassy, and built to turn a visitor into a free estimate.',
        challengeHeading: '',
        challengeBody: '',
        changesHeading: 'What I changed',
        changes: [
          'A bright, glassy redesign with a “See everything clearly” hero and squeegee-wipe animations',
          'An interactive drag-to-clean before/after slider — the site shows the work instead of describing it',
          'Six services, each with its own detail page — window, gutter, pressure washing and more',
          'Trust front and center: licensed, bonded & insured, serving NorCal & SoCal since 2002',
          'Click-to-call and free online estimate prompts on every screen',
        ],
        beforeImage: '/redesigns/all-pro-window-cleaning/before.png',
        afterImage: '/redesigns/all-pro-window-cleaning/after.png',
        slider: {
          heading: 'Two decades of making glass disappear',
          body: 'This is the real interactive feature from the redesign — drag the handle to wipe a grimy, blurred pane into a spotless one. It shows the work instead of just describing it.',
          image: '',
          caption: 'Drag to see the All Pro difference →',
        },
        gallery: [],
      },
    ],
  },
}

export const DEFAULT_SETTINGS = {
  site_name: 'Justi Design',
  primary_color: '#0f172a',
  secondary_color: '#ffffff',
  accent_color: '#a855f7',
  bg_color: '#ffffff',
  text_color: '#1a1a1a',
  text_muted_color: '#64748b',
  font_heading: 'Plus Jakarta Sans',
  font_body: 'Inter',
  border_radius: '12px',
  seo_title: 'Justi Design — Websites that convert',
  seo_description: 'Custom websites for small businesses and growing brands. Fast turnaround, client-editable admin panel, transparent project pricing.',
  google_analytics_id: '',
  registration_email: 'hello@justi.design',
  developer_emails: 'justinroyrodriguez@gmail.com',
}
