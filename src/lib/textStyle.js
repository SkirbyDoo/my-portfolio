// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
// Per-item text style overrides — shared helper used by both the dashboard
// editing widget (StyledTextInput) and the live section components that render
// the styled text. Keep this dependency-free so any section can import it.
//
// A "text style" is a small override applied to ONE text field. Every property
// is optional — anything left unset (null/false) falls back to the sitewide
// typography from Settings → Typography, so existing content is unaffected.

export const FONT_WEIGHTS = [
  { value: '400', label: 'Normal' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
]

// The default (empty) override — every field inherits sitewide styles.
export const EMPTY_TEXT_STYLE = {
  fontSize: null,      // number (px) — null means inherit the sitewide size
  fontWeight: null,    // '400' | '500' | '600' | '700' — null means inherit
  color: null,         // hex string (e.g. '#1a1a1a') — null means inherit
  textAlign: null,     // 'left' | 'center' | 'right' — null means inherit
  italic: false,
  underline: false,
  strikethrough: false,
}

// Convert a stored override into a React inline-style object. Unset properties
// are omitted so the element's own CSS / Tailwind classes still apply.
export function styleToCss(style) {
  if (!style) return {}
  const css = {}
  if (style.fontSize)   css.fontSize   = `${style.fontSize}px`
  if (style.fontWeight) css.fontWeight = style.fontWeight
  if (style.color)      css.color      = style.color
  if (style.textAlign)  css.textAlign  = style.textAlign
  if (style.italic)     css.fontStyle  = 'italic'

  const decorations = []
  if (style.underline)     decorations.push('underline')
  if (style.strikethrough) decorations.push('line-through')
  if (decorations.length)  css.textDecoration = decorations.join(' ')

  return css
}

// True when nothing is overridden — used to show/hide the "Reset" affordance.
export function isEmptyTextStyle(style) {
  if (!style) return true
  return !style.fontSize && !style.fontWeight && !style.color &&
         !style.textAlign && !style.italic && !style.underline && !style.strikethrough
}

// Block builder convenience: blocks store the style fields flat alongside their
// own `align` (which the renderer applies as a Tailwind class), so build the
// inline CSS from those fields and skip textAlign here.
export function blockToCss(block) {
  if (!block) return {}
  return styleToCss({
    fontSize: block.fontSize,
    fontWeight: block.fontWeight,
    color: block.color,
    italic: block.italic,
    underline: block.underline,
    strikethrough: block.strikethrough,
  })
}
