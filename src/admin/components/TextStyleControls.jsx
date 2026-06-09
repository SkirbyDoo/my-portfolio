// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, RotateCcw,
} from 'lucide-react'
import { EMPTY_TEXT_STYLE, FONT_WEIGHTS, isEmptyTextStyle } from '../../lib/textStyle'

// Reusable per-item formatting toolbar (size, weight, color, B/I/U/S, and
// optionally alignment). Operates on a plain style object:
//   { fontSize, fontWeight, color, textAlign, italic, underline, strikethrough }
// and emits the full updated object via onChange.
//
// Used by StyledTextInput (classic section fields, showAlign on) and by the
// block builder's Text/Heading widgets (showAlign off — those keep their own
// align control in the block header).
//
// Module-level Toggle so it keeps a stable identity across renders — defining
// it inside the component would remount every button on each change and make
// the first click of a toggle appear to do nothing.
function Toggle({ active, onClick, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`h-8 w-8 flex items-center justify-center rounded-md border transition-colors ${
        active
          ? 'bg-blue-600 border-blue-600 text-white'
          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  )
}

export default function TextStyleControls({ style, onChange, showAlign = true }) {
  const s = { ...EMPTY_TEXT_STYLE, ...(style || {}) }
  const setStyle = (patch) => onChange({ ...s, ...patch })
  const reset = () => onChange({ ...EMPTY_TEXT_STYLE })

  const isBold = s.fontWeight === '700'

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 border border-gray-100 px-2.5 py-2">
      {/* Font size */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400">Size</span>
        <input
          type="number"
          min="8"
          max="200"
          value={s.fontSize ?? ''}
          onChange={e => setStyle({ fontSize: e.target.value === '' ? null : Number(e.target.value) })}
          placeholder="auto"
          className="w-16 border border-gray-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span className="text-xs text-gray-400">px</span>
      </div>

      {/* Font weight */}
      <select
        value={s.fontWeight ?? ''}
        onChange={e => setStyle({ fontWeight: e.target.value || null })}
        className="border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Weight</option>
        {FONT_WEIGHTS.map(w => (
          <option key={w.value} value={w.value}>{w.label}</option>
        ))}
      </select>

      {/* Bold / italic / underline / strikethrough */}
      <div className="flex items-center gap-1">
        <Toggle active={isBold} onClick={() => setStyle({ fontWeight: isBold ? null : '700' })} title="Bold">
          <Bold size={14} />
        </Toggle>
        <Toggle active={s.italic} onClick={() => setStyle({ italic: !s.italic })} title="Italic">
          <Italic size={14} />
        </Toggle>
        <Toggle active={s.underline} onClick={() => setStyle({ underline: !s.underline })} title="Underline">
          <Underline size={14} />
        </Toggle>
        <Toggle active={s.strikethrough} onClick={() => setStyle({ strikethrough: !s.strikethrough })} title="Strikethrough">
          <Strikethrough size={14} />
        </Toggle>
      </div>

      {/* Alignment (optional — block builder hides this and uses its own) */}
      {showAlign && (
        <div className="flex items-center gap-1">
          <Toggle active={s.textAlign === 'left'} onClick={() => setStyle({ textAlign: s.textAlign === 'left' ? null : 'left' })} title="Align left">
            <AlignLeft size={14} />
          </Toggle>
          <Toggle active={s.textAlign === 'center'} onClick={() => setStyle({ textAlign: s.textAlign === 'center' ? null : 'center' })} title="Align center">
            <AlignCenter size={14} />
          </Toggle>
          <Toggle active={s.textAlign === 'right'} onClick={() => setStyle({ textAlign: s.textAlign === 'right' ? null : 'right' })} title="Align right">
            <AlignRight size={14} />
          </Toggle>
        </div>
      )}

      {/* Color */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400">Color</span>
        <input
          type="color"
          value={s.color || '#000000'}
          onChange={e => setStyle({ color: e.target.value })}
          title="Text color"
          className="h-7 w-9 rounded border border-gray-200 cursor-pointer bg-white p-0.5"
        />
        {s.color && (
          <button type="button" onClick={() => setStyle({ color: null })} className="text-xs text-gray-400 hover:text-gray-600">
            clear
          </button>
        )}
      </div>

      {/* Reset all overrides */}
      {!isEmptyTextStyle(s) && (
        <button
          type="button"
          onClick={reset}
          title="Reset to sitewide default"
          className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
        >
          <RotateCcw size={12} /> Reset
        </button>
      )}
    </div>
  )
}
