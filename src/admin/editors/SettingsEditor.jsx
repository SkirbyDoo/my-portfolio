import { useState, useEffect } from 'react'
import {
  useSettings, useContent, copyToReview,
  fetchGlobalHistory, restoreGlobalEntry,
  fetchSiteSnapshots, saveSiteSnapshot, deleteSiteSnapshot, restoreSiteSnapshot,
} from '../../hooks/useContent'
import { useContentNamespace } from '../../contexts/ContentNamespaceContext'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Copy, Check, Send, SplitSquareHorizontal, Clock, RotateCcw, Camera, Trash2, Upload, X } from 'lucide-react'
import { useRef } from 'react'
import { supabase } from '../../lib/supabase'

const FONT_OPTIONS = ['Inter', 'Roboto', 'Lato', 'Poppins', 'Open Sans', 'Montserrat', 'Nunito']
const HEADING_FONT_OPTIONS = [
  // Bold modern sans-serifs (recommended for portfolio/SaaS)
  'Plus Jakarta Sans', 'Space Grotesk', 'Outfit', 'Manrope', 'Sora',
  // Neutral sans-serifs
  'Inter', 'Poppins',
  // Editorial serifs
  'Playfair Display', 'Merriweather', 'Lora', 'Cormorant Garamond',
]

const SECTION_LABELS = {
  hero:         'Hero',
  services:     'Services',
  pricing:      'Pricing',
  portfolio:    'Portfolio',
  about:        'About',
  testimonials: 'Testimonials',
  contact:      'Contact',
  navigation:   'Navigation',
  footer:       'Footer',
  custom_pages: 'Custom Pages',
  page_labels:  'Page Labels',
}

function formatAge(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7)  return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

