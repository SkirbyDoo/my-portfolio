// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
// Shared block renderer — used on CustomPage, Rules, Register, and any section
// that stores additional content blocks.

import { blockToCss } from '../lib/textStyle'

const ALIGN_CLS = { left: 'text-left', center: 'text-center', right: 'text-right' }

const COL_CLS = { 1: 'grid-cols-1', 2: 'grid-cols-1 md:grid-cols-2', 3: 'grid-cols-1 md:grid-cols-3', 4: 'grid-cols-2 md:grid-cols-4' }

function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<\/?(p|div|br)[^>]*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function BlockRenderer({ blocks }) {
  if (!blocks?.length) return null

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        const align = ALIGN_CLS[block.align] || 'text-left'
        const textCss = blockToCss(block)

        // ── Heading ────────────────────────────────────────────────────────
        if (block.type === 'heading') {
          const sizes = {
            1: 'text-4xl sm:text-5xl font-extrabold',
            2: 'text-2xl sm:text-3xl font-bold',
            3: 'text-xl font-semibold',
          }
          const Tag = `h${block.level || 2}`
          return (
            <Tag key={block.id || i} className={`${sizes[block.level || 2]} text-[var(--color-primary)] ${align}`} style={textCss}>
              {block.text}
            </Tag>
          )
        }

        // ── Text ───────────────────────────────────────────────────────────
        if (block.type === 'text') {
          // HTML mode: render raw HTML with prose styles
          if (block.htmlMode) {
            return (
              <div
                key={block.id || i}
                className={`text-[var(--color-text)] leading-relaxed prose max-w-none ${align}`}
                style={textCss}
                dangerouslySetInnerHTML={{ __html: block.text || '' }}
              />
            )
          }
          // Plain text: clean any stray HTML, split on double-newlines for paragraph spacing
          const raw = /<[a-z]/i.test(block.text || '') ? stripHtml(block.text) : (block.text || '')
          const paragraphs = raw.split(/\n\n+/).filter(Boolean)
          if (paragraphs.length > 1) {
            return (
              <div key={block.id || i} className={`space-y-4 ${align}`} style={textCss}>
                {paragraphs.map((para, pi) => (
                  <p key={pi} className="text-[var(--color-text)] leading-relaxed">
                    {para.split('\n').map((line, li, arr) => (
                      <span key={li}>{line}{li < arr.length - 1 && <br />}</span>
                    ))}
                  </p>
                ))}
              </div>
            )
          }
          return (
            <p key={block.id || i} className={`text-[var(--color-text)] leading-relaxed whitespace-pre-wrap ${align}`} style={textCss}>
              {raw}
            </p>
          )
        }

        // ── Image ──────────────────────────────────────────────────────────
        if (block.type === 'image') {
          if (!block.src) return null
          const img = (
            <img
              src={block.src}
              alt={block.alt || ''}
              className="max-w-full rounded-xl border border-gray-200 shadow-sm"
              style={{
                display: 'block',
                margin: block.align === 'center' ? '0 auto' : block.align === 'right' ? '0 0 0 auto' : undefined,
              }}
            />
          )
          return (
            <div key={block.id || i}>
              {block.link ? <a href={block.link} target="_blank" rel="noopener noreferrer">{img}</a> : img}
            </div>
          )
        }

        // ── Button ─────────────────────────────────────────────────────────
        if (block.type === 'button') {
          const styleMap = {
            primary: 'bg-[var(--color-primary)] text-white hover:opacity-90',
            accent:  'bg-[var(--color-accent)] text-white hover:opacity-90',
            outline: 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white',
          }
          const btnCls = styleMap[block.style || 'primary']
          const wrapCls = block.align === 'center' ? 'text-center' : block.align === 'right' ? 'text-right' : 'text-left'
          return (
            <div key={block.id || i} className={wrapCls}>
              <a
                href={block.href || '#'}
                className={`inline-block font-bold px-7 py-3.5 rounded-xl text-sm uppercase tracking-wide transition-all ${btnCls}`}
              >
                {block.text || 'Click Here'}
              </a>
            </div>
          )
        }

        // ── Divider ────────────────────────────────────────────────────────
        if (block.type === 'divider') {
          return <hr key={block.id || i} className="border-gray-200" />
        }

        // ── Row ────────────────────────────────────────────────────────────
        if (block.type === 'row') {
          const cols = Math.min(Math.max(block.columns || 2, 1), 4)
          const gridCls = COL_CLS[cols] || COL_CLS[2]
          const gap = { sm: 'gap-3', md: 'gap-6', lg: 'gap-10' }[block.gap || 'md'] || 'gap-6'
          return (
            <div key={block.id || i} className={`grid ${gridCls} ${gap}`}>
              {(block.cells || []).map((cell, ci) => (
                <div key={ci}>
                  <BlockRenderer blocks={cell.blocks || []} />
                </div>
              ))}
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

export default BlockRenderer
