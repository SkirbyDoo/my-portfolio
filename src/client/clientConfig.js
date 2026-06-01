// ─────────────────────────────────────────────────────────────────────────────
// CLIENT CONFIGURATION — Justi Design Portfolio
//
// This is the ONLY file you edit per client to wire up the admin panel.
// The dashboard shell (AdminPanel.jsx) and data layer (useContent.js) are
// core files — never edit them directly. All client-specific wiring lives here.
// ─────────────────────────────────────────────────────────────────────────────

import {
  Image, MessageSquare, Star, Info, Home, Mail, DollarSign, Briefcase,
} from 'lucide-react'

import HeroEditor         from '../admin/editors/HeroEditor'
import ServicesEditor     from '../admin/editors/ServicesEditor'
import PricingEditor      from '../admin/editors/PricingEditor'
import PortfolioEditor    from '../admin/editors/PortfolioEditor'
import AboutEditor        from '../admin/editors/AboutEditor'
import TestimonialsEditor from '../admin/editors/TestimonialsEditor'
import ContactEditor      from '../admin/editors/ContactEditor'

import Hero         from '../components/sections/Hero'
import Services     from '../components/sections/Services'
import Pricing      from '../components/sections/Pricing'
import Portfolio    from '../components/sections/Portfolio'
import About        from '../components/sections/About'
import Testimonials from '../components/sections/Testimonials'
import Contact      from '../components/sections/Contact'

// ── Section components, keyed by section id (drives promoted standalone pages) ─
export const PAGE_VIEWS = {
  hero:         Hero,
  services:     Services,
  pricing:      Pricing,
  portfolio:    Portfolio,
  about:        About,
  testimonials: Testimonials,
  contact:      Contact,
}

// ── Sidebar label overrides (editable by admin in the panel) ──────────────────
export const DEFAULT_LABELS = {
  home: 'Home Page',
}

// ── Page tree — drives the sidebar nav and dashboard cards ────────────────────
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
  'testimonials', 'contact', 'footer',
  'page_labels', 'custom_pages', 'site_structure',
]

// ── Sections captured in site-wide snapshots ──────────────────────────────────
export const SNAPSHOT_SECTIONS = [
  'navigation', 'hero', 'services', 'pricing', 'portfolio', 'about',
  'testimonials', 'contact', 'footer', 'custom_pages', 'site_structure',
]
