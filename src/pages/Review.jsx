// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useReviewAuth } from '../hooks/useReviewAuth'
import { useSettings } from '../hooks/useContent'
import ReviewPanel from '../admin/ReviewPanel'

// ── Password gate ─────────────────────────────────────────────────────────────
function PasswordGate({ siteName, onUnlock, loading: configLoading, hasPassword }) {
  const [password, setPassword]   = useState('')
  const [error,    setError]      = useState('')
  const [checking, setChecking]   = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!password) return
    setChecking(true)
    const ok = onUnlock(password)
    if (!ok) {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
    setChecking(false)
  }

  if (configLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!hasPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock size={22} className="text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Review Portal Not Set Up</h1>
          <p className="text-gray-500 text-sm">
            Your designer hasn't enabled the client review portal yet.
            Ask them to set a review password in their admin settings.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo / title */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {siteName || 'Website Review'}
          </h1>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Your designer has shared this site for your review.<br />
            Enter the password they provided to get started.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: '16px' }}
              placeholder="Enter your review password"
              autoFocus
              autoComplete="current-password"
            />
            {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={checking || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm"
          >
            {checking ? 'Checking…' : 'Enter Review Portal'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Your changes are saved privately and won&apos;t affect the live site until your designer approves them.
        </p>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Review() {
  const { unlocked, unlock, lock, loading, hasPassword } = useReviewAuth()
  const { settings } = useSettings()
  const siteName = settings?.site_name || settings?.seo_title || ''

  if (unlocked) {
    return <ReviewPanel onExit={lock} />
  }

  return (
    <PasswordGate
      siteName={siteName}
      onUnlock={unlock}
      loading={loading}
      hasPassword={hasPassword}
    />
  )
}
