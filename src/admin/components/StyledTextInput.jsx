// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
import TextStyleControls from './TextStyleControls'
import { EMPTY_TEXT_STYLE, styleToCss } from '../../lib/textStyle'

// A text input / textarea with an always-visible row of per-item formatting
// controls (size, weight, color, alignment, bold/italic/underline/strike).
//
// Drop-in replacement for a plain labelled <input>/<textarea> in any editor:
//   <StyledTextInput
//     label="Main Headline"
//     value={form.headline}        onChange={v => set('headline', v)}
//     style={form.headlineStyle}   onStyleChange={v => set('headlineStyle', v)}
//   />
// The text saves into its existing content key; the style saves into a sibling
// `<key>Style` object, so it rides along with the section's normal save/publish.
export default function StyledTextInput({
  label,
  hint,
  value,
  onChange,
  style,
  onStyleChange,
  multiline = false,
  rows = 2,
  placeholder = '',
}) {
  const s = { ...EMPTY_TEXT_STYLE, ...(style || {}) }

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {hint && <span className="text-gray-400 font-normal"> {hint}</span>}
        </label>
      )}

      {multiline ? (
        <textarea
          rows={rows}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={styleToCss(s)}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={styleToCss(s)}
          className={inputClass}
        />
      )}

      <div className="mt-2">
        <TextStyleControls style={style} onChange={onStyleChange} />
      </div>
    </div>
  )
}
