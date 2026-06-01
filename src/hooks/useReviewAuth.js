// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { useContent } from './useContent'

const SESSION_KEY = 'review_auth'

// Simple password-based auth for the client review portal.
// Password is stored in the 'review_config' content section (admin namespace).
// Unlocked state is stored in sessionStorage — cleared when the browser tab closes.
export function useReviewAuth() {
  const { content: config, loading } = useContent('review_config')

  const [unlocked, setUnlocked] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === '1' } catch { return false }
  })

  const hasPassword = !!(config?.password)

  // Returns true on success, false on wrong password.
  const unlock = (input) => {
    if (!config?.password) return false
    if (input === config.password) {
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch {}
      setUnlocked(true)
      return true
    }
    return false
  }

  const lock = () => {
    try { sessionStorage.removeItem(SESSION_KEY) } catch {}
    setUnlocked(false)
  }

  return { unlocked, unlock, lock, loading, hasPassword }
}
