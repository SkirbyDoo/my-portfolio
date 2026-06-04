// TeeRabbitEditor — CLIENT-SPECIFIC custom editor (NOT a core dashboard file).
// Edits the `casestudy_teerabbit` content section that powers the hard-coded
// case study page at /work/teerabbit (src/pages/TeeRabbit.jsx).
//
// This is a STANDALONE editor (it does NOT wrap SectionEditor) so the page keeps
// its bespoke hard-coded layout — no block canvas. It provides its own toolbar
// (Save Draft / Publish to Live Site / Undo / Preview) mirroring the standard
// publish model, plus structured fields + image uploads for every editable bit.
//
// The three feature images (designer, catalog, trust) feed BOTH the slider at
// the top of the page AND their matching feature section below.
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2, Undo2, ExternalLink, Send } from 'lucide-react'
import { useContent } from '../../hooks/useContent'
import { useContentNamespace } from '../../contexts/ContentNamespaceContext'
import ImageUpload from '../../components/ui/ImageUpload'
import Button from '../../components/ui/Button'

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

function Area({ value, onChange, rows = 4 }) {
  return <textarea rows={rows} value={value ?? ''} onChange={e => onChange(e.target.value)}
    className={`${inputCls} resize-none leading-relaxed`} />
}

function GroupCard({ title, children }) {
  return (
    <section className="border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4 bg-white">
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      {children}
    </section>
  )
}

// ── string-list editor (service chips) ────────────────────────────────────────
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

