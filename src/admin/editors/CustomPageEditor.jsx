import { useState, useEffect } from 'react'
import { useContent } from '../../hooks/useContent'
import BlockCanvas from '../components/BlockCanvas'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { ExternalLink, Undo2 } from 'lucide-react'

function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<\/?(p|div|br)[^>]*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export default function CustomPageEditor({ slug }) {
  const { content, saveContent, undoLastSave } = useContent('custom_pages')

  const [blocks,    setBlocks]    = useState([])
  const [pageTitle, setPageTitle] = useState('')
  const [saving,    setSaving]    = useState(false)

  useEffect(() => {
    if (!content) return
    const page = content.pages?.find(p => p.slug === slug)
    if (!page) return
    setPageTitle(page.title || '')
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
    const updated = {
      ...content,
      pages: content.pages.map(p =>
        p.slug === slug ? { slug: p.slug, title: pageTitle, blocks } : p
      ),
    }
    const { error } = await saveContent(updated)
    if (error) toast.error('Save failed.')
    else toast.success('Page saved!')
    setSaving(false)
  }

  const handleUndo = async () => {
    const { error } = await undoLastSave()
    if (error) toast.error('Nothing to undo.')
    else toast.success('Undone!')
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 640 }}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-200 shrink-0">
        <input
          value={pageTitle}
          onChange={e => setPageTitle(e.target.value)}
          className="flex-1 text-base font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-300 min-w-0"
          placeholder="Page title…"
        />
        <a href={`/page/${slug}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors shrink-0">
          <ExternalLink size={12} /> Preview
        </a>
        <button onClick={handleUndo}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0">
          <Undo2 size={13} /> Undo
        </button>
        <Button onClick={handleSave} disabled={saving} className="shrink-0">
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>

      {/* Block canvas — fills remaining height */}
      <div className="flex-1">
        <BlockCanvas blocks={blocks} onChange={setBlocks} minHeight={580} />
      </div>
    </div>
  )
}
