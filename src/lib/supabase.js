// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const DEMO_MODE = !supabaseUrl || supabaseUrl === 'your_supabase_project_url'

export const supabase = DEMO_MODE ? null : createClient(supabaseUrl, supabaseAnonKey)
