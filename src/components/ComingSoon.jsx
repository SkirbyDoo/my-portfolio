import { useEffect } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// COMING SOON gate page.
// Shown on the public site while COMING_SOON is on (toggle in src/App.jsx).
// Edit the brand / copy / contact email below to taste.
// ─────────────────────────────────────────────────────────────────────────────
const BRAND = 'Issa Vibe Coding'
const MESSAGE = "Something great is on the way. We're putting the finishing touches on our new site — check back shortly."
const CONTACT_EMAIL = '' // e.g. 'hello@issavibecoding.com' — leave '' to hide the button

export default function ComingSoon() {
  useEffect(() => { document.title = `${BRAND} — Coming Soon` }, [])

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#070708] text-white px-6">
      {/* soft radial glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.18),transparent_60%)] blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-white/70 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Launching soon
        </div>

        <h1 className="mt-8 text-4xl sm:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            {BRAND}
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/60">
          {MESSAGE}
        </p>

        {CONTACT_EMAIL && (
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Get in touch
          </a>
        )}

        <p className="mt-12 text-xs text-white/30">© {BRAND}</p>
      </div>
    </main>
  )
}
