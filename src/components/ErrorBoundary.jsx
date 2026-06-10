import { Component } from 'react'

// Detects stale-asset / dynamic-import failures. These happen when a tab that
// was opened before a deploy tries to load a hashed chunk whose filename has
// since changed — the classic post-deploy "white screen".
export function isStaleAssetError(err) {
  const msg = `${err?.name || ''} ${err?.message || ''}`
  return /Loading chunk|ChunkLoadError|dynamically imported module|Importing a module script failed|Failed to fetch dynamically/i.test(msg)
}

// Reload at most once per short window, so a genuinely-broken state can never
// trap the user in an endless reload loop.
export function reloadOnce() {
  try {
    const KEY = 'iv_reload_ts'
    const last = Number(sessionStorage.getItem(KEY) || 0)
    if (Date.now() - last < 10000) return false
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch { /* sessionStorage may be unavailable */ }
  window.location.reload()
  return true
}

export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    // A stale-asset crash self-heals by reloading to the fresh version.
    if (isStaleAssetError(error)) reloadOnce()
    // (Other errors fall through to the recovery screen below.)
  }

  render() {
    if (!this.state.failed) return this.props.children

    // Last-resort recovery screen. Inline styles only — if the failure was a
    // stylesheet/asset load, Tailwind classes might not be available.
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#1a1a1a', background: '#ffffff',
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Just a moment…</h1>
        <p style={{ color: '#666', margin: '0 0 1.5rem', maxWidth: '28rem', lineHeight: 1.5 }}>
          We hit a snag loading the latest version of the site. A quick reload usually fixes it.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none',
            background: '#1a1a1a', color: '#fff', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
          }}
        >
          Reload
        </button>
      </div>
    )
  }
}
