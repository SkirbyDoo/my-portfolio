// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import { Lock, Clock } from 'lucide-react'
import { useReviewAuth } from '../hooks/useReviewAuth'
import { useSettings } from '../hooks/useContent'
import ReviewPanel from '../admin/ReviewPanel'

// ── Countdown helper ──────────────────────────────────────────────────────────
function useCountdown(lockedUntil) {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    if (!lockedUntil) { setDisplay(''); return }

    const tick = () => {
      const remaining = Math.max(0, lockedUntil - Date.now())
      if (remaining === 0) { setDisplay(''); return }
      const mins = Math.floor(remaining / 60000)
      const secs = Math.floor((remaining % 60000) / 1000)
      setDisplay(`${mins}:${secs.toString().padStart(2, '0')}`)
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [lockedUntil])

  return display
}

// ── Password gate ─────────────────────────────────────────────────────────────
function PasswordGate({ siteName, onUnlock, loading: configLoading, hasPassword, isLocked, lockedUntil, attemptsLeft, designerEmail }) {
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [checking, setChecking] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const countdown = useCountdown(isLocked ? lockedUntil : null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!password || isLocked) return
    setChecking(true)
    const ok = onUnlock(password)
    if (!ok) {
      if (attemptsLeft <= 1) {
        setError('Too many incorrect attempts. Try again in 15 minutes.')
      } else {
        setError(`Incorrect password. ${attemptsLeft - 1} attempt${attemptsLeft - 1 === 1 ? '' : 's'} remaining.`)
      }
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
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${isLocked ? 'bg-red-100' : 'bg-blue-600'}`}>
            {isLocked
              ? <Clock size={22} className="text-red-500" />
              : <Lock size={22} className="text-white" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {siteName || 'Website Review'}
          </h1>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Your designer has shared this site for your review.<br />
            Enter the password they provided to get started.
          </p>
        </div>

        {/* Locked state */}
        {isLocked ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
            <p className="text-sm font-semibold text-red-700">Too many incorrect attempts</p>
            <p className="text-xs text-red-500">
              This portal is temporarily locked. Please try again in:
            </p>
            <p className="text-3xl font-mono font-bold text-red-600">{countdown || '15:00'}</p>
            <p className="text-xs text-red-400">minutes : seconds</p>
          </div>
        ) : (
          /* Form */
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
              {!error && attemptsLeft < 5 && attemptsLeft > 0 && (
                <p className="text-amber-500 text-xs mt-1.5">
                  {attemptsLeft} attempt{attemptsLeft === 1 ? '' : 's'} remaining before lockout
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={checking || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              {checking ? 'Checking…' : 'Enter Review Portal'}
            </button>
          </form>
        )}

        {/* Forgot password */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowForgot(v => !v)}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
          >
            Forgot your password?
          </button>

          {showForgot && (
            <div className="mt-3 bg-white border border-gray-200 rounded-xl p-4 text-left shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-1">Need help getting in?</p>
              <p className="text-xs text-gray-500 mb-3">
                Your review password was set by your designer. Contact them to get a new one or have it resent to you.
              </p>
              {designerEmail ? (
                <a
                  href={`mailto:${designerEmail}?subject=Review Portal Password&body=Hi, I need help accessing the review portal for ${siteName || 'the website'}. Could you resend my password?`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Email your designer →
                </a>
              ) : (
                <p className="text-xs text-gray-400 italic">Contact your designer directly to reset your password.</p>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Your changes are saved privately and won&apos;t affect the live site until your designer approves them.
        </p>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Review() {
  const { unlocked, unlock, lock, loading, hasPassword, isLocked, lockedUntil, attemptsLeft } = useReviewAuth()
  const { settings } = useSettings()
  const siteName     = settings?.site_name || settings?.seo_title || ''
  const designerEmail = settings?.designer_email || ''

  if (unlocked) {
    return <ReviewPanel onExit={lock} />
  }

  return (
    <PasswordGate
      siteName={siteName}
      onUnlock={unlock}
      loading={loading}
      hasPassword={hasPassword}
      isLocked={isLocked}
      lockedUntil={lockedUntil}
      attemptsLeft={attemptsLeft}
      designerEmail={designerEmail}
    />
  )
}
