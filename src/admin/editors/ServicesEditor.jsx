import SectionEditor from '../components/SectionEditor'
import { useState, useEffect } from 'react'
import { useContent } from '../../hooks/useContent'
import toast from 'react-hot-toast'
import { Plus, Trash2, GripVertical } from 'lucide-react'

const ICON_OPTIONS = ['Zap', 'Shield', 'TrendingUp', 'Headphones', 'Smartphone', 'BarChart',
  'Star', 'Heart', 'Globe', 'Code', 'Layers', 'Settings', 'Users', 'MessageCircle',
  'CheckCircle', 'Award', 'Briefcase', 'Clock', 'DollarSign', 'Lock']

export default function ServicesEditor() {
  const { content, loading, namespace, saveContent, publishContent, undoLastSave, fetchHistory, restoreVersion } = useContent('services')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => { if (content) setForm(content) }, [content])

  if (loading || !form) return <div className="text-gray-400 text-sm p-4">Loading...</div>

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const setItem = (id, key, val) => {
    set('items', form.items.map(item => item.id === id ? { ...item, [key]: val } : item))
  }

  const addItem = () => {
    set('items', [...(form.items || []), {
      id: String(Date.now()), icon: 'Star', title: 'New Service', description: 'Describe this service here.'
    }])
  }

  const removeItem = (id) => set('items', form.items.filter(item => item.id !== id))

  const handleSave = async () => {
    setSaving(true)
    const { error } = await saveContent(form)
    if (error) toast.error('Save failed.')
    else toast.success('Services section saved!')
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
      else toast.success(namespace === 'review_draft' ? 'Published to demo site!' : 'Services section published to live site!')
    } catch (err) {
      console.error('[ServicesEditor] publish error:', err)
      toast.error('Publish failed unexpectedly.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <SectionEditor
      title="What We Offer"
      description="Services / features grid"
      form={form}
      onFormChange={setForm}
      onSave={handleSave}
      onUndo={handleUndo}
      saving={saving}
      onPublish={handlePublish}
      publishing={publishing}
      previewHref="/#services"
      onFetchHistory={fetchHistory}
      onRestoreVersion={restoreVersion}
    >
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
          <input type="text" value={form.badge || ''} onChange={e => set('badge', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
          <input type="text" value={form.headline} onChange={e => set('headline', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
          <input type="text" value={form.subheadline || ''} onChange={e => set('subheadline', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Service Cards</label>
          <button onClick={addItem} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
            <Plus size={14} /> Add Service
          </button>
        </div>
        <div className="space-y-4">
          {form.items?.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <GripVertical size={16} className="text-gray-300" />
                <div className="flex-1 grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                    <select value={item.icon} onChange={e => setItem(item.id, 'icon', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input type="text" value={item.title} onChange={e => setItem(item.id, 'title', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea rows={2} value={item.description} onChange={e => setItem(item.id, 'description', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionEditor>
  )
}
