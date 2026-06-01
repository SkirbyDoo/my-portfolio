import SectionEditor from '../components/SectionEditor'
import { useState, useEffect } from 'react'
import { useContent } from '../../hooks/useContent'
import ImageUpload from '../../components/ui/ImageUpload'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'

export default function TestimonialsEditor() {
  const { content, loading, namespace, saveContent, publishContent, undoLastSave, fetchHistory, restoreVersion } = useContent('testimonials')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => { if (content) setForm(content) }, [content])

  if (loading || !form) return <div className="text-gray-400 text-sm p-4">Loading...</div>

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
  const setItem = (id, key, val) => set('items', form.items.map(t => t.id === id ? { ...t, [key]: val } : t))
  const addItem = () => set('items', [...(form.items || []), { id: String(Date.now()), quote: '', name: '', company: '', image: '' }])
  const removeItem = (id) => set('items', form.items.filter(t => t.id !== id))

  const handleSave = async () => {
    setSaving(true)
    const { error } = await saveContent(form)
    if (error) toast.error('Save failed.')
    else toast.success('Testimonials saved!')
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
      else toast.success(namespace === 'review_draft' ? 'Published to demo site!' : 'Testimonials published to live site!')
    } catch (err) {
      console.error('[TestimonialsEditor] publish error:', err)
      toast.error('Publish failed unexpectedly.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <SectionEditor
      title="Testimonials"
      description="Quotes from players and members"
      form={form}
      onFormChange={setForm}
      onSave={handleSave}
      onUndo={handleUndo}
      saving={saving}
      onPublish={handlePublish}
      publishing={publishing}
      previewHref="/#testimonials"
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
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Testimonials</label>
          <button onClick={addItem} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
            <Plus size={14} /> Add Testimonial
          </button>
        </div>
        <div className="space-y-5">
          {form.items?.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-gray-700 text-sm">{item.name || 'New Testimonial'}</h4>
                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Quote</label>
                <textarea rows={3} value={item.quote} onChange={e => setItem(item.id, 'quote', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="What did this client say about working with you?" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Client Name</label>
                  <input type="text" value={item.name} onChange={e => setItem(item.id, 'name', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Company</label>
                  <input type="text" value={item.company} onChange={e => setItem(item.id, 'company', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <ImageUpload
                value={item.image}
                onChange={val => setItem(item.id, 'image', val)}
                folder={`testimonials/${item.id}`}
                label="Client Photo (optional)"
              />
            </div>
          ))}
        </div>
      </div>
    </SectionEditor>
  )
}
