// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'

const DEMO_MODE = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url'

let supabase = null
async function getSupabase() {
  if (!supabase && !DEMO_MODE) {
    const mod = await import('../lib/supabase')
    supabase = mod.supabase
  }
  return supabase
}

export function useAuth() {
  const [session, setSession] = useState(DEMO_MODE ? { user: { email: 'demo@admin.com' } } : null)
  const [loading, setLoading] = useState(!DEMO_MODE)

  useEffect(() => {
    if (DEMO_MODE) return
    getSupabase().then(db => {
      db.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setLoading(false)
      })
      const { data: { subscription } } = db.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
      return () => subscription.unsubscribe()
    })
  }, [])

  // ── Step 1: email + password ──────────────────────────────────────────────
  // Returns { error, mfaRequired } — if mfaRequired, show TOTP input next.
  const signIn = async (email, password) => {
    if (DEMO_MODE) { setSession({ user: { email } }); return { error: null, mfaRequired: false } }
    const db = await getSupabase()
    const { error } = await db.auth.signInWithPassword({ email, password })
    if (error) return { error, mfaRequired: false }

    // Check if this account has 2FA enrolled and needs a second factor
    const { data: aal } = await db.auth.mfa.getAuthenticatorAssuranceLevel()
    const mfaRequired = aal?.nextLevel === 'aal2' && aal?.currentLevel !== 'aal2'
    return { error: null, mfaRequired }
  }

  // ── Step 2: verify TOTP code ──────────────────────────────────────────────
  const mfaVerify = async (code) => {
    if (DEMO_MODE) return { error: null }
    const db = await getSupabase()
    const { data: factors } = await db.auth.mfa.listFactors()
    const totpFactor = factors?.totp?.[0]
    if (!totpFactor) return { error: new Error('No authenticator app enrolled') }
    const { data: challenge, error: ce } = await db.auth.mfa.challenge({ factorId: totpFactor.id })
    if (ce) return { error: ce }
    const { error } = await db.auth.mfa.verify({
      factorId: totpFactor.id,
      challengeId: challenge.id,
      code,
    })
    return { error }
  }

  // ── Enroll a new TOTP factor ──────────────────────────────────────────────
  // Returns { data: { id, totp: { qr_code, secret, uri } }, error }
  // qr_code is a base64 SVG data URL — use directly as <img src>.
  const mfaEnroll = async () => {
    if (DEMO_MODE) return { data: null, error: new Error('Not available in demo mode') }
    const db = await getSupabase()
    return db.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Authenticator App' })
  }

  // Confirm enrollment by verifying the first code from the authenticator app
  const mfaConfirmEnroll = async (factorId, code) => {
    if (DEMO_MODE) return { error: null }
    const db = await getSupabase()
    const { data: challenge, error: ce } = await db.auth.mfa.challenge({ factorId })
    if (ce) return { error: ce }
    return db.auth.mfa.verify({ factorId, challengeId: challenge.id, code })
  }

  // List all enrolled factors for the current user
  const mfaListFactors = async () => {
    if (DEMO_MODE) return { data: { totp: [] }, error: null }
    const db = await getSupabase()
    return db.auth.mfa.listFactors()
  }

  // Remove a factor (disables 2FA)
  const mfaUnenroll = async (factorId) => {
    if (DEMO_MODE) return { error: null }
    const db = await getSupabase()
    return db.auth.mfa.unenroll({ factorId })
  }

  // ── Sign out ──────────────────────────────────────────────────────────────
  const signOut = async () => {
    if (DEMO_MODE) { setSession(null); return }
    const db = await getSupabase()
    await db.auth.signOut()
    setSession(null)
  }

  return {
    session,
    loading,
    signIn,
    signOut,
    mfaVerify,
    mfaEnroll,
    mfaConfirmEnroll,
    mfaListFactors,
    mfaUnenroll,
  }
}
