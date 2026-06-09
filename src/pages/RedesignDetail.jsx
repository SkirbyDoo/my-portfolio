// Redesign detail — CLIENT-SPECIFIC page (not a core dashboard file).
// Case-study style page for a single redesign at /redesigns/<slug>. Reads the
// matching item from the `redesigns` content section (editable in /admin →
// Redesigns). Shows before/after + gallery screenshots (click to zoom) and a
// private-preview call to action at the top AND bottom that links to the
// password-protected Vercel preview, with a "contact for the password" note.
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, X, Lock, ExternalLink, Sparkles } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/sections/Footer'
import { useContent } from '../hooks/useContent'
import { DEFAULT_CONTENT } from '../lib/defaultContent'
import { redesignSlug } from '../lib/slugify'
import ClaritySlider from '../components/ui/ClaritySlider'

const DEFAULT_NOTE = 'This preview is private. Contact me for the access password.'

// ── Image frame with graceful fallback + click-to-zoom ───────────────────────
function Shot({ src, alt }) {
  const [errored, setErrored] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  useEffect(() => { setErrored(false) }, [src])

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

  if (!src) return null

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

function BeforeAfter({ beforeSrc, afterSrc }) {
  if (!beforeSrc && !afterSrc) return null
  const both = beforeSrc && afterSrc
  return (
    <div className={both ? 'grid md:grid-cols-2 gap-6' : ''}>
      {beforeSrc && (
        <figure className="space-y-2">
          <figcaption className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">Before</span>
          </figcaption>
          <Shot src={beforeSrc} alt="Before the redesign" />
        </figure>
      )}
      {afterSrc && (
        <figure className="space-y-2">
          <figcaption className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
            <span className="px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-white">After</span>
          </figcaption>
          <Shot src={afterSrc} alt="After the redesign" />
        </figure>
      )}
    </div>
  )
}

// ── Private-preview call to action (used at top and bottom) ───────────────────
function PreviewCTA({ previewUrl, note }) {
  return (
    <div className="rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-6 sm:p-8 text-center">
      <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--color-primary)] mb-3">
        See the live redesign
      </h3>
      {previewUrl ? (
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
        >
          <ExternalLink size={18} /> View the Live Preview
        </a>
      ) : (
        <Link
          to="/#contact"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
        >
          Request a Preview
        </Link>
      )}
      <p className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--color-text-muted)]">
        <Lock size={14} className="shrink-0" />
        <span>{note || DEFAULT_NOTE}</span>
      </p>
      <Link to="/#contact" className="inline-block mt-1 text-sm font-semibold text-[var(--color-accent)] hover:underline">
        Contact me for the password →
      </Link>
    </div>
  )
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-primary)] mb-4">
      {children}
    </h2>
  )
}

