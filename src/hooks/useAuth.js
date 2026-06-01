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
  // In demo mode, simulate a logged-in admin session
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

  const signIn = async (email, password) => {
    if (DEMO_MODE) { setSession({ user: { email } }); return { error: null } }
    const db = await getSupabase()
    const { error } = await db.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signOut = async () => {
    if (DEMO_MODE) { setSession(null); return }
    const db = await getSupabase()
    await db.auth.signOut()
    setSession(null)
  }

  return { session, loading, signIn, signOut }
}
