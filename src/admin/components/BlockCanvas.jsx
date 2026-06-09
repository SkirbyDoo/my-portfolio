// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
// Shared drag-and-drop block editor.
// Props:
//   blocks      – array of block objects (controlled)
//   onChange    – (newBlocks) => void
//   minHeight   – optional, default 380
//   showPalette – optional, default true. Set false when palette is provided by parent (SectionEditor).
//
// Exports BLOCK_TYPES and KEY_PALETTE for use by SectionEditor.

import { useState } from 'react'
import { useContent } from '../../hooks/useContent'
import {
  Trash2, GripVertical,
  Heading, AlignLeft, Image, MousePointer, Minus, Layout,
  Upload, X, Code, Link,
} from 'lucide-react'
import toast from 'react-hot-toast'
import TextStyleControls from './TextStyleControls'
import { blockToCss } from '../../lib/textStyle'

// Map a TextStyleControls style object onto a block patch. Excludes textAlign —
// heading/text blocks keep their own `align` control in the block header.
const textStylePatch = (s) => ({
  fontSize: s.fontSize,
  fontWeight: s.fontWeight,
  color: s.color,
  italic: s.italic,
  underline: s.underline,
  strikethrough: s.strikethrough,
})

// ── Static pages for button link picker ──────────────────────────────────────
const STATIC_PAGES = [
  { label: 'Home',                   href: '/'                 },
  { label: 'What We Offer (anchor)', href: '#services'         },
  { label: 'Divisions (anchor)',     href: '#team'             },
  { label: 'Testimonials (anchor)',  href: '#testimonials'     },
  { label: 'Contact (anchor)',       href: '#contact'          },
  { label: 'Rules',                  href: '/rules'            },
  { label: 'Register',               href: '/register'         },
  { label: 'Sunday Night',           href: '/season/sunday'    },
  { label: 'Wednesday 50+',          href: '/season/wednesday' },
  { label: 'Monday Night',           href: '/season/monday'    },
  { label: 'Friday Night',           href: '/season/friday'    },
]

// ── Block type palette (exported for SectionEditor) ──────────────────────────
export const BLOCK_TYPES = [
  { type: 'heading', label: 'Heading', icon: Heading,      headerBg: 'bg-purple-100', headerText: 'text-purple-700', border: 'border-purple-200' },
  { type: 'text',    label: 'Text',    icon: AlignLeft,    headerBg: 'bg-blue-100',   headerText: 'text-blue-700',   border: 'border-blue-200'   },
  { type: 'image',   label: 'Image',   icon: Image,        headerBg: 'bg-green-100',  headerText: 'text-green-700',  border: 'border-green-200'  },
  { type: 'button',  label: 'Button',  icon: MousePointer, headerBg: 'bg-orange-100', headerText: 'text-orange-700', border: 'border-orange-200' },
  { type: 'divider', label: 'Divider', icon: Minus,        headerBg: 'bg-gray-100',   headerText: 'text-gray-500',   border: 'border-gray-200'   },
  { type: 'row',     label: 'Row',     icon: Layout,       headerBg: 'bg-indigo-100', headerText: 'text-indigo-700', border: 'border-indigo-200' },
]
const TYPE_MAP = Object.fromEntries(BLOCK_TYPES.map(t => [t.type, t]))

export const KEY_PALETTE = 'x-palette-type'
const KEY_INDEX   = 'x-block-index'

// ── Block factories ───────────────────────────────────────────────────────────
export function makeBlock(type) {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  switch (type) {
    case 'heading': return { id, type, level: 2, text: 'New Heading', align: 'left' }
    case 'text':    return { id, type, text: '', align: 'left', htmlMode: false }
    case 'image':   return { id, type, src: '', alt: '', uploadMode: true }
    case 'button':  return { id, type, text: 'Click Here', href: '/', linkType: 'page', align: 'center', style: 'primary' }
    case 'divider': return { id, type }
    case 'row':     return { id, type, columns: 2, gap: 'md', cells: [{ blocks: [] }, { blocks: [] }] }
    default:        return { id, type: 'text', text: '', align: 'left', htmlMode: false }
  }
}

