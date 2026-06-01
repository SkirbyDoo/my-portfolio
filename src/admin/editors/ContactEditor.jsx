import SectionEditor from '../components/SectionEditor'
import { useState, useEffect } from 'react'
import { useContent } from '../../hooks/useContent'
import toast from 'react-hot-toast'

export default function ContactEditor() {
  const { content, loading, namespace, saveContent, publishContent, undoLastSave, fetchHistory, restoreVersion } = useContent('contact')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => { if (content) setForm(content) }, [content])

  if (loading || !form) return <div className="text-gray-400 text-sm p-4">Loading...</div>

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    const { error } = await saveContent(form)
    if (error) toast.error('Save failed.')
    else toast.success('Contact section saved!')
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
      else toast.success(namespace === 'review_draft' ? 'Published to demo site!' : 'Contact section published to live site!')
    } catch (err) {
      console.error('[ContactEditor] publish error:', err)
      toast.error('Publish failed unexpectedly.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <SectionEditor
      title="Contact Section"
      description="Contact info and inquiry form"
      form={form}
      onFormChange={setForm}
      onSave={handleSave}
      onUndo={handleUndo}
      saving={saving}
      onPublish={handlePublish}
      publishing={publishing}
      previewHref="/#contact"
      onFetchHistory={fetchHistory}
      onRestoreVersion={restoreVersion}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
          <input type="text" value={form.badge || ''} onChange={e => set('badge', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
          <input type="text" value={form.headline} onChange={e => set('headline', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
          <input type="text" value={form.subheadline || ''} onChange={e => set('subheadline', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input type="tel" value={form.phone || ''} onChange={e => set('phone', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1 (555) 000-0000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input type="email" value={form.email || ''} onChange={e => set('email', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="hello@yourbrand.com" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea rows={2} value={form.address || ''} onChange={e => set('address', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="123 Main Street, Suite 100&#10;Your City, ST 00000" />
        </div>
      </div>
    </SectionEditor>
  )
}
