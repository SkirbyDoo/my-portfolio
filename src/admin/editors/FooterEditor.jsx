// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2, Undo2, ExternalLink, Send } from 'lucide-react'
import { useContent } from '../../hooks/useContent'
import { useContentNamespace } from '../../contexts/ContentNamespaceContext'
import Button from '../../components/ui/Button'

// Universal Footer editor: edits the `footer` content section (tagline, link
// columns, copyright). Brand name, phone, address & social links are pulled from
// Settings (Brand + Social Media) — they are NOT edited here. Standalone (no
// SectionEditor) so there's no block/widget canvas; the footer has a fixed layout.
const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

export default function FooterEditor() {
  const namespace = useContentNamespace()
  const { content, loading, saveContent, publishContent, undoLastSave } = useContent('footer')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => { if (content) setForm(content) }, [content])
  if (loading || !form) return <div className="text-gray-400 text-sm p-8">Loading…</div>

  const showPublish = !namespace
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  // columns: [{ heading, links: [{ label, href }] }]
  const cols = form.columns || []
  const setCols = (next) => set('columns', next)
  const setCol = (ci, key, val) => setCols(cols.map((c, i) => i === ci ? { ...c, [key]: val } : c))
  const addCol = () => setCols([...cols, { heading: 'New Column', links: [] }])
  const removeCol = (ci) => setCols(cols.filter((_, i) => i !== ci))
  const setLink = (ci, li, key, val) => setCol(ci, 'links', (cols[ci].links || []).map((l, i) => i === li ? { ...l, [key]: val } : l))
  const addLink = (ci) => setCol(ci, 'links', [...(cols[ci].links || []), { label: '', href: '' }])
  const removeLink = (ci, li) => setCol(ci, 'links', (cols[ci].links || []).filter((_, i) => i !== li))

  const handleSave = async () => {
    setSaving(true)
    const { error } = await saveContent(form)
    if (error) toast.error('Save failed.')
    else toast.success('Footer saved!')
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
      else toast.success(namespace === 'review_draft' ? 'Published to demo site!' : 'Footer published to live site!')
    } catch (err) {
      console.error('[FooterEditor] publish error:', err)
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
          <p className="text-sm font-semibold text-gray-800 truncate">Footer</p>
          <p className="hidden sm:block text-xs text-gray-400 truncate">Tagline, link columns &amp; copyright</p>
        </div>

        <a href="/" target="_blank" rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors shrink-0">
          <ExternalLink size={12} /> Preview
        </a>

        <button onClick={handleUndo} title="Undo last save"
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-1.5 sm:px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0">
          <Undo2 size={13} />
          <span className="hidden sm:inline">Undo</span>
        </button>

        <Button onClick={handleSave} disabled={saving} variant="secondary" size="sm" className="shrink-0">
          {saving ? 'Saving…' : <><span className="hidden sm:inline">Save Draft</span><span className="sm:hidden">Save</span></>}
        </Button>

        {showPublish && (
          <Button onClick={handlePublish} disabled={publishing} variant="success" size="sm" className="shrink-0"
            title="Publish the footer to your live site">
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

        <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-700">
          Your <span className="font-semibold">business name, phone, address &amp; social links</span> come from{' '}
          <span className="font-semibold">Settings</span> (Brand &amp; Social Media) — edit them once there and they update here automatically.
        </div>

        <section className="border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4 bg-white">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <textarea rows={2} value={form.tagline || ''} onChange={e => set('tagline', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Copyright</label>
            <input type="text" value={form.copyright || ''} onChange={e => set('copyright', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </section>

        <section className="border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">Link columns</h3>
            <button onClick={addCol} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
              <Plus size={14} /> Add column
            </button>
          </div>
          <div className="space-y-4">
            {cols.map((col, ci) => (
              <div key={ci} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <input type="text" value={col.heading || ''} placeholder="Column heading"
                    onChange={e => setCol(ci, 'heading', e.target.value)} className={`${inputCls} font-semibold`} />
                  <button onClick={() => removeCol(ci)} className="text-red-400 hover:text-red-600 shrink-0" title="Remove column">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="space-y-2 pl-1">
                  {(col.links || []).map((link, li) => (
                    <div key={li} className="flex items-center gap-2">
                      <input type="text" value={link.label || ''} placeholder="Label"
                        onChange={e => setLink(ci, li, 'label', e.target.value)} className={inputCls} />
                      <input type="text" value={link.href || ''} placeholder="#services or /page/slug"
                        onChange={e => setLink(ci, li, 'href', e.target.value)} className={inputCls} />
                      <button onClick={() => removeLink(ci, li)} className="text-red-400 hover:text-red-600 shrink-0" title="Remove link">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addLink(ci)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                    <Plus size={12} /> Add link
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