function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<\/?(p|div|br)[^>]*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const inp = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white'

// ── Drop zone ─────────────────────────────────────────────────────────────────
function DropZone({ index, isActive, onDragOver, onDrop, onDragLeave }) {
  return (
    <div
      onDragOver={e => { e.preventDefault(); onDragOver(index) }}
      onDrop={e => { e.preventDefault(); onDrop(e, index) }}
      onDragLeave={onDragLeave}
      className={`rounded-lg transition-all duration-100 ${
        isActive
          ? 'h-10 bg-blue-50 border-2 border-dashed border-blue-400 flex items-center justify-center my-1'
          : 'h-2 my-0.5'
      }`}
    >
      {isActive && <span className="text-xs text-blue-500 font-semibold pointer-events-none">Drop here</span>}
    </div>
  )
}

// ── Cell drop zone (inside a Row column) ──────────────────────────────────────
function CellDropZone({ isActive, onDragOver, onDrop, onDragLeave }) {
  return (
    <div
      onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragOver() }}
      onDrop={e => { e.preventDefault(); e.stopPropagation(); onDrop(e) }}
      onDragLeave={onDragLeave}
      className={`rounded-lg transition-all duration-100 ${
        isActive
          ? 'h-10 bg-indigo-50 border-2 border-dashed border-indigo-400 flex items-center justify-center my-1'
          : 'h-2 my-0.5'
      }`}
    >
      {isActive && <span className="text-xs text-indigo-500 font-semibold pointer-events-none">Drop here</span>}
    </div>
  )
}

// ── Row cell block (simplified card inside a row cell) ────────────────────────
function CellBlock({ block, onUpdate, onRemove }) {
  const meta = TYPE_MAP[block.type] || TYPE_MAP.text
  const inp2 = 'border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 w-full bg-white'
  return (
    <div className={`group border rounded-lg overflow-hidden bg-white ${meta.border} mb-1.5`}>
      <div className={`flex items-center gap-1.5 px-2 py-1 ${meta.headerBg} ${meta.headerText}`}>
        <span className="text-[9px] font-bold uppercase tracking-widest flex-1">{block.type}</span>
        <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/40">
          <X size={9} />
        </button>
      </div>
      <div className="p-2 space-y-1.5">
        {block.type === 'heading' && (
          <input value={block.text || ''} onChange={e => onUpdate({ text: e.target.value })} className={inp2} placeholder="Heading…" />
        )}
        {block.type === 'text' && (
          <textarea value={block.text || ''} onChange={e => onUpdate({ text: e.target.value })} rows={2} className={`${inp2} resize-none`} placeholder="Text…" />
        )}
        {block.type === 'image' && (
          block.src
            ? <img src={block.src} alt="" className="max-h-16 rounded object-cover" />
            : <label className="flex items-center justify-center gap-1 h-10 rounded border border-dashed border-gray-200 cursor-pointer hover:border-blue-300 text-xs text-gray-400">
                <Upload size={12} /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={e => {
                  const file = e.target.files?.[0]; if (!file) return
                  const reader = new FileReader()
                  reader.onloadend = () => onUpdate({ src: reader.result })
                  reader.readAsDataURL(file)
                }} />
              </label>
        )}
        {block.type === 'button' && (
          <input value={block.text || ''} onChange={e => onUpdate({ text: e.target.value })} className={inp2} placeholder="Button label…" />
        )}
        {block.type === 'divider' && <hr className="border-dashed border-gray-300" />}
      </div>
    </div>
  )
}

