// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import { useContent } from '../../hooks/useContent'
import BlockCanvas from '../components/BlockCanvas'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { ExternalLink, Undo2, Trash2 } from 'lucide-react'

function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<\/?(p|div|br)[^>]*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const toSlug = (val) => val.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

export default function CustomPageEditor({ slug, onDelete, onSlugChange }) {
  const { content, saveContent, undoLastSave } = useContent('custom_pages')
  const { content: nav, saveContent: saveNav }  = useContent('navigation')

  const [blocks,         setBlocks]         = useState([])
  const [pageTitle,      setPageTitle]      = useState('')
  const [slugInput,      setSlugInput]      = useState(slug)
  const [seoTitle,       setSeoTitle]       = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [saving,         setSaving]         = useState(false)
  const [confirmDelete,  setConfirmDelete]  = useState(false)

  useEffect(() => {
    if (!content) return
    const page = content.pages?.find(p => p.slug === slug)
    if (!page) return
    setPageTitle(page.title || '')
    setSeoTitle(page.seoTitle || '')
    setSeoDescription(page.seoDescription || '')
    setSlugInput(page.slug)
    if (Array.isArray(page.blocks) && page.blocks.length > 0) {
      setBlocks(page.blocks.map(b =>
        b.type === 'text' && /<[a-z]/i.test(b.text || '')
          ? { ...b, text: stripHtml(b.text) }
          : b
      ))
    } else if (page.content) {
      setBlocks([{ id: 'legacy-0', type: 'text', text: stripHtml(page.content), align: 'left', htmlMode: false }])
    } else {
      setBlocks([])
    }
  }, [content, slug])

  const handleSave = async () => {
    if (!content) return
    setSaving(true)

    const newSlug    = toSlug(slugInput) || slug
    const slugChanged = newSlug !== slug

    // Check for slug collision
    if (slugChanged && content.pages.some(p => p.slug === newSlug)) {
      toast.error(`URL /${newSlug} is already in use.`)
      setSaving(false)
      return
    }

    // 1. Save page (with potentially new slug)
    const updated = {
      ...content,
      pages: content.pages.map(p =>
        p.slug === slug
          ? { slug: newSlug, title: pageTitle, blocks, seoTitle, seoDescription }
          : p
      ),
    }
    const { error } = await saveContent(updated)
    if (error) { toast.error('Save failed.'); setSaving(false); return }

    // 2. If slug changed, update any matching nav links
    if (slugChanged && nav?.links) {
      const updatedNav = {
        ...nav,
        links: nav.links.map(link => {
          if (link.href === `/page/${slug}`) return { ...link, href: `/page/${newSlug}` }
          if (link.children) {
            return {
              ...link,
              children: link.children.map(c =>
                c.href === `/page/${slug}` ? { ...c, href: `/page/${newSlug}` } : c
              ),
            }
          }
          return link
        }),
      }
      await saveNav(updatedNav)
      onSlugChange?.(slug, newSlug)
    }

    toast.success('Page saved!')
    setSaving(false)
  }

  const handleUndo = async () => {
    const { error } = await undoLastSave()
    if (error) toast.error('Nothing to undo.')
    else toast.success('Undone!')
  }

  const displaySlug = toSlug(slugInput) || slug

  return (
    <div className="flex flex-col" style={{ minHeight: 640 }}>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100 shrink-0">
        <input
          value={pageTitle}
          onChange={e => setPageTitle(e.target.value)}
          className="flex-1 text-base font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-300 min-w-0"
          placeholder="Page title…"
        />
        {confirmDelete ? (
          <>
            <span className="text-xs text-gray-500 shrink-0">Delete this page?</span>
            <button
              onClick={() => { onDelete(); toast.success('Page deleted.') }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shrink-0"
            >Yes, delete</button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
            >Cancel</button>
          </>
        ) : (
          <>
            <a href={`/page/${displaySlug}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors shrink-0">
              <ExternalLink size={12} /> Preview
            </a>
            {onDelete && (
              <button onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0"
                title="Delete page">
                <Trash2 size={13} />
              </button>
            )}
            <button onClick={handleUndo}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0">
              <Undo2 size={13} /> Undo
            </button>
            <Button onClick={handleSave} disabled={saving} className="shrink-0">
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </>
        )}
      </div>

      {/* URL slug bar */}
      <div className="flex items-center gap-2 px-5 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <span className="text-xs font-semibold text-gray-500 shrink-0">Page URL</span>
        <div className="flex items-center flex-1 min-w-0 bg-white border border-gray-200 rounded-lg px-3 py-1.5 gap-1">
          <span className="text-xs text-gray-400 shrink-0 select-none">/page/</span>
          <input
            value={slugInput}
            onChange={e => setSlugInput(e.target.value)}
            onBlur={e => setSlugInput(toSlug(e.target.value) || slug)}
            className="flex-1 min-w-0 text-xs text-gray-800 font-mono bg-transparent border-0 outline-none"
            placeholder={slug}
            spellCheck={false}
          />
        </div>
        {toSlug(slugInput) !== slug && (
          <span className="text-[10px] text-amber-500 shrink-0 font-medium">unsaved</span>
        )}
      </div>

      {/* Block canvas — fills remaining height */}
      <div className="flex-1">
        <BlockCanvas blocks={blocks} onChange={setBlocks} minHeight={560} />
      </div>

      {/* SEO */}
      <div className="px-5 py-5 border-t border-gray-100">
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">SEO</h3>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Page title tag
            </label>
            <input
              value={seoTitle}
              onChange={e => setSeoTitle(e.target.value)}
              placeholder={pageTitle || 'Page title…'}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">Shown in browser tab and search results</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Meta description
            </label>
            <textarea
              value={seoDescription}
              onChange={e => setSeoDescription(e.target.value)}
              placeholder="1–2 sentences shown in search results…"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">1–2 sentences shown below your title in search results</p>
          </div>
        </div>
      </div>

    </div>
  )
}
