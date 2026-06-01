import { useState, useEffect } from 'react'
import { useContent } from '../../hooks/useContent'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { Undo2, Plus, Trash2 } from 'lucide-react'

export default function NavigationEditor() {
  const { content, loading, saveContent, undoLastSave } = useContent('navigation')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (content) setForm(content) }, [content])

  if (loading || !form) return <div className="text-gray-400 text-sm p-4">Loading...</div>

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
  const setLink = (i, key, val) => {
    const links = [...form.links]
    links[i] = { ...links[i], [key]: val }
    set('links', links)
  }
  const addLink = () => set('links', [...(form.links || []), { label: 'New Link', href: '#' }])
  const removeLink = (i) => set('links', form.links.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    setSaving(true)
    const { error } = await saveContent(form)
    if (error) toast.error('Save failed.')
    else toast.success('Navigation saved!')
    setSaving(false)
  }

  const handleUndo = async () => {
    const { error } = await undoLastSave()
    if (error) toast.error('Nothing to undo.')
    else toast.success('Changes undone!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Navigation</h2>
        <p className="text-sm text-gray-500">The top menu bar your visitors see on every page</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Site Logo / Name</label>
          <input type="text" value={form.logo || ''} onChange={e => set('logo', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
          <input type="text" value={form.ctaLabel || ''} onChange={e => set('ctaLabel', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
          <input type="text" value={form.ctaHref || ''} onChange={e => set('ctaHref', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="#contact" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Menu Links</label>
          <button onClick={addLink} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
            <Plus size={14} /> Add Link
          </button>
        </div>
        <div className="space-y-2">
          {form.links?.map((link, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input type="text" value={link.label} onChange={e => setLink(i, 'label', e.target.value)}
                placeholder="Link Label" className="w-1/3 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={link.href} onChange={e => setLink(i, 'href', e.target.value)}
                placeholder="#section or /page" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={() => removeLink(i)} className="text-red-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
        <Button variant="ghost" onClick={handleUndo}><Undo2 size={16} className="mr-1" /> Undo Last Save</Button>
      </div>
    </div>
  )
}
