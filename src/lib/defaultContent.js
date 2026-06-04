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
      { id: '3', title: 'Danville Tree Service', category: 'Local Service Business', description: 'A dated, cluttered tree-care site rebuilt into a clean, fast, mobile-first website that leads with credibility.', image: '', link: '/work/danville-tree' },
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
    summary: 'An instant pricing calculator for screen printers — customers get an on-the-spot estimate, and the shop edits every price from a plain Google Sheet.',
    liveUrl: '', // shows a "Try the Calculator" button when set

    overviewHeading: 'Overview',
    overviewBody: 'Screen-printing quotes depend on a handful of variables — what garment, how many, how many print locations, and how many ink colors. I built a small web calculator that walks a customer through those choices and returns a price estimate in seconds, right on the shop\'s site. No phone tag, no waiting on a quote email.',
    inputs: ['Garment type', 'Quantity', 'Print locations', 'Number of colors', 'Instant total'],

    challengeHeading: 'The Challenge',
    challengeBody: 'Most print shops quote by hand — a customer calls or emails, someone digs through a price list, does the math, and writes back hours later. It\'s slow for the customer and a constant interruption for the shop. And every shop prices differently, so a one-size-fits-all calculator was never going to work — each owner needed to set their own numbers without touching code.',

    builtHeading: 'What I Built',
    built: [
      'A guided calculator: pick a garment, enter quantity, choose print locations and ink colors',
      'Instant price estimates with quantity price breaks built in — the more you order, the lower the per-piece cost',
      'A clean, mobile-friendly layout customers can use right on the shop\'s website',
      'All pricing driven by a linked Google Sheet — no database, no admin login to learn',
      'Sells as a drop-in tool: each shop gets their own copy and their own sheet',
    ],

    calcHeading: 'Pick a few options, get a price',
    calcBody: 'The customer answers four simple questions and the estimate updates instantly — no signup, no waiting.',

    sheetHeading: 'Pricing lives in a Google Sheet — not a database',
    sheetBody: 'This is the part shop owners love. Instead of a complicated back end or a login to learn, all the pricing — garment costs, per-color charges, location fees, and quantity price breaks — lives in a normal Google Sheet. The owner edits the numbers they already know in a tool they already use, and the calculator picks up the changes. Non-technical by design.',

    highlightsHeading: 'Highlights',
    highlights: [
      { value: 'Seconds', label: 'from question to quote — no waiting on an email' },
      { value: '0', label: 'logins or back-end screens for the shop to learn' },
      { value: 'Google Sheets', label: 'is the entire pricing back end — edit it like any spreadsheet' },
    ],

    ctaHeading: 'Want a tool like this for your business?',
    ctaBody: 'If your pricing comes down to a few inputs, I can turn it into an instant quote calculator your customers can use themselves. Let\'s talk.',
    ctaLabel: 'Start a Project',
    ctaHref: '/#pricing',

    // Image URLs. When blank, the page falls back to /case-studies/quick-quote/*.png
    // (files you drop into the public folder). Uploads from the dashboard fill these.
    images: {
      calculator: '',
      quote: '',
      sheet: '',
    },
  },

  // Danville Tree Service case study — HYBRID before/after redesign page: the
  // LAYOUT is hard-coded in src/pages/DanvilleTree.jsx (routed at
  // /work/danville-tree), but all the COPY, numbers, and images below are
  // editable in the dashboard (/admin → Case Studies → Danville Tree). These
  // values are the fallback/seed.
  casestudy_danvilletree: {
    eyebrow: 'Local Service Business · Website Redesign',
    title: 'Danville Tree Service',
    summary: 'Rebuilding a dated, cluttered tree-care website into a clean, fast, mobile-first site that leads with credibility and makes it easy to call.',
    liveUrl: 'https://danville-tree-service.vercel.app/', // shows a "Visit Live Site" button when set

    overviewHeading: 'Overview',
    overviewBody: 'Danville Tree Service is a tree-care company in the East Bay (Danville, CA) offering everything from trimming and pruning to full removals, stump grinding, and land clearing. They had a website, but it looked dated and buried the things that actually win a job — trust and an easy way to get in touch. The goal was a modern redesign that feels like a credible, certified local pro.',
    services: ['Tree trimming & pruning', 'Tree removal', 'Stump grinding', 'Land clearing', 'Arborist consultations'],

    challengeHeading: 'The Challenge',
    challengeBody: 'The original site had a traditional, dated look — repetitive sections that said the same thing over and over, redundant "Contact Us Today" buttons scattered everywhere, generic stock photography, and an uninspired color scheme. All the clutter made it hard to find what mattered, it didn\'t establish the company as certified experts, and it didn\'t feel built for someone pulling it up on a phone.',

    builtHeading: 'What I Built',
    built: [
      'A clean, modern redesign that leads with credibility — "Certified Arborists in the East Bay"',
      'A clear, single path to action so visitors aren\'t hit with a dozen competing buttons',
      'Scannable service sections that replace the old repetitive, redundant blocks',
      'A mobile-first layout with an easy tap-to-call for people searching on their phone',
      'A faster, lighter build that loads quickly and looks polished on every screen',
    ],

    servicesHeading: 'Services: from repetitive blocks to clear cards',
    mobileHeading: 'Built for the phone — where the calls come from',
    mobileBody: 'Most tree-service leads come from someone standing in their yard on a phone. The new site is mobile-first, with a clean layout and an easy way to call right from the screen.',

    highlightsHeading: 'Highlights',
    highlights: [
      { value: 'Mobile-first', label: 'rebuilt for the phone, where local leads actually start' },
      { value: 'Credibility-led', label: 'now opens with "Certified Arborists," not clutter' },
      { value: 'One clear CTA', label: 'replaced a maze of redundant contact buttons' },
    ],

    ctaHeading: 'Want a redesign like this?',
    ctaBody: 'If your site looks dated or buries the thing that wins you the job, I can rebuild it into something modern, fast, and easy to act on. Let\'s talk.',
    ctaLabel: 'Start a Project',
    ctaHref: '/#pricing',

    // Image URLs. When blank, the page falls back to /case-studies/danville-tree/*.png
    // (files you drop into the public folder). Uploads from the dashboard fill these.
    images: {
      oldHome: '',
      newHome: '',
      oldServices: '',
      newServices: '',
      newMobile: '',
    },
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
