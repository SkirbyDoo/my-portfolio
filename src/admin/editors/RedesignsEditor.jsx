// RedesignsEditor — CLIENT-SPECIFIC custom editor (NOT a core dashboard file).
// Edits the `redesigns` content section: a LIST of redesign demos that powers
// the index at /redesigns (src/pages/Redesigns.jsx) and each detail page at
// /redesigns/<slug> (src/pages/RedesignDetail.jsx).
//
// Standalone editor (no SectionEditor wrapper / block canvas). Provides its own
// toolbar (Save Draft / Publish to Live Site / Undo / Preview) mirroring the
// standard publish model, plus add/remove/reorder of redesigns with image
// uploads and structured copy for each one.
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2, Undo2, ExternalLink, Send, ChevronUp, ChevronDown } from 'lucide-react'
import { useContent } from '../../hooks/useContent'
import { useContentNamespace } from '../../contexts/ContentNamespaceContext'
import ImageUpload from '../../components/ui/ImageUpload'
import Button from '../../components/ui/Button'
import { slugify } from '../../lib/slugify'

// ── small field primitives ───────────────────────────────────────────────────
function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

function Text({ value, onChange, placeholder }) {
  return <input type="text" value={value ?? ''} placeholder={placeholder}
    onChange={e => onChange(e.target.value)} className={inputCls} />
}

function Area({ value, onChange, rows = 4, placeholder }) {
  return <textarea rows={rows} value={value ?? ''} placeholder={placeholder} onChange={e => onChange(e.target.value)}
    className={`${inputCls} resize-none leading-relaxed`} />
}

function GroupCard({ title, children, right }) {
  return (
    <section className="border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4 bg-white">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold text-gray-800 flex-1 min-w-0 truncate">{title}</h3>
        {right}
      </div>
      {children}
    </section>
  )
}

