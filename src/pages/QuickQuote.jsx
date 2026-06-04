// Quick Quote Calculator — hard-coded case study page (HYBRID).
// This is a CLIENT-SPECIFIC page (not a core dashboard file): safe to edit here.
// Route is registered in src/App.jsx at /work/quick-quote.
//
// LAYOUT is hard-coded here. COPY, numbers, and images are editable in the
// dashboard (/admin → Case Studies → Quick Quote) — they live in the
// `casestudy_quickquote` content section. Defaults/seed values are in
// src/lib/defaultContent.js and are used as the fallback below.
//
// IMAGES: dashboard uploads fill content.images.*. When an image is blank, the
// page falls back to public/case-studies/quick-quote/<name>.png. Drop screenshots
// there with these names if you don't upload via the dashboard:
//   calculator.png · sheet.png
// Missing images show a labeled placeholder, so the page looks fine until you add them.
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, X } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/sections/Footer'
import { useContent } from '../hooks/useContent'
import { DEFAULT_CONTENT } from '../lib/defaultContent'

const IMG = '/case-studies/quick-quote'

// Resolve an image: dashboard-uploaded URL wins, else fall back to the public file.
const img = (uploaded, fallbackFile) => uploaded || `${IMG}/${fallbackFile}`

// ── Image frame with graceful fallback + click-to-zoom ────────────────────────
function Shot({ src, alt }) {
  const [errored, setErrored] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  // Reset the error state whenever the src changes, so a real (uploaded) URL
  // arriving after an initial fallback miss still gets a fresh load attempt.
  useEffect(() => { setErrored(false) }, [src])

  // While zoomed: close on Escape and lock background scroll.
  useEffect(() => {
    if (!zoomed) return
    const onKey = (e) => { if (e.key === 'Escape') setZoomed(false) }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [zoomed])

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm">
        {errored ? (
          <div className="aspect-[16/10] flex flex-col items-center justify-center text-center px-4 text-gray-400">
            <span className="text-sm font-medium">Add image</span>
            <span className="text-xs font-mono mt-1 break-all">{src}</span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setErrored(true)}
            onClick={() => setZoomed(true)}
            className="w-full h-auto block cursor-zoom-in"
          />
        )}
      </div>

      {zoomed && !errored && (
        <div
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-8 cursor-zoom-out"
        >
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-default"
          />
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Close image"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      )}
    </>
  )
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-primary)] mb-4">
      {children}
    </h2>
  )
}

export default function QuickQuote() {
  const { content } = useContent('casestudy_quickquote')
  // Merge published content over seed defaults so newly-added fields (e.g. the
  // walkthrough steps) still render even if the dashboard content predates them.
  const base = DEFAULT_CONTENT.casestudy_quickquote
  const c = content
    ? { ...base, ...content, images: { ...base.images, ...(content.images || {}) } }
    : base
  const images = c.images || {}
  const inputs = c.inputs || []
  const steps = c.sheetSteps || []
  const highlights = c.highlights || []

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <header className="bg-[var(--color-primary)] text-white pt-24 pb-16">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/#portfolio"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Work
          </Link>
          {c.eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-3">
              {c.eyebrow}
            </p>
          )}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight max-w-3xl">
            {c.title}
          </h1>
          {c.summary && (
            <p className="mt-4 text-lg text-white/70 max-w-2xl">
              {c.summary}
            </p>
          )}
          {c.liveUrl && (
            <a
              href={c.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-8 px-6 py-3 rounded-lg font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
            >
              Try the Calculator
            </a>
          )}
        </div>
      </header>

      <main className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Overview */}
        <section className="max-w-3xl">
          <SectionHeading>{c.overviewHeading}</SectionHeading>
          <p className="text-[var(--color-text-muted)] text-lg leading-relaxed">
            {c.overviewBody}
          </p>
          {inputs.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {inputs.map((t) => (
                <span
                  key={t}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-[var(--color-primary)]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* How it works — the calculator + the Google Sheet that powers it */}
        <section>
          <div className="max-w-3xl mb-8">
            <SectionHeading>{c.sheetHeading}</SectionHeading>
            {c.sheetBody && (
              <p className="text-[var(--color-text-muted)] text-lg leading-relaxed">
                {c.sheetBody}
              </p>
            )}
          </div>

          {/* The two images: what customers see ↔ what you edit */}
          <div className="grid md:grid-cols-2 gap-6">
            <figure className="space-y-2">
              <figcaption className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
                <span className="px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-white">What customers see</span>
              </figcaption>
              <Shot src={img(images.calculator, 'calculator.png')} alt="Quick Quote Calculator — customers pick options and get an instant price" />
            </figure>
            <figure className="space-y-2">
              <figcaption className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">What you edit — no code</span>
              </figcaption>
              <Shot src={img(images.sheet, 'sheet.png')} alt="The linked Google Sheet where every option and price is defined" />
            </figure>
          </div>

          {/* Non-technical walkthrough */}
          {steps.length > 0 && (
            <div className="mt-12 max-w-3xl">
              {c.stepsHeading && (
                <h3 className="text-lg font-bold text-[var(--color-primary)] mb-6">
                  {c.stepsHeading}
                </h3>
              )}
              <ol className="space-y-5">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-accent)] text-white font-bold flex items-center justify-center text-sm">
                      {i + 1}
                    </span>
                    <p className="text-[var(--color-text-muted)] leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>

        {/* Highlights */}
        {highlights.length > 0 && (
          <section>
            <SectionHeading>{c.highlightsHeading}</SectionHeading>
            <div className="grid sm:grid-cols-3 gap-6">
              {highlights.map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                  <div className="text-4xl font-extrabold text-[var(--color-accent)] mb-2">{stat.value}</div>
                  <div className="text-sm text-[var(--color-text-muted)] leading-snug">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center max-w-2xl mx-auto pt-4">
          <SectionHeading>{c.ctaHeading}</SectionHeading>
          {c.ctaBody && (
            <p className="text-[var(--color-text-muted)] text-lg mb-6">
              {c.ctaBody}
            </p>
          )}
          <Link
            to={c.ctaHref || '/#pricing'}
            className="inline-flex items-center px-7 py-3.5 rounded-lg font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
          >
            {c.ctaLabel || 'Start a Project'}
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  )
}