export default function TeeRabbitEditor() {
  const namespace = useContentNamespace()
  const { content, loading, saveContent, publishContent, undoLastSave } = useContent('casestudy_teerabbit')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => { if (content) setForm(content) }, [content])

  if (loading || !form) return <div className="text-gray-400 text-sm p-8">Loading…</div>

  const showPublish = !namespace
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
  const setImage = (key, url) => setForm(prev => ({ ...prev, images: { ...(prev.images || {}), [key]: url } }))

  const setHighlight = (i, key, val) =>
    set('highlights', form.highlights.map((h, idx) => idx === i ? { ...h, [key]: val } : h))
  const addHighlight = () => set('highlights', [...(form.highlights || []), { value: '', label: '' }])
  const removeHighlight = (i) => set('highlights', form.highlights.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    setSaving(true)
    const { error } = await saveContent(form)
    if (error) toast.error('Save failed.')
    else toast.success('Tee Rabbit case study saved!')
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
      else toast.success('Tee Rabbit case study published to live site!')
    } catch (err) {
      console.error('[TeeRabbitEditor] publish error:', err)
      toast.error('Publish failed unexpectedly.')
    } finally {
      setPublishing(false)
    }
  }

  const images = form.images || {}

  return (
    <div className="flex flex-col min-h-[420px]">
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-white border-b border-gray-200 shrink-0 sticky top-0 z-10">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">Tee Rabbit Case Study</p>
          <p className="hidden sm:block text-xs text-gray-400 truncate">Custom page at /work/teerabbit — edit copy, stats &amp; images</p>
        </div>

        <a
          href="/work/teerabbit"
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
            title="Publish this case study to your live site"
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

        <GroupCard title="Hero">
          <Field label="Eyebrow (small label above title)">
            <Text value={form.eyebrow} onChange={v => set('eyebrow', v)} />
          </Field>
          <Field label="Title">
            <Text value={form.title} onChange={v => set('title', v)} />
          </Field>
          <Field label="Summary">
            <Area value={form.summary} onChange={v => set('summary', v)} rows={3} />
          </Field>
          <Field label="Live Site URL" hint="Shows a “Visit Live Site” button when set. e.g. https://www.teerabbit.com">
            <Text value={form.liveUrl} onChange={v => set('liveUrl', v)} placeholder="https://www.teerabbit.com" />
          </Field>
        </GroupCard>

        <GroupCard title="Overview">
          <Field label="Heading">
            <Text value={form.overviewHeading} onChange={v => set('overviewHeading', v)} />
          </Field>
          <Field label="Body">
            <Area value={form.overviewBody} onChange={v => set('overviewBody', v)} rows={5} />
          </Field>
          <Field label="Service chips">
            <StringList items={form.services} onChange={v => set('services', v)} addLabel="Add service" placeholder="e.g. Screen printing" />
          </Field>
        </GroupCard>

        <GroupCard title="Slider (the 3-image showcase carousel)">
          <Field label="Heading">
            <Text value={form.sliderHeading} onChange={v => set('sliderHeading', v)} />
          </Field>
          <Field label="Body">
            <Area value={form.sliderBody} onChange={v => set('sliderBody', v)} rows={3} />
          </Field>
          <Field label="Slider images" hint="The three rotating slides. Leave any blank to reuse the matching feature image below.">
            <div className="grid sm:grid-cols-3 gap-4">
              <ImageUpload value={images.slide1} onChange={url => setImage('slide1', url)} folder="teerabbit" label="Slide 1 — Designer" />
              <ImageUpload value={images.slide2} onChange={url => setImage('slide2', url)} folder="teerabbit" label="Slide 2 — Catalog" />
              <ImageUpload value={images.slide3} onChange={url => setImage('slide3', url)} folder="teerabbit" label="Slide 3 — Reviews" />
            </div>
          </Field>
        </GroupCard>

        <GroupCard title="Feature 1 — Custom T-Shirt Designer">
          <Field label="Heading">
            <Text value={form.designerHeading} onChange={v => set('designerHeading', v)} />
          </Field>
          <Field label="Body">
            <Area value={form.designerBody} onChange={v => set('designerBody', v)} rows={4} />
          </Field>
          <Field label="Image" hint="Used for Slide 1 of the top slider when no dedicated Slide 1 image is set.">
            <ImageUpload value={images.designer} onChange={url => setImage('designer', url)} folder="teerabbit" label="Custom designer screenshot" />
          </Field>
        </GroupCard>

        <GroupCard title="Feature 2 — Product Catalogs">
          <Field label="Heading">
            <Text value={form.catalogHeading} onChange={v => set('catalogHeading', v)} />
          </Field>
          <Field label="Body">
            <Area value={form.catalogBody} onChange={v => set('catalogBody', v)} rows={4} />
          </Field>
          <Field label="Image" hint="Used for Slide 2 of the top slider when no dedicated Slide 2 image is set.">
            <ImageUpload value={images.catalog} onChange={url => setImage('catalog', url)} folder="teerabbit" label="Product catalog screenshot" />
          </Field>
        </GroupCard>

        <GroupCard title="Feature 3 — Trust Index (reviews carousel)">
          <Field label="Heading">
            <Text value={form.trustHeading} onChange={v => set('trustHeading', v)} />
          </Field>
          <Field label="Body">
            <Area value={form.trustBody} onChange={v => set('trustBody', v)} rows={4} />
          </Field>
          <Field label="Image" hint="Used for Slide 3 of the top slider when no dedicated Slide 3 image is set.">
            <ImageUpload value={images.trust} onChange={url => setImage('trust', url)} folder="teerabbit" label="Trust-index / reviews screenshot" />
          </Field>
        </GroupCard>

        <GroupCard title="Highlights">
          <Field label="Heading">
            <Text value={form.highlightsHeading} onChange={v => set('highlightsHeading', v)} />
          </Field>
          <div className="space-y-3">
            {(form.highlights || []).map((h, i) => (
              <div key={i} className="flex items-start gap-3 border border-gray-200 rounded-lg p-3">
                <div className="flex-1 grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Value</label>
                    <input type="text" value={h.value} onChange={e => setHighlight(i, 'value', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                    <input type="text" value={h.label} onChange={e => setHighlight(i, 'label', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <button onClick={() => removeHighlight(i)} className="text-red-400 hover:text-red-600 shrink-0 mt-5" title="Remove">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button onClick={addHighlight} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
              <Plus size={14} /> Add highlight
            </button>
          </div>
        </GroupCard>

        <GroupCard title="Call to Action">
          <Field label="Heading">
            <Text value={form.ctaHeading} onChange={v => set('ctaHeading', v)} />
          </Field>
          <Field label="Body">
            <Area value={form.ctaBody} onChange={v => set('ctaBody', v)} rows={2} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Button label">
              <Text value={form.ctaLabel} onChange={v => set('ctaLabel', v)} />
            </Field>
            <Field label="Button link" hint="e.g. /#pricing or /#contact">
              <Text value={form.ctaHref} onChange={v => set('ctaHref', v)} />
            </Field>
          </div>
        </GroupCard>

      </div>
    </div>
  )
}
