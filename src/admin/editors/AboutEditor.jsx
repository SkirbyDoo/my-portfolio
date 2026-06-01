import SectionEditor from '../components/SectionEditor'
import { useState, useEffect } from 'react'
import { useContent } from '../../hooks/useContent'
import ImageUpload from '../../components/ui/ImageUpload'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'

export default function AboutEditor() {
  const { content, loading, namespace, saveContent, publishContent, undoLastSave, fetchHistory, restoreVersion } = useContent('about')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    if (content) setForm(content)
  }, [content])

  if (loading || !form) return <div className="text-gray-400 text-sm p-4">Loading...</div>

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
  const setStat = (i, key, val) => {
    const stats = [...(form.stats || [])]
    stats[i] = { ...stats[i], [key]: val }
    set('stats', stats)
  }
  const addStat = () => set('stats', [...(form.stats || []), { value: '', label: '' }])
  const removeStat = (i) => set('stats', form.stats.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    setSaving(true)
    const { error } = await saveContent(form)
    if (error) toast.error('Save failed.')
    else toast.success('About section saved!')
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
      else toast.success(namespace === 'review_draft' ? 'Published to demo site!' : 'About section published to live site!')
    } catch (err) {
      console.error('[AboutEditor] publish error:', err)
      toast.error('Publish failed unexpectedly.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <SectionEditor
      title="About Section"
      description="Tell visitors who you are"
      form={form}
      onFormChange={setForm}
      onSave={handleSave}
      onUndo={handleUndo}
      saving={saving}
      onPublish={handlePublish}
      publishing={publishing}
      previewHref="/#about"
      onFetchHistory={fetchHistory}
      onRestoreVersion={restoreVersion}
    >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text <span className="text-gray-400">(small label above heading)</span></label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Body Text</label>
          <textarea rows={4} value={form.body} onChange={e => set('body', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        <ImageUpload value={form.image} onChange={val => set('image', val)} folder="about" label="About Image" />

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Stats <span className="text-gray-400">(e.g. "150+ Clients")</span></label>
            <button onClick={addStat} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
              <Plus size={14} /> Add Stat
            </button>
          </div>
          <div className="space-y-3">
            {form.stats?.map((stat, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input type="text" value={stat.value} onChange={e => setStat(i, 'value', e.target.value)}
                  placeholder="150+" className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" value={stat.label} onChange={e => setStat(i, 'label', e.target.value)}
                  placeholder="Happy Clients" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={() => removeStat(i)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
    </SectionEditor>
  )
}
