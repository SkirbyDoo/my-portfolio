import SectionEditor from '../components/SectionEditor'
import { useState, useEffect } from 'react'
import { useContent } from '../../hooks/useContent'
import toast from 'react-hot-toast'

export default function HeroEditor() {
  const { content, loading, namespace, saveContent, publishContent, undoLastSave, fetchHistory, restoreVersion } = useContent('hero')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    if (content) setForm(content)
  }, [content])

  if (loading || !form) return <div className="text-gray-400 text-sm p-4">Loading...</div>

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    const { error } = await saveContent(form)
    if (error) toast.error('Save failed. Please try again.')
    else toast.success('Hero section saved!')
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
      else toast.success(namespace === 'review_draft' ? 'Published to demo site!' : 'Hero section published to live site!')
    } catch (err) {
      console.error('[HeroEditor] publish error:', err)
      toast.error('Publish failed unexpectedly.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <SectionEditor
      title="Hero Section"
      description="Banner at the top of the homepage"
      form={form}
      onFormChange={setForm}
      onSave={handleSave}
      onUndo={handleUndo}
      saving={saving}
      onPublish={handlePublish}
      publishing={publishing}
      previewHref="/"
      onFetchHistory={fetchHistory}
      onRestoreVersion={restoreVersion}
    >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Badge <span className="text-gray-400 font-normal">(small pill above the headline, optional)</span>
          </label>
          <input
            type="text"
            value={form.badge || ''}
            onChange={e => set('badge', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Available for new projects"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Main Headline <span className="text-gray-400 font-normal">(the big text)</span>
          </label>
          <input
            type="text"
            value={form.headline}
            onChange={e => set('headline', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="We Help Businesses Grow Online"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subheadline</label>
          <textarea
            rows={2}
            value={form.subheadline}
            onChange={e => set('subheadline', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="A short sentence that supports your headline"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={form.ctaLabel}
              onChange={e => set('ctaLabel', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
            <input
              type="text"
              value={form.ctaHref}
              onChange={e => set('ctaHref', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#contact"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Text <span className="text-gray-400">(optional)</span></label>
            <input
              type="text"
              value={form.secondaryLabel || ''}
              onChange={e => set('secondaryLabel', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Link</label>
            <input
              type="text"
              value={form.secondaryHref || ''}
              onChange={e => set('secondaryHref', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <p className="text-xs text-gray-500 italic pt-2 border-t border-gray-100">
          The hero uses an animated particle canvas background. No image upload needed.
        </p>
    </SectionEditor>
  )
}
