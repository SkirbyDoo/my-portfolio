// ─────────────────────────────────────────────────────────────────────────────
// CLIENT CONFIGURATION — src/client/clientConfig.js
//
// This is the ONLY file you edit per client to wire up the admin panel.
// The dashboard shell (AdminPanel.jsx) and data layer (useContent.js) are
// core files — never edit them directly. All client-specific wiring lives here.
//
// Client: my-portfolio (personal design portfolio)
// ─────────────────────────────────────────────────────────────────────────────

import {
  Image, MessageSquare, Star, Info, Home, Mail, DollarSign, Briefcase,
} from 'lucide-react'

import HeroEditor         from '../admin/editors/HeroEditor'
import AboutEditor        from '../admin/editors/AboutEditor'
import ServicesEditor     from '../admin/editors/ServicesEditor'
import PricingEditor      from '../admin/editors/PricingEditor'
import PortfolioEditor    from '../admin/editors/PortfolioEditor'
import TestimonialsEditor from '../admin/editors/TestimonialsEditor'
import ContactEditor      from '../admin/editors/ContactEditor'

import Hero         from '../components/sections/Hero'
import About        from '../components/sections/About'
import Services     from '../components/sections/Services'
import Pricing      from '../components/sections/Pricing'
import Portfolio    from '../components/sections/Portfolio'
import Testimonials from '../components/sections/Testimonials'
import Contact      from '../components/sections/Contact'

// ── Page section components (consumed by Home page renderer if needed) ────────
export const PAGE_VIEWS = {
  hero:         Hero,
  about:        About,
  services:     Services,
  pricing:      Pricing,
  portfolio:    Portfolio,
  testimonials: Testimonials,
  contact:      Contact,
}

// ── Sidebar label overrides (editable by admin in the panel) ──────────────────
export const DEFAULT_LABELS = {
  home: 'Home Page',
}

// ── Page tree — drives the sidebar nav and dashboard cards ────────────────────
// Order here matches the order sections appear on the live Home page.
export const PAGE_TREE = [
  {
    id: 'home',
    icon: Home,
    defaultOpen: true,
    children: [
      { id: 'hero',         label: 'Hero',         icon: Image,         component: HeroEditor },
      { id: 'services',     label: 'Services',     icon: Star,          component: ServicesEditor },
      { id: 'pricing',      label: 'Pricing',      icon: DollarSign,    component: PricingEditor },
      { id: 'portfolio',    label: 'Portfolio',    icon: Briefcase,     component: PortfolioEditor },
      { id: 'about',        label: 'About',        icon: Info,          component: AboutEditor },
      { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, component: TestimonialsEditor },
      { id: 'contact',      label: 'Contact',      icon: Mail,          component: ContactEditor },
    ],
  },
]

// ── Sections synced when "Copy to Review" is triggered ────────────────────────
export const REVIEW_SECTIONS = [
  'navigation', 'hero', 'services', 'pricing', 'portfolio', 'about',
  'testimonials', 'contact', 'footer', 'page_labels', 'custom_pages', 'site_structure',
]

// ── Sections captured in site-wide snapshots ──────────────────────────────────
export const SNAPSHOT_SECTIONS = [
  'navigation', 'hero', 'services', 'pricing', 'portfolio', 'about',
  'testimonials', 'contact', 'footer', 'custom_pages', 'site_structure',
]
