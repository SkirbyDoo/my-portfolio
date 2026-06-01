import { useState } from 'react'
import {
  Plus, Trash2, ChevronUp, ChevronDown,
  Heading, AlignLeft, Image, MousePointer, Minus,
} from 'lucide-react'

// ── Block definitions ─────────────────────────────────────────────────────────
const BLOCK_TYPES = [
  { type: 'heading',  label: 'Heading',   icon: Heading,        desc: 'H1 / H2 / H3 title'  },
  { type: 'text',     label: 'Text',      icon: AlignLeft,      desc: 'Paragraph of content' },
  { type: 'image',    label: 'Image',     icon: Image,          desc: 'Photo or graphic'     },
  { type: 'button',   label: 'Button',    icon: MousePointer,   desc: 'Clickable CTA'        },
  { type: 'divider',  label: 'Divider',   icon: Minus,          desc: 'Horizontal separator' },
]

const ALIGN_OPTS = ['left', 'center', 'right']

function newBlock(type) {
  const id = `${type}-${Date.now()}`
  switch (type) {
    case 'heading':  return { id, type, level: 2, text: 'New Heading', align: 'left'   }
    case 'text':     return { id, type, text: '',                       align: 'left'   }
    case 'image':    return { id, type, src: '', alt: '', link: ''                      }
    case 'button':   return { id, type, text: 'Click Here', href: '#', align: 'center', style: 'primary' }
    case 'divider':  return { id, type }
    default:         return { id, type: 'text', text: '' }
  }
}

const inp = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'

// ── Block type badge colour ───────────────────────────────────────────────────
const BADGE = {
  heading: 'bg-purple-50 text-purple-600',
  text:    'bg-blue-50 text-blue-600',
  image:   'bg-green-50 text-green-600',
  button:  'bg-orange-50 text-orange-600',
  divider: 'bg-gray-100 text-gray-500',
}

// ── Alignment pill control ────────────────────────────────────────────────────
function AlignControl({ value, onChange }) {
  return (
    <div className="flex gap-1 shrink-0">
      {ALIGN_OPTS.map(a => (
        <button key={a} onClick={() => onChange(a)}
          className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${
            value === a ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'
          }`}>
          {a[0].toUpperCase()}
        </button>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PageBlockEditor({ blocks, onChange }) {
  const [pickerOpen, setPickerOpen] = useState(false)

  const update = (i, changes) => {
    const next = [...blocks]
    next[i] = { ...next[i], ...changes }
    onChange(next)
  }

  const move = (i, dir) => {
    const next = [...blocks]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  const remove = (i) => onChange(blocks.filter((_, idx) => idx !== i))

  const add = (type) => {
    onChange([...blocks, newBlock(type)])
    setPickerOpen(false)
  }

  return (
    <div className="space-y-2">

      {/* ── Block list ──────────────────────────────────────────────────── */}
      {blocks.length === 0 && (
        <div className="text-center py-8 rounded-xl border border-dashed border-gray-300 bg-gray-50">
          <p className="text-sm text-gray-400 mb-1">No content blocks yet.</p>
          <p className="text-xs text-gray-400">Click "Add Block" below to start building.</p>
        </div>
      )}

      {blocks.map((block, i) => (
        <div key={block.id || i} className="flex gap-2 items-start group">

          {/* Up / Down */}
          <div className="flex flex-col gap-0 pt-3 shrink-0">
            <button onClick={() => move(i, -1)} disabled={i === 0}
              className="text-gray-300 hover:text-gray-500 disabled:opacity-20 leading-none">
              <ChevronUp size={12} />
            </button>
            <button onClick={() => move(i, 1)} disabled={i === blocks.length - 1}
              className="text-gray-300 hover:text-gray-500 disabled:opacity-20 leading-none">
              <ChevronDown size={12} />
            </button>
          </div>

          {/* Block card */}
          <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden bg-white">

            {/* Card header */}
            <div className={`flex items-center justify-between px-3 py-1.5 ${BADGE[block.type] || 'bg-gray-50 text-gray-500'}`}>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {block.type === 'heading' ? `Heading — H${block.level}` : block.type}
              </span>
              {(block.type === 'heading' || block.type === 'text' || block.type === 'button') && (
                <AlignControl value={block.align || 'left'} onChange={a => update(i, { align: a })} />
              )}
            </div>

            {/* Card body */}
            <div className="p-3">

              {/* HEADING */}
              {block.type === 'heading' && (
                <div className="flex gap-2">
                  <select value={block.level || 2} onChange={e => update(i, { level: Number(e.target.value) })}
                    className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0 w-20">
                    <option value={1}>H1</option>
                    <option value={2}>H2</option>
                    <option value={3}>H3</option>
                  </select>
                  <input value={block.text || ''} onChange={e => update(i, { text: e.target.value })}
                    className={inp} placeholder="Heading text…" />
                </div>
              )}

              {/* TEXT */}
              {block.type === 'text' && (
                <textarea value={block.text || ''} onChange={e => update(i, { text: e.target.value })}
                  rows={4} className={`${inp} resize-y`} placeholder="Paragraph text…" />
              )}

              {/* IMAGE */}
              {block.type === 'image' && (
                <div className="space-y-2">
                  <input value={block.src || ''} onChange={e => update(i, { src: e.target.value })}
                    className={`${inp} font-mono text-xs`} placeholder="Image URL  (https://example.com/photo.jpg)" />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={block.alt || ''} onChange={e => update(i, { alt: e.target.value })}
                      className={inp} placeholder="Alt text (optional)" />
                    <input value={block.link || ''} onChange={e => update(i, { link: e.target.value })}
                      className={`${inp} font-mono text-xs`} placeholder="Link URL (optional)" />
                  </div>
                  {block.src && (
                    <img src={block.src} alt={block.alt || ''}
                      className="max-h-36 rounded-lg border border-gray-200 object-cover"
                      onError={e => { e.target.style.display = 'none' }} />
                  )}
                </div>
              )}

              {/* BUTTON */}
              {block.type === 'button' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input value={block.text || ''} onChange={e => update(i, { text: e.target.value })}
                      className={inp} placeholder="Button label" />
                    <input value={block.href || ''} onChange={e => update(i, { href: e.target.value })}
                      className={`${inp} font-mono text-xs`} placeholder="/page or https://…" />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-500 shrink-0">Style:</span>
                    {['primary', 'accent', 'outline'].map(s => (
                      <button key={s} onClick={() => update(i, { style: s })}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                          (block.style || 'primary') === s
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* DIVIDER */}
              {block.type === 'divider' && (
                <div className="border-t-2 border-dashed border-gray-300 my-1" />
              )}

            </div>
          </div>

          {/* Delete — fades in on hover */}
          <button onClick={() => remove(i)}
            className="shrink-0 mt-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {/* ── Add block picker ─────────────────────────────────────────────── */}
      <div className="relative">
        <button onClick={() => setPickerOpen(p => !p)}
          className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-colors ${
            pickerOpen
              ? 'border-blue-400 text-blue-600 bg-blue-50'
              : 'border-gray-300 text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
          }`}>
          <Plus size={15} /> Add Block
        </button>

        {pickerOpen && (
          <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-20">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Choose a block type</p>
            <div className="grid grid-cols-5 gap-2">
              {BLOCK_TYPES.map(({ type, label, icon: Icon, desc }) => (
                <button key={type} onClick={() => add(type)}
                  title={desc}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-gray-600 transition-colors">
                  <Icon size={18} />
                  <span className="text-[11px] font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