// ── Row editor ────────────────────────────────────────────────────────────────
function RowEditor({ block, blockIdx, update, draggingIdx, onBlockDragStart, onBlockDragEnd }) {
  const [cellDrop, setCellDrop] = useState(null) // `${cellIdx}-${slotIdx}`

  const updateCell = (cellIdx, newBlocks) => {
    const cells = block.cells.map((c, ci) => ci === cellIdx ? { ...c, blocks: newBlocks } : c)
    update(blockIdx, { cells })
  }

  const changeColumns = (cols) => {
    const currentCells = block.cells || []
    let cells = [...currentCells]
    while (cells.length < cols) cells.push({ blocks: [] })
    cells = cells.slice(0, cols)
    update(blockIdx, { columns: cols, cells })
  }

  const handleCellDrop = (e, cellIdx, slotIdx) => {
    const paletteType = e.dataTransfer.getData(KEY_PALETTE)
    if (paletteType) {
      const cell = block.cells[cellIdx]
      const newBlocks = [...(cell.blocks || [])]
      newBlocks.splice(slotIdx, 0, makeBlock(paletteType))
      updateCell(cellIdx, newBlocks)
    }
    setCellDrop(null)
  }

  const cols = block.columns || 2

  return (
    <div className="p-3 space-y-3">
      {/* Column count selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 shrink-0">Columns:</span>
        {[1, 2, 3, 4].map(n => (
          <button
            key={n}
            onClick={() => changeColumns(n)}
            className={`text-xs w-7 h-7 rounded-lg border font-semibold transition-colors ${
              cols === n ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'text-gray-400 border-gray-200 hover:border-gray-300'
            }`}
          >
            {n}
          </button>
        ))}
        <span className="text-xs text-gray-500 ml-2 shrink-0">Gap:</span>
        {['sm', 'md', 'lg'].map(g => (
          <button
            key={g}
            onClick={() => update(blockIdx, { gap: g })}
            className={`text-xs px-2 h-7 rounded-lg border font-semibold transition-colors ${
              (block.gap || 'md') === g ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'text-gray-400 border-gray-200 hover:border-gray-300'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Column cells */}
      <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {(block.cells || []).map((cell, cellIdx) => (
          <div key={cellIdx} className="min-h-20 bg-indigo-50/50 rounded-lg border border-indigo-100 p-2">
            <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-2 text-center">Col {cellIdx + 1}</p>

            <CellDropZone
              isActive={cellDrop === `${cellIdx}-0`}
              onDragOver={() => setCellDrop(`${cellIdx}-0`)}
              onDrop={e => handleCellDrop(e, cellIdx, 0)}
              onDragLeave={() => setCellDrop(null)}
            />

            {(cell.blocks || []).map((cb, cbi) => (
              <div key={cb.id || cbi}>
                <CellBlock
                  block={cb}
                  onUpdate={changes => {
                    const newBlocks = cell.blocks.map((b, bi) => bi === cbi ? { ...b, ...changes } : b)
                    updateCell(cellIdx, newBlocks)
                  }}
                  onRemove={() => {
                    const newBlocks = cell.blocks.filter((_, bi) => bi !== cbi)
                    updateCell(cellIdx, newBlocks)
                  }}
                />
                <CellDropZone
                  isActive={cellDrop === `${cellIdx}-${cbi + 1}`}
                  onDragOver={() => setCellDrop(`${cellIdx}-${cbi + 1}`)}
                  onDrop={e => handleCellDrop(e, cellIdx, cbi + 1)}
                  onDragLeave={() => setCellDrop(null)}
                />
              </div>
            ))}

            {(cell.blocks || []).length === 0 && (
              <p className="text-[10px] text-indigo-300 text-center py-2 pointer-events-none">Drag blocks here</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main BlockCanvas ──────────────────────────────────────────────────────────
export default function BlockCanvas({ blocks, onChange, minHeight = 380, showPalette = true }) {
  const { content: customPagesData } = useContent('custom_pages')

  const [dropTarget,  setDropTarget]  = useState(null)
  const [draggingIdx, setDraggingIdx] = useState(null)

  // Build page list for button dropdown
  const customPageLinks = (customPagesData?.pages || []).map(p => ({
    label: p.title || p.slug,
    href: `/page/${p.slug}`,
  }))
  const allPages = [...STATIC_PAGES, ...customPageLinks]

  const update = (i, changes) =>
    onChange(blocks.map((b, idx) => idx === i ? { ...b, ...changes } : b))

  const remove = (i) => onChange(blocks.filter((_, idx) => idx !== i))

  // Image upload
  const handleImageUpload = (e, i) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2 MB'); return }
    const reader = new FileReader()
    reader.onloadend = () => update(i, { src: reader.result })
    reader.readAsDataURL(file)
  }

  // Drag: palette → canvas
  const onPaletteDragStart = (e, type) => {
    e.dataTransfer.setData(KEY_PALETTE, type)
    e.dataTransfer.effectAllowed = 'copy'
  }

  // Drag: canvas block → reorder
  const onBlockDragStart = (e, i) => {
    e.dataTransfer.setData(KEY_INDEX, String(i))
    e.dataTransfer.effectAllowed = 'move'
    setDraggingIdx(i)
  }

  const onBlockDragEnd = () => { setDraggingIdx(null); setDropTarget(null) }

  const onDrop = (e, targetIndex) => {
    const paletteType = e.dataTransfer.getData(KEY_PALETTE)
    const fromStr     = e.dataTransfer.getData(KEY_INDEX)
    if (paletteType) {
      const next = [...blocks]
      next.splice(targetIndex, 0, makeBlock(paletteType))
      onChange(next)
    } else if (fromStr !== '') {
      const src = Number(fromStr)
      if (src === targetIndex || src === targetIndex - 1) { setDraggingIdx(null); setDropTarget(null); return }
      const next = [...blocks]
      const [moved] = next.splice(src, 1)
      const insertAt = src < targetIndex ? targetIndex - 1 : targetIndex
      next.splice(insertAt, 0, moved)
      onChange(next)
    }
    setDraggingIdx(null)
    setDropTarget(null)
  }

  return (
    <div className="flex" style={{ minHeight }}>

      {/* ── Palette (hidden when SectionEditor supplies its own) ─────────── */}
      {showPalette && <aside className="w-28 shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="px-2.5 pt-3 pb-2 border-b border-gray-100">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Widgets</p>
          <p className="text-[9px] text-gray-400 mt-0.5 leading-snug">Drag →</p>
        </div>
        <div className="flex-1 p-1.5 space-y-1">
          {BLOCK_TYPES.map(({ type, label, icon: Icon, border, headerText }) => (
            <div
              key={type}
              draggable
              onDragStart={e => onPaletteDragStart(e, type)}
              className={`flex items-center gap-1.5 px-2 py-2 rounded-lg border bg-white cursor-grab active:cursor-grabbing select-none hover:shadow-sm active:scale-95 transition-all ${border}`}
            >
              <Icon size={11} className={headerText} />
              <span className="text-[11px] font-medium text-gray-700">{label}</span>
            </div>
          ))}
        </div>
        <p className="px-2.5 pb-3 text-[9px] text-gray-400 leading-snug border-t border-gray-100 pt-2">
          Drag to reorder blocks.
        </p>
      </aside>}

      {/* ── Canvas ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {blocks.length === 0 ? (
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault()
              const t = e.dataTransfer.getData(KEY_PALETTE)
              if (t) onChange([makeBlock(t)])
            }}
            className="flex items-center justify-center min-h-40 rounded-xl border-2 border-dashed border-gray-300 bg-white"
          >
            <div className="text-center pointer-events-none select-none">
              <p className="text-sm font-medium text-gray-400">Drag a widget here to start building</p>
              <p className="text-xs text-gray-300 mt-1">Choose from the palette on the left</p>
            </div>
          </div>
        ) : (
          <div>
            <DropZone index={0} isActive={dropTarget === 0} onDragOver={setDropTarget} onDrop={onDrop} onDragLeave={() => setDropTarget(null)} />

            {blocks.map((block, i) => {
              const meta = TYPE_MAP[block.type] || TYPE_MAP.text
              return (
                <div key={block.id || i}>
                  <div
                    draggable
                    onDragStart={e => onBlockDragStart(e, i)}
                    onDragEnd={onBlockDragEnd}
                    className={`group border rounded-xl overflow-hidden bg-white transition-all ${meta.border} ${
                      draggingIdx === i ? 'opacity-30 scale-95' : 'hover:shadow-md'
                    }`}
                  >
                    {/* Block header */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 cursor-grab ${meta.headerBg} ${meta.headerText}`}>
                      <GripVertical size={12} className="opacity-50 shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-widest flex-1">
                        {block.type === 'heading' ? `H${block.level || 2} Heading` : block.type}
                      </span>

                      {/* Alignment */}
                      {['heading', 'text', 'button'].includes(block.type) && (
                        <div className="flex gap-0.5">
                          {['left', 'center', 'right'].map(a => (
                            <button key={a} onClick={() => update(i, { align: a })}
                              className={`text-[11px] px-1.5 py-0.5 rounded font-bold transition-colors ${
                                (block.align || 'left') === a ? 'bg-white/70 shadow-sm' : 'opacity-40 hover:opacity-80'
                              }`}
                            >
                              {a === 'left' ? 'L' : a === 'center' ? 'C' : 'R'}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* HTML toggle for text */}
                      {block.type === 'text' && (
                        <button
                          onClick={() => update(i, {
                            htmlMode: !block.htmlMode,
                            // strip HTML when switching TO plain mode
                            text: block.htmlMode ? stripHtml(block.text) : block.text,
                          })}
                          title={block.htmlMode ? 'Switch to plain text' : 'Switch to HTML mode'}
                          className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-bold border transition-colors ${
                            block.htmlMode
                              ? 'bg-white/80 shadow-sm border-blue-300'
                              : 'opacity-50 hover:opacity-80 border-transparent'
                          }`}
                        >
                          <Code size={9} /> HTML
                        </button>
                      )}

                      <button onClick={() => remove(i)} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-0.5 rounded hover:bg-white/40">
                        <Trash2 size={11} />
                      </button>
                    </div>

                    {/* Block fields */}
                    <div className="p-3 space-y-2">

                      {/* ── Heading ───────────────────────────────────── */}
                      {block.type === 'heading' && (
                        <>
                          <div className="flex gap-2">
                            <select value={block.level || 2} onChange={e => update(i, { level: Number(e.target.value) })}
                              className="border border-gray-200 rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 w-28 shrink-0">
                              <option value={1}>H1 — Large</option>
                              <option value={2}>H2 — Medium</option>
                              <option value={3}>H3 — Small</option>
                            </select>
                            <input value={block.text || ''} onChange={e => update(i, { text: e.target.value })} className={inp} placeholder="Heading text…" style={blockToCss(block)} />
                          </div>
                          <TextStyleControls showAlign={false} style={block} onChange={next => update(i, textStylePatch(next))} />
                        </>
                      )}

                      {/* ── Text ──────────────────────────────────────── */}
                      {block.type === 'text' && (
                        <>
                          {block.htmlMode ? (
                            <div className="space-y-1">
                              <p className="text-[10px] text-blue-500">HTML mode — write raw HTML tags</p>
                              <textarea
                                value={block.text || ''}
                                onChange={e => update(i, { text: e.target.value })}
                                rows={5}
                                className={`${inp} resize-y font-mono text-xs`}
                                placeholder="<p>Your <strong>HTML</strong> here…</p>"
                              />
                            </div>
                          ) : (
                            <textarea
                              value={block.text || ''}
                              onChange={e => update(i, { text: e.target.value })}
                              rows={3}
                              className={`${inp} resize-y`}
                              placeholder="Paragraph text… (use blank lines between paragraphs for spacing)"
                              style={blockToCss(block)}
                            />
                          )}
                          <TextStyleControls showAlign={false} style={block} onChange={next => update(i, textStylePatch(next))} />
                        </>
                      )}

                      {/* ── Image ─────────────────────────────────────── */}
                      {block.type === 'image' && (
                        <div className="space-y-2">
                          {/* Upload / URL toggle */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 shrink-0">Source:</span>
                            {['upload', 'url'].map(mode => (
                              <button key={mode}
                                onClick={() => update(i, { uploadMode: mode === 'upload', src: '' })}
                                className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                                  (block.uploadMode !== false ? 'upload' : 'url') === mode
                                    ? 'bg-blue-100 text-blue-700 border-blue-300 font-semibold'
                                    : 'text-gray-400 border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {mode === 'upload' ? '⬆ Upload' : '🔗 URL'}
                              </button>
                            ))}
                          </div>

                          {block.src ? (
                            /* Preview with remove */
                            <div className="relative group/img inline-block">
                              <img src={block.src} alt={block.alt || ''} className="max-h-48 max-w-full rounded-lg border border-gray-200 object-cover block" onError={e => { e.target.style.display='none' }} />
                              <button onClick={() => update(i, { src: '' })}
                                className="absolute top-1.5 right-1.5 bg-white border border-gray-200 rounded-full p-1 opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200">
                                <X size={12} className="text-red-500" />
                              </button>
                            </div>
                          ) : block.uploadMode !== false ? (
                            /* Upload dropzone */
                            <label className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
                              <Upload size={18} className="text-gray-400" />
                              <span className="text-xs text-gray-500 font-medium">Click to upload image</span>
                              <span className="text-[10px] text-gray-400">JPG, PNG, GIF, WebP — max 2 MB</span>
                              <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, i)} />
                            </label>
                          ) : (
                            /* URL input */
                            <input value={block.src || ''} onChange={e => update(i, { src: e.target.value })}
                              className={`${inp} font-mono text-xs`} placeholder="https://example.com/photo.jpg" />
                          )}

                          <input value={block.alt || ''} onChange={e => update(i, { alt: e.target.value })}
                            className={inp} placeholder="Alt text (accessibility description)" />
                        </div>
                      )}

                      {/* ── Button ────────────────────────────────────── */}
                      {block.type === 'button' && (
                        <div className="space-y-2">
                          <input value={block.text || ''} onChange={e => update(i, { text: e.target.value })} className={inp} placeholder="Button label" />

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-500 shrink-0">Link to:</span>
                            {['page', 'url'].map(lt => (
                              <button key={lt}
                                onClick={() => update(i, { linkType: lt, href: lt === 'page' ? '/' : '' })}
                                className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                                  (block.linkType || 'url') === lt
                                    ? 'bg-blue-100 text-blue-700 border-blue-300 font-semibold'
                                    : 'text-gray-400 border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {lt === 'page' ? '📄 Site Page' : '🔗 External URL'}
                              </button>
                            ))}
                          </div>

                          {(block.linkType || 'url') === 'page' ? (
                            <select value={block.href || '/'} onChange={e => update(i, { href: e.target.value })}
                              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
                              {allPages.map(p => <option key={p.href} value={p.href}>{p.label}</option>)}
                            </select>
                          ) : (
                            <input value={block.href || ''} onChange={e => update(i, { href: e.target.value })}
                              className={`${inp} font-mono text-xs`} placeholder="https://example.com" />
                          )}

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 shrink-0">Style:</span>
                            {['primary', 'accent', 'outline'].map(s => (
                              <button key={s} onClick={() => update(i, { style: s })}
                                className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                                  (block.style || 'primary') === s
                                    ? 'bg-blue-100 text-blue-700 border-blue-300 font-semibold'
                                    : 'text-gray-400 border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ── Divider ───────────────────────────────────── */}
                      {block.type === 'divider' && <hr className="border-dashed border-gray-300 my-1" />}

                      {/* ── Row ───────────────────────────────────────── */}
                      {block.type === 'row' && (
                        <RowEditor
                          block={block}
                          blockIdx={i}
                          update={update}
                          draggingIdx={draggingIdx}
                          onBlockDragStart={onBlockDragStart}
                          onBlockDragEnd={onBlockDragEnd}
                        />
                      )}

                    </div>
                  </div>

                  <DropZone index={i + 1} isActive={dropTarget === i + 1} onDragOver={setDropTarget} onDrop={onDrop} onDragLeave={() => setDropTarget(null)} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
