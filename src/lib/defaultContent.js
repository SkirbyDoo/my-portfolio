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
          'Contact form (managed service — no backend to break)',
          'Basic SEO setup',
          '2 rounds of revisions',
          'From 14-day turnaround',
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
        description: 'Everything in Starter, plus clients can update their own content anytime — no developer needed.',
        features: [
          'Up to 10 pages',
          'Self-editing content dashboard — clients edit text and swap images themselves',
          'Image uploads + automatic content history',
          'Custom color + font theming',
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
    visible: true,
  },

  portfolio: {
    badge: 'Selected Work',
    headline: 'Recent projects',
    subheadline: 'A sample of sites I\'ve designed and built for clients across different industries.',
    items: [
      { id: '1', title: 'CityHoops League', category: 'Rec Sports', description: 'Full league management site with season stats, division pages, and a player-editable admin panel.', image: '', link: '' },
      { id: '2', title: 'Quick Quote Calculator', category: 'Service Business', description: 'Interactive pricing calculator that generates instant quotes for a screen-printing shop.', image: '', link: '' },
      { id: '3', title: 'Your Project Here', category: 'Coming Soon', description: 'Spot reserved for the next great project. Could be yours.', image: '', link: '#contact' },
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

  custom_pages: {
    pages: [],
  },
}

export const DEFAULT_SETTINGS = {
  site_name: 'Justi Design',
  primary_color: '#0f172a',
  secondary_color: '#ffffff',
  accent_color: '#6366f1',
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