export default function RedesignDetail() {
  const { slug } = useParams()
  const { content } = useContent('redesigns')
  const c = content || DEFAULT_CONTENT.redesigns
  const items = c.items || []
  const item = items.find((it) => redesignSlug(it) === slug)

  // Unknown slug → friendly not-found that points back to the index.
  if (!item) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-3xl font-extrabold text-[var(--color-primary)] mb-4">Redesign not found</h1>
          <p className="text-[var(--color-text-muted)] mb-8">This redesign may have been moved or renamed.</p>
          <Link to="/redesigns" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity">
            <ArrowLeft size={16} /> Back to Redesigns
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const changes = item.changes || []
  const gallery = (item.gallery || []).filter(Boolean)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <header className="bg-[var(--color-primary)] text-white pt-24 pb-16">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/redesigns"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> All Redesigns
          </Link>
          {item.category && (
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-3">
              {item.category}
            </p>
          )}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight max-w-3xl">
            {item.name}
          </h1>
          {item.summary && (
            <p className="mt-4 text-lg text-white/70 max-w-2xl">{item.summary}</p>
          )}

          {/* First-fold CTA */}
          <div className="mt-8">
            {item.previewUrl ? (
              <a
                href={item.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
              >
                <ExternalLink size={18} /> See the Live Redesign
              </a>
            ) : (
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
              >
                Request a Preview
              </Link>
            )}
            <p className="mt-3 flex items-center gap-2 text-sm text-white/55">
              <Lock size={13} className="shrink-0" />
              <span>{item.previewNote || DEFAULT_NOTE}</span>
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Top note — intentional, on-brand callout (not an error banner) */}
        <div className="rounded-2xl bg-gray-50 border-l-4 border-[var(--color-accent)] shadow-sm p-5 sm:p-7">
          <div className="flex items-center gap-2.5 mb-3">
            <Sparkles size={16} className="text-[var(--color-accent)] shrink-0" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-accent)]">
              A note before you explore
            </span>
          </div>
          <p className="text-base sm:text-lg font-bold text-[var(--color-primary)] mb-2">
            What you’re looking at is a real working draft — not a finished site, and that’s on purpose.
          </p>
          <div className="space-y-3 text-sm sm:text-[15px] text-[var(--color-text-muted)] leading-relaxed">
            <p>
              The heavy lifting is done — the layout, the look, and the feel are all here. A few links might not lead
              anywhere just yet, some forms/contacts are not functional, and some of the wording is still placeholder
              text that we’d tailor to you. If you decide to move forward, we’ll sit down together and get every detail
              exactly right for your business — the copy, the links, the settings, all of it.
            </p>
            <p>
              And here’s the part we’re proud of: most designers won’t lift a finger until you’ve paid. We built this
              for you first — before you’ve spent a single penny — because we’d rather show you what we can do than
              just talk about it. Look around, and if you love where it’s headed, let’s talk.
            </p>
          </div>
        </div>

        {/* Overview */}
        {item.overviewBody && (
          <section className="max-w-3xl">
            <SectionHeading>{item.overviewHeading || 'Overview'}</SectionHeading>
            <p className="text-[var(--color-text-muted)] text-lg leading-relaxed">{item.overviewBody}</p>
          </section>
        )}

        {/* The Challenge + Before/After — proof shown BEFORE the preview ask */}
        {(item.challengeBody || item.beforeImage || item.afterImage) && (
          <section>
            {item.challengeBody ? (
              <div className="max-w-3xl mb-8">
                <SectionHeading>{item.challengeHeading || 'The Challenge'}</SectionHeading>
                <p className="text-[var(--color-text-muted)] text-lg leading-relaxed">{item.challengeBody}</p>
              </div>
            ) : (
              (item.beforeImage || item.afterImage) && (
                <div className="mb-8">
                  <SectionHeading>{item.beforeImage ? 'Before & after' : 'The redesign'}</SectionHeading>
                </div>
              )
            )}
            <BeforeAfter beforeSrc={item.beforeImage} afterSrc={item.afterImage} />
          </section>
        )}

        {/* Interactive feature — e.g. the All Pro drag-to-clean slider */}
        {item.slider && (
          <section>
            <SectionHeading>{item.slider.heading || 'Try it yourself'}</SectionHeading>
            {item.slider.body && (
              <p className="text-[var(--color-text-muted)] text-lg leading-relaxed max-w-3xl mb-6">
                {item.slider.body}
              </p>
            )}
            <div className="max-w-3xl">
              <ClaritySlider image={item.slider.image} caption={item.slider.caption} />
            </div>
          </section>
        )}

        {/* What I Changed */}
        {changes.length > 0 && (
          <section className="max-w-3xl">
            <SectionHeading>{item.changesHeading || 'What I Changed'}</SectionHeading>
            <ul className="space-y-3">
              {changes.map((line, i) => (
                <li key={i} className="flex items-start gap-3 text-[var(--color-text)]">
                  <Check size={20} className="text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <section>
            <SectionHeading>A closer look</SectionHeading>
            <div className="grid sm:grid-cols-2 gap-6">
              {gallery.map((src, i) => (
                <Shot key={i} src={src} alt={`${item.name} screenshot ${i + 1}`} />
              ))}
            </div>
          </section>
        )}

        {/* Static-images disclaimer + Bottom CTA */}
        <div className="space-y-6">
          <p className="max-w-2xl mx-auto text-center text-sm text-[var(--color-text-muted)] italic">
            These are static screenshots — they can’t capture the animations, interactions, and feel of the real thing.
            Request a private link to browse the live redesign for yourself and see the full picture.
          </p>
          <PreviewCTA previewUrl={item.previewUrl} note={item.previewNote} />
        </div>

      </main>

      <Footer />
    </div>
  )
}
