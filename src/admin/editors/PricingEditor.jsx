import SectionEditor from '../components/SectionEditor'
import { useState, useEffect } from 'react'
import { useContent } from '../../hooks/useContent'
import toast from 'react-hot-toast'
import { Plus, Trash2, Star } from 'lucide-react'

export default function PricingEditor() {
  const { content, loading, namespace, saveContent, publishContent, undoLastSave, fetchHistory, restoreVersion } = useContent('pricing')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => { if (content) setForm(content) }, [content])

  if (loading || !form) return <div className="text-gray-400 text-sm p-4">Loading...</div>

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const setTier = (id, key, val) => {
    set('tiers', form.tiers.map(t => t.id === id ? { ...t, [key]: val } : t))
  }

  const togglePopular = (id) => {
    // Only one tier can be "popular" at a time — toggling one clears the others
    set('tiers', form.tiers.map(t => ({ ...t, popular: t.id === id ? !t.popular : false })))
  }

  const addTier = () => {
    set('tiers', [...(form.tiers || []), {
      id: String(Date.now()),
      name: 'New Tier',
      price: '$0',
      billing: 'one-time',
      description: '',
      features: ['Feature 1'],
      ctaLabel: 'Get Started',
      ctaHref: '#contact',
      popular: false,
    }])
  }

  const removeTier = (id) => set('tiers', form.tiers.filter(t => t.id !== id))

  const setFeature = (tierId, idx, val) => {
    const tier = form.tiers.find(t => t.id === tierId)
    const features = [...(tier.features || [])]
    features[idx] = val
    setTier(tierId, 'features', features)
  }

  const addFeature = (tierId) => {
    const tier = form.tiers.find(t => t.id === tierId)
    setTier(tierId, 'features', [...(tier.features || []), 'New feature'])
  }

  const removeFeature = (tierId, idx) => {
    const tier = form.tiers.find(t => t.id === tierId)
    setTier(tierId, 'features', tier.features.filter((_, i) => i !== idx))
  }

  // ── Hosting & Care Plan (optional recurring add-on) ──────────────────────────
  const hosting = form.hostingPlan || {}
  const setHosting = (key, val) => set('hostingPlan', { ...hosting, [key]: val })
  const setHostingFeature = (idx, val) => {
    const features = [...(hosting.features || [])]
    features[idx] = val
    setHosting('features', features)
  }
  const addHostingFeature = () => setHosting('features', [...(hosting.features || []), 'New feature'])
  const removeHostingFeature = (idx) => setHosting('features', (hosting.features || []).filter((_, i) => i !== idx))

  const handleSave = async () => {
    setSaving(true)
    const { error } = await saveContent(form)
    if (error) toast.error('Save failed.')
    else toast.success('Pricing section saved!')
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
      else toast.success(namespace === 'review_draft' ? 'Published to demo site!' : 'Pricing section published to live site!')
    } catch (err) {
      console.error('[PricingEditor] publish error:', err)
      toast.error('Publish failed unexpectedly.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <SectionEditor
      title="Pricing"
      description="Pricing tiers"
      form={form}
      onFormChange={setForm}
      onSave={handleSave}
      onUndo={handleUndo}
      saving={saving}
      onPublish={handlePublish}
      publishing={publishing}
      previewHref="/#pricing"
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
          <input type="text" value={form.headline || ''} onChange={e => set('headline', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
          <input type="text" value={form.subheadline || ''} onChange={e => set('subheadline', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Footnote <span className="text-gray-300">(small note below the plans — leave blank to hide)</span></label>
          <input type="text" value={form.footnote || ''} onChange={e => set('footnote', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Pricing Tiers</label>
          <button onClick={addTier} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
            <Plus size={14} /> Add Tier
          </button>
        </div>
        <div className="space-y-4">
          {form.tiers?.map((tier) => (
            <div key={tier.id} className={`border-2 rounded-xl p-4 space-y-3 ${tier.popular ? 'border-blue-400 bg-blue-50/30' : 'border-gray-200'}`}>
              <div className="flex items-start gap-3">
                <div className="flex-1 grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tier Name</label>
                    <input type="text" value={tier.name} onChange={e => setTier(tier.id, 'name', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                    <input type="text" value={tier.price} onChange={e => setTier(tier.id, 'price', e.target.value)}
                      placeholder="$1,500"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Billing Label</label>
                    <input type="text" value={tier.billing || ''} onChange={e => setTier(tier.id, 'billing', e.target.value)}
                      placeholder="one-time, /month, etc."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea rows={2} value={tier.description || ''} onChange={e => setTier(tier.id, 'description', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                </div>
                <button onClick={() => removeTier(tier.id)} className="text-red-400 hover:text-red-600 shrink-0 mt-6">
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Features list */}
              <div className="pl-0">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-500">Features</label>
                  <button onClick={() => addFeature(tier.id)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                    <Plus size={12} /> Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {tier.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input type="text" value={feature} onChange={e => setFeature(tier.id, idx, e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <button onClick={() => removeFeature(tier.id, idx)} className="text-red-400 hover:text-red-600 shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA + Popular toggle */}
              <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Button Label</label>
                  <input type="text" value={tier.ctaLabel || ''} onChange={e => setTier(tier.id, 'ctaLabel', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Button Link</label>
                  <input type="text" value={tier.ctaHref || ''} onChange={e => setTier(tier.id, 'ctaHref', e.target.value)}
                    placeholder="#contact"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => togglePopular(tier.id)}
                    className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      tier.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Star size={14} fill={tier.popular ? 'currentColor' : 'none'} />
                    {tier.popular ? 'Most Popular' : 'Mark as Popular'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hosting & Care Plan */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Hosting &amp; Care Plan</label>
            <p className="text-xs text-gray-400 mt-0.5">Optional recurring add-on shown as a banner below the tiers.</p>
          </div>
          <button
            onClick={() => setHosting('enabled', !hosting.enabled)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              hosting.enabled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {hosting.enabled ? 'Shown' : 'Hidden'}
          </button>
        </div>

        {hosting.enabled && (
          <div className="border-2 border-gray-200 rounded-xl p-4 space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">Badge <span className="text-gray-300">(leave blank to hide)</span></label>
                <input type="text" value={hosting.badge || ''} onChange={e => setHosting('badge', e.target.value)}
                  placeholder="Highly Recommended"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Plan Name</label>
                <input type="text" value={hosting.name || ''} onChange={e => setHosting('name', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                <input type="text" value={hosting.price || ''} onChange={e => setHosting('price', e.target.value)}
                  placeholder="$49"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Billing Label</label>
                <input type="text" value={hosting.billing || ''} onChange={e => setHosting('billing', e.target.value)}
                  placeholder="/month"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <textarea rows={2} value={hosting.description || ''} onChange={e => setHosting('description', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-500">Features</label>
                <button onClick={addHostingFeature} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                  <Plus size={12} /> Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {hosting.features?.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input type="text" value={feature} onChange={e => setHostingFeature(idx, e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button onClick={() => removeHostingFeature(idx)} className="text-red-400 hover:text-red-600 shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Button Label</label>
                <input type="text" value={hosting.ctaLabel || ''} onChange={e => setHosting('ctaLabel', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Button Link</label>
                <input type="text" value={hosting.ctaHref || ''} onChange={e => setHosting('ctaHref', e.target.value)}
                  placeholder="#contact"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionEditor>
  )
}
