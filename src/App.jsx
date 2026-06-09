import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useSettings } from './hooks/useContent'
import { ContentNamespaceContext } from './contexts/ContentNamespaceContext'
import Home from './pages/Home'
import Admin from './pages/Admin'
import CustomPage from './pages/CustomPage'
import CityHoops from './pages/CityHoops'
import QuickQuote from './pages/QuickQuote'
import TeeRabbit from './pages/TeeRabbit'
import Redesigns from './pages/Redesigns'
import RedesignDetail from './pages/RedesignDetail'
import Review from './pages/Review'
import PreviewWrapper from './pages/PreviewSite'
import ComingSoon from './components/ComingSoon'

// ─────────────────────────────────────────────────────────────────────────────
// COMING SOON gate. While true, the public site (/ and /page/*) shows the
// Coming Soon page. /admin (edit content), /review, and /preview (preview the
// real site) all keep working normally.
// 👉 TO LAUNCH: set this to false and redeploy (commit + push).
// ─────────────────────────────────────────────────────────────────────────────
const COMING_SOON = false

// Secret unlock so YOU can view the real published site past the gate.
// Visit  /?preview=<PREVIEW_KEY>  once — it unlocks this browser (all tabs)
// until you re-lock, so the admin's "View Live Site" button and the domain
// itself show the real site. Visit  /?preview=off  to re-lock.
// (Soft gate: the key ships in the JS bundle — it hides the site from casual
//  visitors, it is NOT security. To see the public gate again, use a private window.)
const PREVIEW_KEY = 'issa-preview-2026'

function PublicGate({ children }) {
  const { search } = useLocation()
  const p = new URLSearchParams(search).get('preview')
  try {
    if (p === PREVIEW_KEY) localStorage.setItem('iv_preview', '1')
    if (p === 'off') localStorage.removeItem('iv_preview')
  } catch {}
  let unlocked = false
  try { unlocked = localStorage.getItem('iv_preview') === '1' } catch {}
  if (COMING_SOON && !unlocked) return <ComingSoon />
  return children
}

function SettingsApplier() {
  const { settings } = useSettings()

  useEffect(() => {
    if (!settings || Object.keys(settings).length === 0) return
    const root = document.documentElement

    if (settings.primary_color) root.style.setProperty('--color-primary', settings.primary_color)
    if (settings.secondary_color) root.style.setProperty('--color-secondary', settings.secondary_color)
    if (settings.accent_color) root.style.setProperty('--color-accent', settings.accent_color)
    if (settings.bg_color) root.style.setProperty('--color-bg', settings.bg_color)
    if (settings.text_color) root.style.setProperty('--color-text', settings.text_color)
    if (settings.text_muted_color) root.style.setProperty('--color-text-muted', settings.text_muted_color)
    if (settings.font_heading) root.style.setProperty('--font-heading', `'${settings.font_heading}', serif`)
    if (settings.font_body) root.style.setProperty('--font-body', `'${settings.font_body}', sans-serif`)
    if (settings.border_radius) root.style.setProperty('--border-radius', settings.border_radius)

    // Typography overrides
    if (settings.type_h1_size)   root.style.setProperty('--type-h1-size',   settings.type_h1_size)
    if (settings.type_h2_size)   root.style.setProperty('--type-h2-size',   settings.type_h2_size)
    if (settings.type_h3_size)   root.style.setProperty('--type-h3-size',   settings.type_h3_size)
    if (settings.type_body_size) root.style.setProperty('--type-body-size', settings.type_body_size)
    if (settings.type_h1_weight) root.style.setProperty('--type-h1-weight', settings.type_h1_weight)
    if (settings.type_h2_weight) root.style.setProperty('--type-h2-weight', settings.type_h2_weight)
    if (settings.type_h1_color)  root.style.setProperty('--type-h1-color',  settings.type_h1_color)
    if (settings.type_h2_color)  root.style.setProperty('--type-h2-color',  settings.type_h2_color)
    if (settings.type_link_color) root.style.setProperty('--type-link-color', settings.type_link_color)

    if (settings.seo_title) document.title = settings.seo_title

    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && settings.seo_description) metaDesc.setAttribute('content', settings.seo_description)
  }, [settings])

  return null
}

// Wraps public-facing pages so they read from the published_* namespace.
// Falls back to draft content when nothing has been published yet.
function PublishedLayout() {
  return (
    <ContentNamespaceContext.Provider value="published">
      <Outlet />
    </ContentNamespaceContext.Provider>
  )
}

// Scrolls to top on every route change, or to the anchor element when a hash is present.
function ScrollRestoration() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      // Poll for the target section — content loads from Supabase after mount,
      // so it may not exist for a few hundred ms. Retry up to ~3s before bailing.
      let tries = 0
      let timer
      const tryScroll = () => {
        const el = document.getElementById(id)
        if (el) { el.scrollIntoView({ behavior: 'smooth' }); return }
        if (tries++ < 30) timer = setTimeout(tryScroll, 100)
        else window.scrollTo({ top: 0, behavior: 'instant' })
      }
      timer = setTimeout(tryScroll, 60)
      return () => clearTimeout(timer)
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <>
      <SettingsApplier />
      <ScrollRestoration />
      <Routes>
        {/* Public-facing pages — read from published_* namespace (falls back to draft if never published) */}
        <Route element={<PublishedLayout />}>
          <Route path="/" element={<PublicGate><Home /></PublicGate>} />
          <Route path="/work/cityhoops" element={<PublicGate><CityHoops /></PublicGate>} />
          <Route path="/work/quick-quote" element={<PublicGate><QuickQuote /></PublicGate>} />
          <Route path="/work/teerabbit" element={<PublicGate><TeeRabbit /></PublicGate>} />
          {/* Redesigns — intentionally NOT behind PublicGate so prospects can view
              their demo even while the main site is in "coming soon" mode. */}
          <Route path="/redesigns" element={<Redesigns />} />
          <Route path="/redesigns/:slug" element={<RedesignDetail />} />
          <Route path="/page/:slug" element={<PublicGate><CustomPage /></PublicGate>} />
        </Route>

        <Route path="/admin/*" element={<Admin />} />
        <Route path="/review/*" element={<Review />} />

        {/* Client preview — live pages rendered with review namespace */}
        <Route path="/preview"            element={<PreviewWrapper><Home /></PreviewWrapper>} />
        <Route path="/preview/page/:slug" element={<PreviewWrapper><CustomPage /></PreviewWrapper>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
