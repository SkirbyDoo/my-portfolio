import { useNavigate, useLocation } from 'react-router-dom'
import { FlaskConical, ArrowLeft, ExternalLink, AlertTriangle } from 'lucide-react'
import { ContentNamespaceContext } from '../contexts/ContentNamespaceContext'

// ── Banner ────────────────────────────────────────────────────────────────────
function PreviewBanner() {
  const navigate     = useNavigate()
  const { pathname } = useLocation()

  // Mirror the current preview path to the live equivalent
  const livePath = pathname.replace(/^\/preview/, '') || '/'

  return (
    <div className="fixed top-0 inset-x-0 z-[9999] shadow-lg" style={{ height: 44 }}>
      {/* Main bar */}
      <div className="flex items-center justify-between gap-3 px-4 h-full bg-sky-700 text-white text-sm font-medium">
        <div className="flex items-center gap-2.5">
          <FlaskConical size={15} className="shrink-0 text-sky-300" />
          <span className="font-bold tracking-wide">DEMO SITE</span>
          <span className="hidden sm:inline text-sky-300 font-normal text-xs">
            — This is a private preview. Changes here do <strong className="text-white">not</strong> affect the live website.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={livePath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-sky-600 hover:bg-sky-500 border border-sky-400 transition-colors text-xs font-semibold"
          >
            <ExternalLink size={11} />
            View Live Site
          </a>
          <button
            onClick={() => navigate('/review')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-sky-800 hover:bg-sky-50 transition-colors text-xs font-semibold"
          >
            <ArrowLeft size={11} />
            Back to Editor
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Demo watermark shown at bottom of every preview page ─────────────────────
function DemoWatermark() {
  return (
    <div className="w-full bg-sky-700 text-white py-3 px-4 mt-8">
      <div className="max-w-site mx-auto flex items-center justify-center gap-2 text-xs text-sky-200">
        <AlertTriangle size={13} className="shrink-0 text-sky-400" />
        <span>
          <strong className="text-white">Demo Preview Only</strong> — This page shows proposed changes for client review.
          Content here is <strong className="text-white">not live</strong> and will not be saved long-term.
        </span>
      </div>
    </div>
  )
}

// ── Wrapper — injects review namespace + banner into any page ─────────────────
export default function PreviewWrapper({ children }) {
  return (
    <ContentNamespaceContext.Provider value="review">
      <PreviewBanner />
      {/* Offset page content below the fixed banner (44px) + navbar (64px) */}
      <div style={{ paddingTop: '108px' }}>
        {children}
        <DemoWatermark />
      </div>
    </ContentNamespaceContext.Provider>
  )
}
