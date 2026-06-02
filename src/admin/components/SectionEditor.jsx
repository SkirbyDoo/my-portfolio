// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
// SectionEditor — shared full-width editor used by ALL page/section editors.
// Provides the same two-panel layout as CustomPageEditor (palette left, canvas right)
// with a collapsible "Section Settings" drawer for the structured form fields.
//
// Props:
//   title         – string, shown in toolbar
//   description   – string (optional)
//   form          – the current form state object (controlled from parent)
//   onFormChange  – (newForm) => void
//   onSave        – () => void
//   onUndo        – () => void
//   saving        – boolean
//   previewHref   – string (optional, shows Preview link)
//   settingsLabel – string (optional, default "Page Content")
//   children      – structured settings fields (shown in collapsible panel)
//   loading       – boolean (optional)

import { useState } from 'react'
import toast from 'react-hot-toast'
import BlockCanvas, { BLOCK_TYPES, KEY_PALETTE } from './BlockCanvas'
import Button from '../../components/ui/Button'
import { useContentNamespace } from '../../contexts/ContentNamespaceContext'
import { Undo2, ExternalLink, ChevronDown, ChevronUp, SlidersHorizontal, Eye, EyeOff, Send } from 'lucide-react'

export default function SectionEditor({
  title,
  description,
  form,
  onFormChange,
  onSave,
  onUndo,
  saving = false,
  onPublish,
  publishing = false,
  previewHref,
  settingsLabel = 'Page Content',
  children,
  loading = false,
}) {
  const namespace = useContentNamespace()
  const showPublish = !!onPublish && !namespace
  const isReview   = namespace === 'review_draft'
  const [settingsOpen, setSettingsOpen] = useState(true)

  // Demo preview URL — used by the "Publish to Demo Site" button to open a fresh tab
  const demoPreviewHref = previewHref
    ? `/preview${previewHref === '/' ? '' : previewHref}`
    : '/preview'

  // Publish draft → review namespace, then open a fresh preview tab.
  // We open the blank window BEFORE the async publish so the browser doesn't
  // block it as a popup (user gesture must be synchronous).
  const handlePublishToDemo = async () => {
    const previewWindow = window.open('', '_blank')
    try {
      await onPublish?.()
      if (previewWindow) {
        previewWindow.location.href = demoPreviewHref
      } else {
        // Popup was blocked — navigate current tab as fallback
        window.open(demoPreviewHref, '_blank')
      }
    } catch {
      previewWindow?.close()
    }
  }

  if (loading || !form) {
    return <div className="text-gray-400 text-sm p-8">Loading…</div>
  }

  return (
    <div className="flex relative min-h-[420px] sm:min-h-[640px]">

      {/* ── Left: Widget palette — hidden on mobile ──────────────────────── */}
      <aside className="hidden sm:flex sm:w-28 shrink-0 bg-gray-50 border-r border-gray-200 flex-col">
        <div className="px-2.5 pt-3 pb-2 border-b border-gray-100">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Widgets</p>
          <p className="text-[9px] text-gray-400 mt-0.5 leading-snug">Drag →</p>
        </div>

        <div className="flex-1 p-1.5 space-y-1">
          {BLOCK_TYPES.map(({ type, label, icon: Icon, border, headerText }) => (
            <div
              key={type}
              draggable
              onDragStart={e => {
                e.dataTransfer.setData(KEY_PALETTE, type)
                e.dataTransfer.effectAllowed = 'copy'
              }}
              className={`flex items-center gap-1.5 px-2 py-2 rounded-lg border bg-white cursor-grab active:cursor-grabbing select-none hover:shadow-sm active:scale-95 transition-all ${border}`}
            >
              <Icon size={11} className={headerText} />
              <span className="text-[11px] font-medium text-gray-700">{label}</span>
            </div>
          ))}
        </div>

        <p className="px-2.5 pb-3 text-[9px] text-gray-400 leading-snug border-t border-gray-100 pt-2">
          Drag to reorder.
        </p>
      </aside>

      {/* ── Right: toolbar + settings + canvas ──────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-white border-b border-gray-200 shrink-0">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
            {description && <p className="hidden sm:block text-xs text-gray-400 truncate">{description}</p>}
          </div>

          {/* Visible toggle — icon-only on mobile */}
          {'visible' in (form || {}) && (
            <button
              type="button"
              onClick={() => onFormChange({ ...form, visible: form.visible === false })}
              title={form.visible !== false ? 'Section is visible — click to hide' : 'Section is hidden — click to show'}
              className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors shrink-0 ${
                form.visible !== false
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
              }`}
            >
              {form.visible !== false ? <Eye size={12} /> : <EyeOff size={12} />}
              <span className="hidden sm:inline">{form.visible !== false ? 'Visible' : 'Hidden'}</span>
            </button>
          )}

          {previewHref && (
            <a
              href={isReview ? demoPreviewHref : previewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors shrink-0"
            >
              <ExternalLink size={12} /> Preview
            </a>
          )}

          <button
            onClick={onUndo}
            title="Undo last save"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-1.5 sm:px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
          >
            <Undo2 size={13} />
            <span className="hidden sm:inline">Undo</span>
          </button>
          <Button onClick={onSave} disabled={saving} variant="secondary" size="sm" className="shrink-0">
            {saving ? 'Saving…' : <><span className="hidden sm:inline">Save Draft</span><span className="sm:hidden">Save</span></>}
          </Button>

          {/* Publish — sits directly next to Save Draft so the two-step flow is obvious */}
          {showPublish && (
            <button
              onClick={onPublish}
              disabled={publishing}
              title="Publish this section to your live site"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shrink-0 shadow-sm"
            >
              <Send size={11} />
              <span className="hidden sm:inline">{publishing ? 'Publishing…' : 'Publish to Live Site'}</span>
              <span className="sm:hidden">{publishing ? '…' : 'Publish'}</span>
            </button>
          )}

          {isReview && (
            <button
              onClick={handlePublishToDemo}
              disabled={publishing}
              title="Publish to the demo preview (not the live site)"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 transition-colors shrink-0 shadow-sm"
            >
              <Send size={11} />
              <span className="hidden sm:inline">{publishing ? 'Publishing…' : 'Publish to Demo'}</span>
              <span className="sm:hidden">{publishing ? '…' : 'Demo'}</span>
            </button>
          )}
        </div>

        {/* Info strip — explains the Save Draft vs Publish pair now in the toolbar */}
        {showPublish && (
          <div className="px-3 sm:px-5 py-2 bg-emerald-50 border-b border-emerald-200 shrink-0">
            <p className="hidden sm:block text-xs text-emerald-800">
              <span className="font-semibold">Save Draft</span> keeps changes private &nbsp;·&nbsp;
              <span className="font-semibold">Publish to Live Site</span> makes them visible to visitors
            </p>
            <p className="sm:hidden text-xs text-emerald-700 font-medium">Publish = visible to visitors</p>
          </div>
        )}

        {/* Review-mode info strip */}
        {isReview && (
          <div className="px-3 sm:px-5 py-2 bg-sky-50 border-b border-sky-200 shrink-0">
            <p className="hidden sm:block text-xs text-sky-900">
              <span className="font-semibold">Save Draft</span> keeps edits private &nbsp;·&nbsp;
              <span className="font-semibold">Publish to Demo</span> saves &amp; opens a fresh preview tab — <span className="italic">not the live website</span>
            </p>
            <p className="sm:hidden text-xs text-sky-800 font-medium">Publish = updates demo preview</p>
          </div>
        )}

        {/* Collapsible settings panel */}
        {children && (
          <div className="bg-white border-b border-gray-200 shrink-0">
            <button
              onClick={() => setSettingsOpen(o => !o)}
              className="w-full flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={12} />
              {settingsLabel}
              <span className="ml-auto">
                {settingsOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </span>
            </button>
            {settingsOpen && (
              <div className="px-3 sm:px-5 pb-5 pt-3 sm:pt-4 space-y-4 border-t border-gray-100 max-h-[32rem] overflow-y-auto bg-white">
                {children}
              </div>
            )}
          </div>
        )}

        {/* Block canvas — no built-in palette since we have our own above */}
        <div className="flex-1">
          <BlockCanvas
            blocks={form.blocks || []}
            onChange={blocks => onFormChange({ ...form, blocks })}
            showPalette={false}
            minHeight={520}
          />
        </div>
      </div>

    </div>
  )
}