// ── string-list editor (change bullets) ──────────────────────────────────────
function StringList({ items, onChange, addLabel, placeholder }) {
  const set = (i, val) => onChange(items.map((x, idx) => idx === i ? val : x))
  const add = () => onChange([...(items || []), ''])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-2">
      {(items || []).map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <input type="text" value={it} placeholder={placeholder}
            onChange={e => set(i, e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 shrink-0" title="Remove">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  )
}

const NEW_REDESIGN = () => ({
  slug: '', name: '', category: '', blurb: '', thumbnail: '',
  summary: '', previewUrl: '', previewNote: 'This preview is private. Contact me for the access password.',
  overviewHeading: 'Overview', overviewBody: '',
  challengeHeading: 'The Challenge', challengeBody: '',
  changesHeading: 'What I Changed', changes: [],
  beforeImage: '', afterImage: '', gallery: [],
})

export default function RedesignsEditor() {
  const namespace = useContentNamespace()
  const { content, loading, saveContent, publishContent, undoLastSave } = useContent('redesigns')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => { if (content) setForm(content) }, [content])

  if (loading || !form) return <div className="text-gray-400 text-sm p-8">Loading…</div>

  const showPublish = !namespace
  const items = form.items || []

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
  const setItems = (next) => setForm(prev => ({ ...prev, items: next }))
  const setItem = (i, key, val) => setItems(items.map((it, idx) => idx === i ? { ...it, [key]: val } : it))

  // Update name, and keep the slug auto-synced unless it was manually customized.
  const setName = (i, val) => setItems(items.map((it, idx) => {
    if (idx !== i) return it
    const autoSynced = !it.slug || it.slug === slugify(it.name)
    return { ...it, name: val, slug: autoSynced ? slugify(val) : it.slug }
  }))

  const addItem = () => setItems([...items, NEW_REDESIGN()])
  const removeItem = (i) => {
    if (!window.confirm(`Remove "${items[i].name || 'this redesign'}"? This can be undone with Undo until you publish.`)) return
    setItems(items.filter((_, idx) => idx !== i))
  }
  const moveItem = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    setItems(next)
  }

  // gallery (array of image URLs) helpers
  const setGallery = (i, next) => setItem(i, 'gallery', next)
  const addGalleryImage = (i) => setGallery(i, [...(items[i].gallery || []), ''])
  const removeGalleryImage = (i, gi) => setGallery(i, (items[i].gallery || []).filter((_, idx) => idx !== gi))
  const setGalleryImage = (i, gi, url) => setGallery(i, (items[i].gallery || []).map((g, idx) => idx === gi ? url : g))

  const handleSave = async () => {
    setSaving(true)
    const { error } = await saveContent(form)
    if (error) toast.error('Save failed.')
    else toast.success('Redesigns saved!')
    setSaving(false)
  }

  const handleUndo = async () => {
    const { error } = await undoLastSave()
    if (error) toast.error('Nothing to undo.')
    else toast.success('Changes undone!')
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const { error } = await publishContent(form)
      if (error) toast.error(error.message || 'Publish failed.')
      else toast.success('Redesigns published to live site!')
    } catch (err) {
      console.error('[RedesignsEditor] publish error:', err)
      toast.error('Publish failed unexpectedly.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="flex flex-col min-h-[420px]">
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-white border-b border-gray-200 shrink-0 sticky top-0 z-10">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">Redesigns</p>
          <p className="hidden sm:block text-xs text-gray-400 truncate">Prospect demos at /redesigns — add projects, screenshots &amp; private preview links</p>
        </div>

        <a
          href="/redesigns"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors shrink-0"
        >
          <ExternalLink size={12} /> Preview
        </a>

        <button
          onClick={handleUndo}
          title="Undo last save"
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-1.5 sm:px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
        >
          <Undo2 size={13} />
          <span className="hidden sm:inline">Undo</span>
        </button>

        <Button onClick={handleSave} disabled={saving} variant="secondary" size="sm" className="shrink-0">
          {saving ? 'Saving…' : <><span className="hidden sm:inline">Save Draft</span><span className="sm:hidden">Save</span></>}
        </Button>

        {showPublish && (
          <Button
            onClick={handlePublish}
            disabled={publishing}
            variant="success"
            size="sm"
            className="shrink-0"
            title="Publish redesigns to your live site"
          >
            <Send size={13} className="mr-1.5" />
            <span className="hidden sm:inline">{publishing ? 'Publishing…' : 'Publish to Live Site'}</span>
            <span className="sm:hidden">{publishing ? '…' : 'Publish'}</span>
          </Button>
        )}
      </div>

      {showPublish && (
        <div className="px-3 sm:px-5 py-2 bg-emerald-50 border-b border-emerald-200 shrink-0">
          <p className="hidden sm:block text-xs text-emerald-800">
            <span className="font-semibold">Save Draft</span> keeps changes private &nbsp;·&nbsp;
            <span className="font-semibold">Publish to Live Site</span> makes them visible to visitors
          </p>
          <p className="sm:hidden text-xs text-emerald-700 font-medium">Publish = visible to visitors</p>
        </div>
      )}

      {/* Form */}
      <div className="p-3 sm:p-5 space-y-5 bg-gray-50 flex-1 overflow-y-auto">

        <GroupCard title="Page header (top of /redesigns)">
          <Field label="Badge (small label above the title)">
            <Text value={form.badge} onChange={v => set('badge', v)} placeholder="Redesigns" />
          </Field>
          <Field label="Headline">
            <Text value={form.headline} onChange={v => set('headline', v)} placeholder="Site redesigns I built" />
          </Field>
          <Field label="Sub-headline">
            <Area value={form.subheadline} onChange={v => set('subheadline', v)} rows={2} />
          </Field>
        </GroupCard>

        {items.map((item, i) => {
          const slug = (item.slug && slugify(item.slug)) || slugify(item.name)
          const folder = `redesigns/${slug || 'misc'}`
          return (
            <GroupCard
              key={i}
              title={`${i + 1}. ${item.name || 'Untitled redesign'}`}
              right={
                <div className="flex items-center gap-0.5 shrink-0">
                  <button onClick={() => moveItem(i, -1)} disabled={i === 0}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent" title="Move up">
                    <ChevronUp size={16} />
                  </button>
                  <button onClick={() => moveItem(i, 1)} disabled={i === items.length - 1}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent" title="Move down">
                    <ChevronDown size={16} />
                  </button>
                  <button onClick={() => removeItem(i)}
                    className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 ml-1" title="Remove redesign">
                    <Trash2 size={16} />
                  </button>
                </div>
              }
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Business name">
                  <Text value={item.name} onChange={v => setName(i, v)} placeholder="Danville Tree Service" />
                </Field>
                <Field label="Category (small label)">
                  <Text value={item.category} onChange={v => setItem(i, 'category', v)} placeholder="Tree Service · Website Redesign" />
                </Field>
              </div>

              <Field label="URL slug" hint={`Page address: /redesigns/${slug || '…'} — auto-filled from the name; edit only if needed.`}>
                <Text value={item.slug} onChange={v => setItem(i, 'slug', slugify(v))} placeholder="danville-tree-service" />
              </Field>

              <Field label="Card blurb (short, shown on the /redesigns grid)">
                <Area value={item.blurb} onChange={v => setItem(i, 'blurb', v)} rows={2} />
              </Field>

              <Field label="Card thumbnail" hint="Shown on the grid. If blank, the After image is used.">
                <ImageUpload value={item.thumbnail} onChange={url => setItem(i, 'thumbnail', url)} folder={folder} label="Card thumbnail" />
              </Field>

              <div className="pt-3 border-t border-gray-100 space-y-4">
                <Field label="Hero summary (under the title on the detail page)">
                  <Area value={item.summary} onChange={v => setItem(i, 'summary', v)} rows={2} />
                </Field>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Private preview (top &amp; bottom CTA)</p>
                <Field label="Preview link (password-protected Vercel URL)" hint="Set password protection on the Vercel deployment itself. Leave blank to show a “Request a Preview” button instead.">
                  <Text value={item.previewUrl} onChange={v => setItem(i, 'previewUrl', v)} placeholder="https://danville-preview.vercel.app" />
                </Field>
                <Field label="Preview note (shown next to the lock icon)">
                  <Text value={item.previewNote} onChange={v => setItem(i, 'previewNote', v)} placeholder="This preview is private. Contact me for the access password." />
                </Field>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-4">
                <Field label="Overview heading">
                  <Text value={item.overviewHeading} onChange={v => setItem(i, 'overviewHeading', v)} placeholder="Overview" />
                </Field>
                <Field label="Overview body">
                  <Area value={item.overviewBody} onChange={v => setItem(i, 'overviewBody', v)} rows={4} />
                </Field>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-4">
                <Field label="Challenge heading">
                  <Text value={item.challengeHeading} onChange={v => setItem(i, 'challengeHeading', v)} placeholder="The Challenge" />
                </Field>
                <Field label="Challenge body">
                  <Area value={item.challengeBody} onChange={v => setItem(i, 'challengeBody', v)} rows={4} />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <ImageUpload value={item.beforeImage} onChange={url => setItem(i, 'beforeImage', url)} folder={folder} label="Before (old site)" />
                  <ImageUpload value={item.afterImage} onChange={url => setItem(i, 'afterImage', url)} folder={folder} label="After (redesign)" />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-4">
                <Field label="“What I changed” heading">
                  <Text value={item.changesHeading} onChange={v => setItem(i, 'changesHeading', v)} placeholder="What I Changed" />
                </Field>
                <Field label="Bullet points">
                  <StringList items={item.changes} onChange={v => setItem(i, 'changes', v)} addLabel="Add bullet" placeholder="What you changed…" />
                </Field>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Gallery (extra screenshots)</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(item.gallery || []).map((g, gi) => (
                    <div key={gi} className="relative">
                      <ImageUpload value={g} onChange={url => setGalleryImage(i, gi, url)} folder={folder} label={`Screenshot ${gi + 1}`} />
                      <button onClick={() => removeGalleryImage(i, gi)}
                        className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1 text-red-400 hover:text-red-600 shadow-sm" title="Remove screenshot">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => addGalleryImage(i)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                  <Plus size={14} /> Add screenshot
                </button>
              </div>
            </GroupCard>
          )
        })}

        <button
          onClick={addItem}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium text-sm"
        >
          <Plus size={16} /> Add a redesign
        </button>

      </div>
    </div>
  )
}
