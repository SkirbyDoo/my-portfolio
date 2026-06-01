// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
import { useParams, Navigate, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useContent, useSettings } from '../hooks/useContent'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/sections/Footer'
import { BlockRenderer } from '../components/BlockRenderer'
import { PAGE_VIEWS } from '../client/clientConfig'

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CustomPage() {
  const { slug } = useParams()
  const { content } = useContent('custom_pages')
  const { content: structure } = useContent('site_structure', { global: true })
  const { settings } = useSettings()
  const { pathname } = useLocation()
  const inPreview = pathname.startsWith('/preview')

  const siteName = settings?.site_name || settings?.seo_title || ''

  // ── Labels for built-in section pages ──────────────────────────────────────
  // Derive human-readable labels from PAGE_VIEWS keys when no explicit label exists.
  const SECTION_LABELS = {
    hero:         'Home',
    about:        'About',
    services:     'Services',
    team:         'Team',
    testimonials: 'Testimonials',
    contact:      'Contact',
  }

  // ── Set document.title and meta description ─────────────────────────────────
  useEffect(() => {
    if (!slug) return

    const sitePageSections = structure?.sitePageSections ?? []
    const isBuiltIn = sitePageSections.includes(slug) && PAGE_VIEWS[slug]

    let titleText = ''
    let descText  = ''

    if (isBuiltIn) {
      const meta = structure?.sectionMeta?.[slug] ?? {}
      titleText = meta.seoTitle   || SECTION_LABELS[slug] || slug
      descText  = meta.seoDescription || ''
    } else {
      const page = content?.pages?.find(p => p.slug === slug)
      titleText = page?.seoTitle   || page?.title || slug
      descText  = page?.seoDescription || ''
    }

    const fullTitle = siteName ? `${titleText} | ${siteName}` : titleText
    const prevTitle = document.title
    document.title = fullTitle

    // Update or create meta description tag
    let metaDesc = document.querySelector('meta[name="description"]')
    const prevDesc = metaDesc?.getAttribute('content') ?? null
    if (descText) {
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.setAttribute('name', 'description')
        document.head.appendChild(metaDesc)
      }
      metaDesc.setAttribute('content', descText)
    }

    return () => {
      document.title = prevTitle
      if (descText && metaDesc) {
        if (prevDesc !== null) {
          metaDesc.setAttribute('content', prevDesc)
        } else {
          metaDesc.remove()
        }
      }
    }
  }, [slug, content, structure, siteName])

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Check if this slug is a built-in section promoted to a standalone page
  const sitePageSections = structure?.sitePageSections ?? []
  if (sitePageSections.includes(slug) && PAGE_VIEWS[slug]) {
    const SectionComponent = PAGE_VIEWS[slug]
    return (
      <div className="min-h-screen">
        <Navbar />
        <main><SectionComponent /></main>
        <Footer />
      </div>
    )
  }

  const page = content.pages?.find(p => p.slug === slug)
  if (!page) return <Navigate to={inPreview ? '/preview' : '/'} replace />

  // Support both new blocks format and legacy content string
  const hasBlocks = Array.isArray(page.blocks) && page.blocks.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-[var(--color-primary)] text-white pt-24 pb-12">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={inPreview ? '/preview' : '/'} className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold">{page.title}</h1>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {hasBlocks ? (
          <BlockRenderer blocks={page.blocks} />
        ) : (
          // Legacy HTML string fallback
          <div
            className="text-[var(--color-text)] text-base leading-relaxed space-y-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[var(--color-primary)] [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[var(--color-primary)] [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-[var(--color-text)] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-[var(--color-text)] [&_strong]:font-semibold [&_strong]:text-[var(--color-primary)] [&_a]:text-[var(--color-accent)] [&_a]:underline"
            dangerouslySetInnerHTML={{
              __html: page.content
                ? /<[a-z][\s\S]*>/i.test(page.content)
                  ? page.content
                  : page.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />')
                : '<p>No content yet.</p>',
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}
