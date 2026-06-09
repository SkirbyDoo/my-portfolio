// Redesigns index — CLIENT-SPECIFIC page (not a core dashboard file).
// Public grid of redesign demo cards at /redesigns. Each card links to its
// detail page at /redesigns/<slug>. Content is editable in the dashboard
// (/admin → Redesigns) via the `redesigns` content section; seed/fallback
// values live in src/lib/defaultContent.js.
import { Link } from 'react-router-dom'
import { ArrowUpRight, Image as ImageIcon } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/sections/Footer'
import { useContent } from '../hooks/useContent'
import { DEFAULT_CONTENT } from '../lib/defaultContent'
import { redesignSlug } from '../lib/slugify'

export default function Redesigns() {
  const { content } = useContent('redesigns')
  const c = content || DEFAULT_CONTENT.redesigns
  const items = (c.items || []).filter((it) => it && it.name)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <header className="bg-[var(--color-primary)] text-white pt-28 pb-16">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {c.badge && (
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-3">
              {c.badge}
            </p>
          )}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {c.headline}
          </h1>
          {c.subheadline && (
            <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
              {c.subheadline}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {items.length === 0 ? (
          <p className="text-center text-[var(--color-text-muted)] py-12">
            Concepts are on the way — check back soon.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => {
              const slug = redesignSlug(item)
              return (
                <Link
                  key={slug}
                  to={`/redesigns/${slug}`}
                  className="group block rounded-2xl overflow-hidden border border-gray-100 bg-white hover:border-[var(--color-accent)] hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    {item.thumbnail || item.afterImage ? (
                      <img
                        src={item.thumbnail || item.afterImage}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <ImageIcon size={48} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight size={18} className="text-[var(--color-primary)]" />
                    </div>
                  </div>
                  <div className="p-6">
                    {item.category && (
                      <span className="inline-block text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-2">
                        {item.category}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">{item.name}</h3>
                    {item.blurb && (
                      <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{item.blurb}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
