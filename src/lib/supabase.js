import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const DEMO_MODE = !supabaseUrl || supabaseUrl === 'your_supabase_project_url'

export const supabase = DEMO_MODE ? null : createClient(supabaseUrl, supabaseAnonKey)
