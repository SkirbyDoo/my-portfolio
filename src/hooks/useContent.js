// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react'
import { DEFAULT_CONTENT, DEFAULT_SETTINGS } from '../lib/defaultContent'
import { useContentNamespace } from '../contexts/ContentNamespaceContext'
import { REVIEW_SECTIONS, SNAPSHOT_SECTIONS } from '../client/clientConfig'

const DEMO_MODE = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url'

// Lazy-load supabase only when credentials are present
let supabase = null
async function getSupabase() {
  if (!supabase && !DEMO_MODE) {
    const mod = await import('../lib/supabase')
    supabase = mod.supabase
  }
  return supabase
}

// ── Demo-mode persistence helpers ─────────────────────────────────────────────
const LS_PREFIX              = 'demo_content_'
const LS_HISTORY_PREFIX      = 'demo_history_'       // per-section undo history
const LS_GLOBAL_HISTORY_KEY  = 'demo_global_history' // cross-section save timeline
const LS_SITE_SNAPSHOTS_KEY  = 'demo_site_snapshots' // user-labeled manual snapshots

function lsGet(section) {
  try {
    const raw = localStorage.getItem(LS_PREFIX + section)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function lsSet(section, content) {
  try { localStorage.setItem(LS_PREFIX + section, JSON.stringify(content)) } catch {}
}

function lsDel(section) {
  try { localStorage.removeItem(LS_PREFIX + section) } catch {}
}

// Per-section undo history
function lsGetHistory(nsKey) {
  try {
    const raw = localStorage.getItem(LS_HISTORY_PREFIX + nsKey)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function lsPushHistory(nsKey, content) {
  try {
    const history = lsGetHistory(nsKey)
    history.unshift({ id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, content, saved_at: new Date().toISOString() })
    localStorage.setItem(LS_HISTORY_PREFIX + nsKey, JSON.stringify(history.slice(0, 50)))
  } catch {}
}

// Global cross-section save timeline (admin namespace only)
function lsGetGlobalHistory() {
  try {
    const raw = localStorage.getItem(LS_GLOBAL_HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function lsPushGlobalHistory(section, nsKey, content) {
  try {
    const history = lsGetGlobalHistory()
    history.unshift({ id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, section, nsKey, content, saved_at: new Date().toISOString() })
    localStorage.setItem(LS_GLOBAL_HISTORY_KEY, JSON.stringify(history.slice(0, 50)))
  } catch {}
}

// User-managed site snapshots
function lsGetSiteSnapshots() {
  try {
    const raw = localStorage.getItem(LS_SITE_SNAPSHOTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function lsSaveSiteSnapshots(snapshots) {
  try { localStorage.setItem(LS_SITE_SNAPSHOTS_KEY, JSON.stringify(snapshots)) } catch {}
}

// ── Shared in-memory store (same tab, instant updates) ────────────────────────
const _cache     = {}
const _listeners = {}

// BroadcastChannel — pushes content changes to all other same-origin tabs/windows
// (e.g. review portal → preview tab, without needing a page refresh)
const _bc = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel('site_content_sync')
  : null

if (_bc) {
  _bc.onmessage = (e) => {
    const { section, content } = e.data || {}
    if (!section) return
    _cache[section] = content
    _listeners[section]?.forEach(fn => fn(content))
  }
}

function _subscribe(section, setState) {
  if (!_listeners[section]) _listeners[section] = new Set()
  _listeners[section].add(setState)
  return () => _listeners[section].delete(setState)
}

function _broadcast(section, newContent, persist = true) {
  _cache[section] = newContent
  if (DEMO_MODE && persist) lsSet(section, newContent)
  // Always persist review_* content to localStorage so other tabs can read it on load/refresh
  if (!DEMO_MODE && persist && section.startsWith('review_')) lsSet(section, newContent)
  _listeners[section]?.forEach(fn => fn(newContent))
  // Notify other tabs
  _bc?.postMessage({ section, content: newContent })
}

// ── useContent ────────────────────────────────────────────────────────────────
export function useContent(section, { global: bypassPublished = false } = {}) {
  const rawNamespace = useContentNamespace()
  // { global: true } skips the 'published' namespace so the section always reads
  // from the plain key (draft). Review namespaces are preserved so the preview
  // site still reads from review_* keys.
  const namespace    = (bypassPublished && rawNamespace === 'published') ? '' : rawNamespace
  const nsKey        = namespace ? `${namespace}_${section}` : section

  const [content, setContent] = useState(() => {
    if (_cache[nsKey]) return _cache[nsKey]
    if (DEMO_MODE) {
      const stored = lsGet(nsKey)
      if (stored) { _cache[nsKey] = stored; return stored }
      // published_* fallback: if no published version yet, show the draft
      if (namespace === 'published') {
        return _cache[section] ?? lsGet(section) ?? DEFAULT_CONTENT[section] ?? null
      }
      return DEFAULT_CONTENT[section] ?? null
    }
    // Supabase mode: review_* and review_draft_* content persisted to localStorage for cross-tab/refresh access
    if (namespace === 'review' || namespace === 'review_draft') {
      const stored = lsGet(nsKey)
      if (stored) { _cache[nsKey] = stored; return stored }
    }
    return null
  })
  const [loading, setLoading] = useState(!DEMO_MODE)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (_cache[nsKey]) { setContent(_cache[nsKey]); return }
    if (DEMO_MODE) {
      const stored = lsGet(nsKey)
      if (stored) { _cache[nsKey] = stored; setContent(stored) }
      else if (namespace === 'published') {
        // Fallback to draft when no published version exists yet
        setContent(_cache[section] ?? lsGet(section) ?? DEFAULT_CONTENT[section] ?? null)
      } else {
        setContent(DEFAULT_CONTENT[section] ?? null)
      }
      return
    }
    // Supabase mode: seed from localStorage for review/draft content while Supabase fetch is in-flight
    if (namespace === 'review' || namespace === 'review_draft') {
      const stored = lsGet(nsKey)
      if (stored) { _cache[nsKey] = stored; setContent(stored) }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nsKey])

  useEffect(() => _subscribe(nsKey, setContent), [nsKey])

  const fetchContent = useCallback(async () => {
    if (DEMO_MODE) return
    setLoading(true)
    try {
      const db = await getSupabase()
      const { data, error } = await db
        .from('site_content')
        .select('content')
        .eq('section', nsKey)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('[useContent] fetchContent error:', error, 'section:', nsKey)
        setError(error)
      }

      let resolvedContent = data?.content

      // Fallback for published namespace: use draft if no published version exists yet
      if (resolvedContent == null && namespace === 'published') {
        const { data: draftData } = await db
          .from('site_content')
          .select('content')
          .eq('section', section)
          .single()
        resolvedContent = draftData?.content
      }

      // Fallback for review/draft namespaces: use localStorage copy (written by saveContent)
      if (resolvedContent == null && (namespace === 'review' || namespace === 'review_draft')) {
        resolvedContent = lsGet(nsKey) ?? null
      }

      // Fallback for review namespace: show published (or draft) content when no
      // review_* row exists yet — so the demo site always shows real content, never blanks.
      if (resolvedContent == null && namespace === 'review') {
        const { data: pubData } = await db
          .from('site_content')
          .select('content')
          .eq('section', `published_${section}`)
          .single()
        if (pubData?.content != null) {
          resolvedContent = pubData.content
        } else {
          const { data: draftData } = await db
            .from('site_content')
            .select('content')
            .eq('section', section)
            .single()
          resolvedContent = draftData?.content ?? null
        }
      }

      _broadcast(nsKey, resolvedContent ?? DEFAULT_CONTENT[section] ?? null, false)
    } catch (err) {
      console.error('[useContent] fetchContent threw:', err, 'section:', nsKey)
    } finally {
      setLoading(false)
    }
  }, [nsKey, section, namespace])

  useEffect(() => { fetchContent() }, [fetchContent])

  const saveContent = async (newContent) => {
    if (DEMO_MODE) {
      const current = _cache[nsKey] ?? lsGet(nsKey)
      if (current != null) {
        lsPushHistory(nsKey, current)
        if (!nsKey.startsWith('review_')) lsPushGlobalHistory(section, nsKey, current)
      }
      _broadcast(nsKey, newContent)
      return { error: null }
    }
    const db = await getSupabase()
    if (content) {
      const { error: histErr } = await db.from('content_history').insert({ section: nsKey, content })
      if (histErr) console.warn('[useContent] history insert failed:', histErr, 'section:', nsKey)
    }
    const { error } = await db
      .from('site_content')
      .upsert({ section: nsKey, content: newContent, updated_at: new Date().toISOString() }, { onConflict: 'section' })
    if (error) {
      console.error('[useContent] saveContent upsert failed:', error, 'section:', nsKey)
    } else {
      // Persist review_* content to localStorage so other tabs and page refreshes can read it
      if (nsKey.startsWith('review_')) lsSet(nsKey, newContent)
      _broadcast(nsKey, newContent, false)
    }
    return { error }
  }

  const undoLastSave = async () => {
    if (DEMO_MODE) {
      lsDel(nsKey)
      _broadcast(nsKey, DEFAULT_CONTENT[section] ?? null)
      return { error: null }
    }
    const db = await getSupabase()
    const { data, error } = await db
      .from('content_history')
      .select('*')
      .eq('section', nsKey)
      .order('saved_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) return { error: error || new Error('No history found') }

    const { error: restoreError } = await db
      .from('site_content')
      .upsert({ section: nsKey, content: data.content, updated_at: new Date().toISOString() }, { onConflict: 'section' })

    if (!restoreError) {
      await db.from('content_history').delete().eq('id', data.id)
      _broadcast(nsKey, data.content, false)
    }
    return { error: restoreError }
  }

  const publishContent = async (newContent) => {
    // Determine publish target based on namespace:
    //   admin ('')         → published_*   (goes live on the public site)
    //   review_draft       → review_*      (appears on the /preview demo site)
    //   anything else      → not allowed
    let publishedKey
    if (!namespace) {
      publishedKey = `published_${section}`
    } else if (namespace === 'review_draft') {
      publishedKey = `review_${section}`
    } else {
      return { error: new Error('Cannot publish from this context.') }
    }

    // 1. Save the draft first (into the current namespace)
    const { error: draftError } = await saveContent(newContent)
    if (draftError) return { error: draftError }

    // 2. Write to the publish target
    if (DEMO_MODE) {
      _broadcast(publishedKey, newContent)
      return { error: null }
    }

    const db = await getSupabase()
    const { error } = await db
      .from('site_content')
      .upsert({ section: publishedKey, content: newContent, updated_at: new Date().toISOString() }, { onConflict: 'section' })
    if (error) {
      console.error('[useContent] publishContent upsert failed:', error, 'target:', publishedKey)
    } else {
      if (publishedKey.startsWith('review_')) lsSet(publishedKey, newContent)
      _broadcast(publishedKey, newContent, false)
    }
    return { error }
  }

  const fetchHistory = useCallback(async () => {
    if (DEMO_MODE) return lsGetHistory(nsKey)
    const db = await getSupabase()
    const { data } = await db
      .from('content_history')
      .select('id, content, saved_at')
      .eq('section', nsKey)
      .order('saved_at', { ascending: false })
      .limit(50)
    return data || []
  }, [nsKey])

  const restoreVersion = useCallback(async (entry) => {
    if (DEMO_MODE) {
      const current = _cache[nsKey] ?? lsGet(nsKey)
      if (current != null) lsPushHistory(nsKey, current)
      const filtered = lsGetHistory(nsKey).filter(h => h.id !== entry.id)
      try { localStorage.setItem(LS_HISTORY_PREFIX + nsKey, JSON.stringify(filtered)) } catch {}
      _broadcast(nsKey, entry.content)
      return { error: null }
    }
    const db = await getSupabase()
    const current = _cache[nsKey]
    if (current != null) await db.from('content_history').insert({ section: nsKey, content: current })
    const { error } = await db
      .from('site_content')
      .upsert({ section: nsKey, content: entry.content, updated_at: new Date().toISOString() }, { onConflict: 'section' })
    if (!error) {
      await db.from('content_history').delete().eq('id', entry.id)
      _broadcast(nsKey, entry.content, false)
    }
    return { error }
  }, [nsKey])

  return { content, loading, error, namespace, saveContent, publishContent, undoLastSave, fetchHistory, restoreVersion, refetch: fetchContent }
}

// ── copyToReview ──────────────────────────────────────────────────────────────
// REVIEW_SECTIONS is imported from src/client/clientConfig.js

export async function copyToReview() {
  const db = DEMO_MODE ? null : await getSupabase()

  for (const section of REVIEW_SECTIONS) {
    const content = _cache[section] ?? lsGet(section) ?? DEFAULT_CONTENT[section]
    if (content == null) continue
    const nsKey = `review_${section}`
    if (DEMO_MODE) {
      _broadcast(nsKey, content)
    } else {
      await db.from('site_content').upsert(
        { section: nsKey, content, updated_at: new Date().toISOString() },
        { onConflict: 'section' }
      )
      _broadcast(nsKey, content, false)
    }
  }
}

// ── useSettings ───────────────────────────────────────────────────────────────
export function useSettings() {
  const [settings, setSettings] = useState(DEMO_MODE ? DEFAULT_SETTINGS : {})
  const [loading,  setLoading]  = useState(!DEMO_MODE)

  useEffect(() => {
    if (DEMO_MODE) return
    getSupabase().then(db =>
      db.from('site_settings').select('key, value').then(({ data }) => {
        if (data && data.length > 0) {
          const map = {}
          data.forEach(row => { map[row.key] = row.value })
          setSettings(map)
        } else {
          setSettings(DEFAULT_SETTINGS)
        }
        setLoading(false)
      })
    )
  }, [])

  const saveSetting = async (key, value) => {
    if (DEMO_MODE) { setSettings(prev => ({ ...prev, [key]: value })); return { error: null } }
    const db = await getSupabase()
    const { error } = await db
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    if (!error) setSettings(prev => ({ ...prev, [key]: value }))
    return { error }
  }

  const saveSettings = async (updates) => {
    if (DEMO_MODE) { setSettings(prev => ({ ...prev, ...updates })); return { error: null } }
    const db = await getSupabase()
    const rows = Object.entries(updates).map(([key, value]) => ({
      key, value: String(value), updated_at: new Date().toISOString()
    }))
    const { error } = await db.from('site_settings').upsert(rows, { onConflict: 'key' })
    if (!error) setSettings(prev => ({ ...prev, ...updates }))
    return { error }
  }

  return { settings, loading, saveSetting, saveSettings }
}

// ── Sections included in site-wide snapshots ──────────────────────────────────
// SNAPSHOT_SECTIONS is imported from src/client/clientConfig.js

// ── fetchGlobalHistory ────────────────────────────────────────────────────────
export async function fetchGlobalHistory() {
  if (DEMO_MODE) return lsGetGlobalHistory()
  const db = await getSupabase()
  const { data } = await db
    .from('content_history')
    .select('id, section, content, saved_at')
    .order('saved_at', { ascending: false })
    .limit(200)
  return (data || [])
    .filter(row => !row.section.startsWith('review_') && row.section !== '_site_snapshot')
    .slice(0, 50)
    .map(row => ({ ...row, nsKey: row.section }))
}

// ── restoreGlobalEntry ────────────────────────────────────────────────────────
export async function restoreGlobalEntry(entry) {
  const nsKey = entry.nsKey || entry.section

  if (DEMO_MODE) {
    const current = _cache[nsKey] ?? lsGet(nsKey)
    if (current != null) {
      lsPushHistory(nsKey, current)
      lsPushGlobalHistory(entry.section, nsKey, current)
    }
    const filtered = lsGetGlobalHistory().filter(h => h.id !== entry.id)
    try { localStorage.setItem(LS_GLOBAL_HISTORY_KEY, JSON.stringify(filtered)) } catch {}
    _broadcast(nsKey, entry.content)
    return { error: null }
  }

  const db = await getSupabase()
  const current = _cache[nsKey]
  if (current != null) await db.from('content_history').insert({ section: nsKey, content: current })
  const { error } = await db.from('site_content')
    .upsert({ section: nsKey, content: entry.content, updated_at: new Date().toISOString() }, { onConflict: 'section' })
  if (!error) {
    await db.from('content_history').delete().eq('id', entry.id)
    _broadcast(nsKey, entry.content, false)
  }
  return { error }
}

// ── fetchSiteSnapshots ────────────────────────────────────────────────────────
// Returns up to 10 user-labeled manual site snapshots, newest first.
export async function fetchSiteSnapshots() {
  if (DEMO_MODE) return lsGetSiteSnapshots()
  const db = await getSupabase()
  const { data } = await db
    .from('content_history')
    .select('id, content, saved_at')
    .eq('section', '_site_snapshot')
    .order('saved_at', { ascending: false })
    .limit(10)
  return (data || []).map(row => ({
    id:       row.id,
    label:    row.content?.label ?? 'Snapshot',
    sections: row.content?.sections ?? {},
    saved_at: row.saved_at,
  }))
}

// ── saveSiteSnapshot ──────────────────────────────────────────────────────────
// Captures the entire site into a labeled snapshot. Max 10.
export async function saveSiteSnapshot(label) {
  if (DEMO_MODE) {
    const existing = lsGetSiteSnapshots()
    if (existing.length >= 10) return { error: new Error('Maximum 10 snapshots reached. Delete one first.') }

    const sections = {}
    for (const s of SNAPSHOT_SECTIONS) {
      sections[s] = _cache[s] ?? lsGet(s) ?? DEFAULT_CONTENT[s] ?? null
    }
    const snapshot = {
      id:       `${Date.now()}_snap`,
      label:    label.trim() || 'Snapshot',
      sections,
      saved_at: new Date().toISOString(),
    }
    lsSaveSiteSnapshots([snapshot, ...existing])
    return { error: null }
  }

  const db = await getSupabase()
  const { count } = await db
    .from('content_history')
    .select('id', { count: 'exact', head: true })
    .eq('section', '_site_snapshot')
  if (count >= 10) return { error: new Error('Maximum 10 snapshots reached. Delete one first.') }

  const { data: allContent } = await db
    .from('site_content')
    .select('section, content')
    .in('section', SNAPSHOT_SECTIONS)

  const sections = {}
  if (allContent) allContent.forEach(row => { sections[row.section] = row.content })

  const { error } = await db.from('content_history').insert({
    section: '_site_snapshot',
    content: { label: label.trim() || 'Snapshot', sections },
  })
  return { error }
}

// ── deleteSiteSnapshot ────────────────────────────────────────────────────────
export async function deleteSiteSnapshot(id) {
  if (DEMO_MODE) {
    lsSaveSiteSnapshots(lsGetSiteSnapshots().filter(s => s.id !== id))
    return { error: null }
  }
  const db = await getSupabase()
  const { error } = await db.from('content_history').delete().eq('id', id).eq('section', '_site_snapshot')
  return { error }
}

// ── restoreSiteSnapshot ───────────────────────────────────────────────────────
// Restores ALL sections from a snapshot. Current state is pushed to global
// history first so the restore is itself undoable section-by-section.
export async function restoreSiteSnapshot(snapshot) {
  if (!snapshot?.sections) return { error: new Error('Invalid snapshot') }

  if (DEMO_MODE) {
    for (const [s, content] of Object.entries(snapshot.sections)) {
      if (content == null) continue
      const current = _cache[s] ?? lsGet(s)
      if (current != null) lsPushGlobalHistory(s, s, current)
      _broadcast(s, content)
    }
    return { error: null }
  }

  const db = await getSupabase()
  for (const [s, content] of Object.entries(snapshot.sections)) {
    if (content == null) continue
    const current = _cache[s]
    if (current != null) await db.from('content_history').insert({ section: s, content: current })
    await db.from('site_content')
      .upsert({ section: s, content, updated_at: new Date().toISOString() }, { onConflict: 'section' })
    _broadcast(s, content, false)
  }
  return { error: null }
}