// ── Global history: last 50 saves across all sections ─────────────────────────
function GlobalHistoryPanel() {
  const [entries,   setEntries]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [restoring, setRestoring] = useState(null)

  useEffect(() => {
    fetchGlobalHistory().then(e => { setEntries(e); setLoading(false) })
  }, [])

  const handleRestore = async (entry) => {
    setRestoring(entry.id)
    const { error } = await restoreGlobalEntry(entry)
    if (error) toast.error('Restore failed.')
    else {
      toast.success(`${SECTION_LABELS[entry.section] ?? entry.section} restored!`)
      const updated = await fetchGlobalHistory()
      setEntries(updated)
    }
    setRestoring(null)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-8 text-sm text-gray-400">
      <span className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mr-2" />Loading…
    </div>
  )

  if (entries.length === 0) return (
    <div className="py-8 text-center">
      <Clock size={24} className="mx-auto text-gray-200 mb-2" />
      <p className="text-sm font-medium text-gray-500">No saves yet</p>
      <p className="text-xs text-gray-400 mt-1">Saves will appear here as you edit sections.</p>
    </div>
  )

  return (
    <div className="space-y-1 max-h-96 overflow-y-auto pr-0.5">
      {entries.map((entry, i) => (
        <div key={entry.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-800">
                {SECTION_LABELS[entry.section] ?? entry.section}
              </span>
              {i === 0 && <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Latest</span>}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">{formatAge(entry.saved_at)} · {formatDate(entry.saved_at)}</p>
          </div>
          <button
            onClick={() => handleRestore(entry)}
            disabled={!!restoring}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium shrink-0 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 disabled:opacity-50 transition-colors"
          >
            {restoring === entry.id
              ? <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              : <RotateCcw size={11} />}
            Restore
          </button>
        </div>
      ))}
    </div>
  )
}

// ── Manual site snapshots: user-labeled, up to 10 ───────────────────────────
const MAX_SNAPSHOTS = 10

function SiteSnapshotsPanel() {
  const [snapshots, setSnapshots] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [label,     setLabel]     = useState('')
  const [saving,    setSaving]    = useState(false)
  const [restoring, setRestoring] = useState(null)
  const [deleting,  setDeleting]  = useState(null)

  const load = async () => {
    setLoading(true)
    setSnapshots(await fetchSiteSnapshots())
    setLoading(false)
  }
  useEffect(() => { load() }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  const atMax = snapshots.length >= MAX_SNAPSHOTS

  const handleSave = async () => {
    if (!label.trim()) return
    setSaving(true)
    const { error } = await saveSiteSnapshot(label)
    if (error) toast.error(error.message)
    else { toast.success('Snapshot saved!'); setLabel(''); await load() }
    setSaving(false)
  }

  const handleRestore = async (snap) => {
    if (!window.confirm(`Restore the entire site to "${snap.label}"?\n\nThis overwrites all current content. Each section's current state will be saved to Recent Saves first so you can undo section by section if needed.`)) return
    setRestoring(snap.id)
    const { error } = await restoreSiteSnapshot(snap)
    if (error) toast.error('Restore failed.')
    else toast.success(`Site restored to "${snap.label}"!`)
    setRestoring(null)
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    await deleteSiteSnapshot(id)
    setSnapshots(prev => prev.filter(s => s.id !== id))
    setDeleting(null)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-8 text-sm text-gray-400">
      <span className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mr-2" />Loading…
    </div>
  )

  return (
    <div>
      {/* Save row */}
      <div className="flex gap-2 mb-3">
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !atMax && handleSave()}
          disabled={atMax}
          placeholder={atMax ? 'Delete a snapshot to save a new one' : 'Label this snapshot…'}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          onClick={handleSave}
          disabled={saving || atMax || !label.trim()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0"
        >
          {saving
            ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Camera size={13} />}
          Save Snapshot
        </button>
      </div>

      {/* Count pill */}
      <p className="text-xs text-gray-400 mb-3">
        <span className={atMax ? 'font-semibold text-amber-600' : ''}>{snapshots.length}</span> / {MAX_SNAPSHOTS} snapshots
      </p>

      {/* List */}
      {snapshots.length === 0 ? (
        <div className="py-10 text-center rounded-xl border border-dashed border-gray-200">
          <Camera size={24} className="mx-auto text-gray-200 mb-2" />
          <p className="text-sm font-medium text-gray-500">No snapshots yet</p>
          <p className="text-xs text-gray-400 mt-1">Give this moment a label and click Save Snapshot.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {snapshots.map(snap => (
            <div key={snap.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{snap.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(snap.saved_at)}</p>
              </div>
              <button
                onClick={() => handleRestore(snap)}
                disabled={!!restoring || !!deleting}
                title="Restore entire site to this snapshot"
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 disabled:opacity-40 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
              >
                {restoring === snap.id
                  ? <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  : <RotateCcw size={11} />}
                Restore
              </button>
              <button
                onClick={() => handleDelete(snap.id)}
                disabled={!!restoring || !!deleting}
                title="Delete this snapshot"
                className="flex items-center justify-center w-7 h-7 text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 rounded-lg transition-colors shrink-0"
              >
                {deleting === snap.id
                  ? <span className="w-3 h-3 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                  : <Trash2 size={13} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FaviconUpload({ value, onChange }) {
  const inputRef = useRef()
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const filename = `favicon/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('site-images').upload(filename, file, { upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('site-images').getPublicUrl(filename)
      onChange(data.publicUrl)
      toast.success('Favicon uploaded!')
    } catch {
      toast.error('Upload failed.')
    }
    setUploading(false)
  }

  return (
    <div className="mt-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Favicon <span className="text-gray-400 font-normal">(browser tab icon)</span>
      </label>

      <div className="flex items-center gap-3">
        {/* Preview square */}
        <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
          {value
            ? <img src={value} alt="Favicon" className="w-7 h-7 object-contain" />
            : <span className="text-lg select-none">🌐</span>
          }
        </div>

        {/* Upload button */}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50"
        >
          {uploading ? <span className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" /> : <Upload size={12} />}
          {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload'}
        </button>

        {/* Remove button */}
        {value && (
          <button
            onClick={() => onChange('')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={11} /> Remove
          </button>
        )}

        {/* Inline tips */}
        <p className="text-xs text-gray-400 ml-1">PNG, 512×512px, square. Simple logo or icon works best.</p>
      </div>
    </div>
  )
}

export default function SettingsEditor() {
  const namespace   = useContentNamespace()
  const isReview    = namespace === 'review'

  const { session }                         = useAuth()
  const { settings, loading, saveSettings } = useSettings()
  const { content: reviewConfig, saveContent: saveReviewConfig } = useContent('review_config')
  const [form,          setForm]         = useState({})
  const [tab,           setTab]          = useState('settings')
  const [section,       setSection]      = useState('brand')
  const [saving,        setSaving]       = useState(false)
  const [reviewPass,    setReviewPass]   = useState('')
  const [showPass,      setShowPass]     = useState(false)
  const [savingReview,  setSavingReview] = useState(false)
  const [sending,       setSending]      = useState(false)
  const [urlCopied,     setUrlCopied]    = useState(false)

  useEffect(() => { if (Object.keys(settings).length > 0) setForm(settings) }, [settings])
  useEffect(() => { if (reviewConfig?.password) setReviewPass(reviewConfig.password) }, [reviewConfig])

  if (loading || Object.keys(form).length === 0) return <div className="text-gray-400 text-sm p-4">Loading...</div>

  // A user is a developer if their email appears in the comma-separated developer_emails setting.
  const developerEmails = (settings.developer_emails || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
  const currentEmail    = session?.user?.email?.toLowerCase() ?? ''
  const isDeveloper     = developerEmails.length === 0 || developerEmails.includes(currentEmail)

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const reviewUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/review`
    : '/review'

  const handleSaveReviewPassword = async () => {
    if (!reviewPass.trim()) return
    setSavingReview(true)
    const { error } = await saveReviewConfig({ ...(reviewConfig || {}), password: reviewPass.trim() })
    if (error) toast.error('Failed to save password.')
    else toast.success('Review password saved!')
    setSavingReview(false)
  }

  const handleSendToClient = async () => {
    setSending(true)
    await copyToReview()
    toast.success('Published to client review portal!')
    setSending(false)
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(reviewUrl).then(() => {
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    })
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await saveSettings(form)
    if (error) toast.error('Save failed.')
    else toast.success('Settings saved! Reload to see changes.')
    setSaving(false)
  }

  // Tab definitions — Web Developer tab only visible to developers (not clients, not review portal)
  const TABS = [
    { id: 'settings', label: 'Settings' },
    ...(isDeveloper && !isReview ? [{ id: 'developer', label: 'Web Developer' }] : []),
  ]

  return (
    <div className="p-6 lg:p-8">

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">Site Settings</h2>
        <p className="text-sm text-gray-500">Control your brand colors, fonts, and SEO settings</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-7">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Settings tab ──────────────────────────────────────────────── */}
      {tab === 'settings' && <div className="space-y-6">

      {/* Settings sub-nav */}
      {(() => {
        const SETTINGS_SECTIONS = [
          { id: 'brand',      label: 'Brand'      },
          { id: 'colors',     label: 'Colors'     },
          { id: 'fonts',      label: 'Fonts'      },
          { id: 'typography', label: 'Typography' },
          { id: 'seo',        label: 'SEO'        },
          { id: 'domain',     label: 'Domain'     },
          { id: 'history',    label: 'History'    },
        ]
        return (
          <div className="flex flex-wrap gap-1.5">
            {SETTINGS_SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  section === s.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )
      })()}

      {/* ── Brand ── */}
      {section === 'brand' && <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Brand</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input type="text" value={form.site_name || ''} onChange={e => set('site_name', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <FaviconUpload value={form.favicon || ''} onChange={val => set('favicon', val)} />
        </div>
        <div className="pt-2 border-t border-gray-100">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>}

      {/* ── Colors ── */}
      {section === 'colors' && <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Colors</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'primary_color',    label: 'Primary (text/headings)' },
              { key: 'accent_color',     label: 'Accent (buttons/links)'  },
              { key: 'bg_color',         label: 'Background'              },
              { key: 'text_color',       label: 'Body Text'               },
              { key: 'text_muted_color', label: 'Muted Text'              },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form[key] || '#000000'} onChange={e => set(key, e.target.value)}
                    className="w-10 h-10 rounded border border-gray-200 cursor-pointer p-0.5" />
                  <input type="text" value={form[key] || ''} onChange={e => set(key, e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-2 border-t border-gray-100">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>}

      {/* ── Fonts ── */}
      {section === 'fonts' && <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Fonts</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heading Font</label>
              <select value={form.font_heading || 'Plus Jakarta Sans'} onChange={e => set('font_heading', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {HEADING_FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body Font</label>
              <select value={form.font_body || 'Inter'} onChange={e => set('font_body', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-100">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>}

      {/* ── Typography ── */}
      {section === 'typography' && <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-1">Typography</h3>
        <p className="text-xs text-gray-400 mb-4">Override the default heading and body sizes. Leave blank to use the theme default.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: 'type_h1_size',   label: 'H1 Font Size',    placeholder: 'e.g. 3rem or 48px' },
            { key: 'type_h2_size',   label: 'H2 Font Size',    placeholder: 'e.g. 2rem or 32px' },
            { key: 'type_h3_size',   label: 'H3 Font Size',    placeholder: 'e.g. 1.5rem or 24px' },
            { key: 'type_body_size', label: 'Body Font Size',  placeholder: 'e.g. 1rem or 16px' },
            { key: 'type_h1_weight', label: 'H1 Font Weight',  placeholder: 'e.g. 700 or bold' },
            { key: 'type_h2_weight', label: 'H2 Font Weight',  placeholder: 'e.g. 700' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type="text" value={form[key] || ''} onChange={e => set(key, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder} />
            </div>
          ))}
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          {[
            { key: 'type_h1_color', label: 'H1 Color Override' },
            { key: 'type_h2_color', label: 'H2 Color Override' },
            { key: 'type_link_color', label: 'Link Color Override' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form[key] || '#000000'} onChange={e => set(key, e.target.value)}
                  className="w-10 h-10 rounded border border-gray-200 cursor-pointer p-0.5" />
                <input type="text" value={form[key] || ''} onChange={e => set(key, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Leave blank for theme default" />
              </div>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-gray-100">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
        </div>
      </div>}

      {/* ── SEO ── */}
      {section === 'seo' && <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-1">SEO</h3>
          <p className="text-xs text-gray-400 mb-4">This is what appears in Google search results and when your site is shared on social media.</p>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Title <span className="text-gray-400">(appears in browser tab)</span></label>
              <input type="text" value={form.seo_title || ''} onChange={e => set('seo_title', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="YourBrand — Professional Web Solutions" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description <span className="text-gray-400">(1-2 sentences)</span></label>
              <textarea rows={2} value={form.seo_description || ''} onChange={e => set('seo_description', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="We build professional websites that grow your business." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID <span className="text-gray-400">(optional, looks like G-XXXXXXXX)</span></label>
              <input type="text" value={form.google_analytics_id || ''} onChange={e => set('google_analytics_id', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="G-XXXXXXXXXX" />
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-100">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>}

      {/* ── Domain ── */}
      {section === 'domain' && <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-1">Custom Domain</h3>
          <p className="text-xs text-gray-400 mb-4">Enter the domain you want to use for this website (e.g. <span className="font-mono">www.yourbusiness.com</span>).</p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Domain</label>
            <input
              type="text"
              value={form.custom_domain || ''}
              onChange={e => set('custom_domain', e.target.value)}
              placeholder="www.yourbusiness.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="rounded-xl border border-gray-200 overflow-hidden text-sm">
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
              <p className="font-semibold text-gray-700">How to connect your domain</p>
              <p className="text-xs text-gray-400 mt-0.5">Log into your domain registrar (GoDaddy, Namecheap, Squarespace, etc.) and add the following DNS records.</p>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="px-4 py-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Option 1 — www address <span className="normal-case font-normal text-gray-400">(recommended)</span></p>
                <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 text-xs font-mono">
                  <div className="grid grid-cols-3 gap-x-4 px-3 py-1.5 bg-gray-100 text-gray-500 font-sans font-semibold"><span>Type</span><span>Name</span><span>Value</span></div>
                  <div className="grid grid-cols-3 gap-x-4 px-3 py-2 text-gray-700"><span className="text-blue-600">CNAME</span><span>www</span><span className="text-gray-500 truncate">cname.vercel-dns.com</span></div>
                </div>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Option 2 — root domain <span className="normal-case font-normal text-gray-400">(yourbusiness.com without www)</span></p>
                <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 text-xs font-mono">
                  <div className="grid grid-cols-3 gap-x-4 px-3 py-1.5 bg-gray-100 text-gray-500 font-sans font-semibold"><span>Type</span><span>Name</span><span>Value</span></div>
                  <div className="grid grid-cols-3 gap-x-4 px-3 py-2 text-gray-700"><span className="text-blue-600">A</span><span>@</span><span>76.76.21.21</span></div>
                </div>
              </div>
              <div className="px-4 py-3 bg-amber-50 text-xs text-amber-800 space-y-1">
                <p>⏱ <strong>DNS changes can take up to 48 hours</strong> to fully propagate — usually much faster.</p>
                <p>🔧 <strong>Final step:</strong> Send your domain to your web developer so they can add it inside the hosting platform to complete the connection.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-100">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>}

      {/* ── History ── */}
      {section === 'history' && <div className="space-y-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Publish History</h3>

        {/* Site snapshots */}
        <div>
          <p className="text-sm font-medium text-gray-800 mb-1">Site Snapshots</p>
          <p className="text-xs text-gray-400 mb-3">
            Save up to 10 labeled checkpoints of the entire site. Restore any one to roll everything back at once. Each section&apos;s current state is saved to Recent Saves first, so you can still undo individual sections if needed.
          </p>
          <SiteSnapshotsPanel />
        </div>

        {/* Recent saves */}
        <div>
          <p className="text-sm font-medium text-gray-800 mb-1">Recent Saves</p>
          <p className="text-xs text-gray-400 mb-3">
            The last 50 saves across all sections. Restore any entry to bring that section back to that exact state.
          </p>
          <GlobalHistoryPanel />
        </div>
      </div>}

      </div>} {/* end settings tab */}

      {/* ── Web Developer tab ─────────────────────────────────────────── */}
      {tab === 'developer' && isDeveloper && !isReview && <div className="space-y-8">

      {/* Client Review Portal */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-1">Client Review Portal</h3>
        <p className="text-xs text-gray-400 mb-4">
          Share a password-protected link with your client so they can preview and edit a private copy of this site.
          Their changes are saved separately and won&apos;t affect your live content until you choose to apply them.
        </p>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Review Password</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showPass ? 'text' : 'password'}
                value={reviewPass}
                onChange={e => setReviewPass(e.target.value)}
                placeholder="Set a password for your client"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <Button onClick={handleSaveReviewPassword} disabled={savingReview || !reviewPass.trim()}>
              {savingReview ? 'Saving…' : 'Save'}
            </Button>
          </div>
          {reviewConfig?.password && (
            <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
              <Check size={11} /> Password is set
            </p>
          )}
        </div>

        {/* Shareable URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Review Link</label>
          <div className="flex gap-2">
            <input
              readOnly
              value={reviewUrl}
              className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 font-mono text-gray-600 focus:outline-none"
            />
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
            >
              {urlCopied ? <><Check size={13} className="text-green-500" /> Copied</> : <><Copy size={13} /> Copy</>}
            </button>
          </div>
        </div>

        {/* Send snapshot */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm font-medium text-blue-900 mb-1">Send Current Site to Client</p>
          <p className="text-xs text-blue-700 mb-3">
            This copies your current content into the client&apos;s review portal so they start with an up-to-date version of your site.
            Run this any time you want to push your latest changes to them.
          </p>
          <button
            onClick={handleSendToClient}
            disabled={sending || !reviewConfig?.password}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Send size={14} /> {sending ? 'Publishing…' : 'Publish to Client'}
          </button>
          {!reviewConfig?.password && (
            <p className="text-xs text-blue-600 mt-2">Set a password above first.</p>
          )}
        </div>

        {/* Compare previews */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-900 mb-1">Compare Versions</p>
          <p className="text-xs text-gray-500 mb-3">
            Open both versions side by side to see exactly what the client changed vs your live site.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="/preview"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <SplitSquareHorizontal size={14} /> Preview Client Copy
            </a>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Eye size={14} /> View Live Site
            </a>
          </div>
        </div>
      </div>

      {/* Developer Access */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-1">Developer Access</h3>
        <p className="text-xs text-gray-400 mb-4">
          Only users whose email is listed here will see the Web Developer tab.
          Clients who log into <code className="bg-gray-100 px-1 rounded">/admin</code> won&apos;t see developer controls.
          Separate multiple emails with commas.
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Developer Email(s)</label>
          <input
            type="text"
            value={form.developer_emails || ''}
            onChange={e => set('developer_emails', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com, colleague@example.com"
          />
        </div>
        <div className="mt-4 flex items-center gap-3 pt-2 border-t border-gray-100">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Developer Settings'}</Button>
        </div>
      </div>

      </div>} {/* end developer tab */}

    </div>
  )
}
