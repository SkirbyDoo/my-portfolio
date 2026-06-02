// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { useContent } from './useContent'

const SESSION_KEY      = 'review_auth'
const LOCKOUT_KEY      = 'review_lockout'
const MAX_ATTEMPTS     = 5
const LOCKOUT_MS       = 15 * 60 * 1000  // 15 minutes

// ── Lockout helpers ───────────────────────────────────────────────────────────
function getLockout() {
  try { return JSON.parse(localStorage.getItem(LOCKOUT_KEY) || '{}') } catch { return {} }
}
function saveLockout(state) {
  try { localStorage.setItem(LOCKOUT_KEY, JSON.stringify(state)) } catch {}
}
function clearLockout() {
  try { localStorage.removeItem(LOCKOUT_KEY) } catch {}
}

// ── Hook ──────────────────────────────────────────────────────────────────────
// Simple password-based auth for the client review portal.
// Password is stored in the 'review_config' content section (admin namespace).
// Unlocked state is stored in sessionStorage — cleared when the browser tab closes.
// Lockout state is stored in localStorage — persists across tabs and refreshes.
export function useReviewAuth() {
  const { content: config, loading } = useContent('review_config')

  const [unlocked, setUnlocked] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === '1' } catch { return false }
  })

  const [lockout, setLockoutLocal] = useState(getLockout)

  const isLocked     = !!(lockout.lockedUntil && Date.now() < lockout.lockedUntil)
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - (lockout.attempts || 0))
  const hasPassword  = !!(config?.password)

  // Returns true on success, false on wrong password or locked out.
  const unlock = (input) => {
    const current = getLockout()

    // Bail immediately if still locked
    if (current.lockedUntil && Date.now() < current.lockedUntil) return false

    if (!config?.password) return false

    if (input === config.password) {
      clearLockout()
      setLockoutLocal({})
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch {}
      setUnlocked(true)
      return true
    }

    // Wrong password — increment attempt counter
    const attempts   = (current.attempts || 0) + 1
    const lockedUntil = attempts >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : null
    const newState   = { attempts, lockedUntil }
    saveLockout(newState)
    setLockoutLocal(newState)
    return false
  }

  const lock = () => {
    try { sessionStorage.removeItem(SESSION_KEY) } catch {}
    setUnlocked(false)
  }

  return {
    unlocked,
    unlock,
    lock,
    loading,
    hasPassword,
    isLocked,
    lockedUntil: lockout.lockedUntil ?? null,
    attemptsLeft,
  }
}
