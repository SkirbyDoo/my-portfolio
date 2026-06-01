import { useState, useEffect } from 'react'
import { useContent } from '../../hooks/useContent'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'
import {
  Undo2, Plus, Trash2, Eye, EyeOff,
  ChevronDown, ChevronUp, ChevronRight, FileText, ExternalLink, Navigation,
} from 'lucide-react'

const inp = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

// ── All built-in site pages/sections that can be added to the nav ─────────────
const BUILT_IN_PAGES = [
  { label: 'Home',                    href: '/'             },
  { label: 'About (section)',         href: '#about'        },
  { label: 'Services (section)',      href: '#services'     },
  { label: 'Team (section)',          href: '#team'         },
  { label: 'Testimonials (section)',  href: '#testimonials' },
  { label: 'Contact (section)',       href: '#contact'      },
]

export default function PagesEditor() {
  const { content: nav, saveContent: saveNav, undoLastSave: undoNav } = useContent('navigation')
  const { content: pagesContent, saveContent: savePages }             = useContent('custom_pages')

  const [navForm,    setNavForm]    = useState(null)
  const [pagesForm,  setPagesForm]  = useState(null)
  const [saving,     setSaving]     = useState(false)
  const [dropOpen,   setDropOpen]   = useState({})   // { [linkIndex]: bool }

  useEffect(() => { if (nav)          setNavForm(nav)          }, [nav])
  useEffect(() => { if (pagesContent) setPagesForm(pagesContent) }, [pagesContent])

  if (!navForm || !pagesForm) return <div className="text-gray-400 text-sm p-4">Loading…</div>

  // ── Logo / CTA ────────────────────────────────────────────────────────────
  const setNav = (key, val) => setNavForm(prev => ({ ...prev, [key]: val }))

  // ── Top-level link helpers ────────────────────────────────────────────────
  const links = navForm.links || []

  const setLink = (i, key, val) => {
    const next = [...links]
    next[i] = { ...next[i], [key]: val }
    setNav('links', next)
  }

  const moveLink = (i, dir) => {
    const next = [...links]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    setNav('links', next)
  }

  const toggleVisible = (i) => setLink(i, 'visible', links[i].visible === false ? true : false)

  const addLink = () => setNav('links', [...links, { label: 'New Link', href: '#', visible: true }])

  const removeLink = (i) => {
    setNav('links', links.filter((_, idx) => idx !== i))
    setDropOpen(prev => { const n = { ...prev }; delete n[i]; return n })
  }

  const toggleDropdown = (i) => {
    if (links[i].children) {
      // strip children
      const { children: _c, ...rest } = links[i]
      const next = [...links]; next[i] = rest
      setNav('links', next)
      setDropOpen(prev => ({ ...prev, [i]: false }))
    } else {
      setLink(i, 'children', [{ label: 'Sub-link', href: '#', visible: true }])
      setDropOpen(prev => ({ ...prev, [i]: true }))
    }
  }

  // ── Child link helpers ────────────────────────────────────────────────────
  const setChild = (pi, ci, key, val) => {
    const next = [...links]
    const children = [...(next[pi].children || [])]
    children[ci] = { ...children[ci], [key]: val }
    next[pi] = { ...next[pi], children }
    setNav('links', next)
  }

  const moveChild = (pi, ci, dir) => {
    const next = [...links]
    const children = [...(next[pi].children || [])]
    const j = ci + dir
    if (j < 0 || j >= children.length) return
    ;[children[ci], children[j]] = [children[j], children[ci]]
    next[pi] = { ...next[pi], children }
    setNav('links', next)
  }

  const toggleChildVisible = (pi, ci) => {
    const child = links[pi].children[ci]
    setChild(pi, ci, 'visible', child.visible === false ? true : false)
  }

  const addChild = (pi) => {
    const next = [...links]
    const children = [...(next[pi].children || []), { label: 'Sub-link', href: '#', visible: true }]
    next[pi] = { ...next[pi], children }
    setNav('links', next)
  }

  const removeChild = (pi, ci) => {
    const next = [...links]
    next[pi] = { ...next[pi], children: next[pi].children.filter((_, idx) => idx !== ci) }
    setNav('links', next)
  }

  // ── Page → Nav helpers ────────────────────────────────────────────────────
  // Is a given href already present as a top-level nav link?
  const isInNav = (href) => links.some(l => l.href === href)

  const addPageToNav = (label, href) => {
    if (isInNav(href)) return
    setNav('links', [...links, { label, href, visible: true }])
  }

  const removePageFromNav = (href) => {
    setNav('links', links.filter(l => l.href !== href))
  }

  // All pages (built-in + custom) usable for quick-add
  const allPages = [
    ...BUILT_IN_PAGES,
    ...(pagesForm.pages || []).map(p => ({
      label: p.title || p.slug,
      href:  `/page/${p.slug}`,
    })),
  ]
  const addablePages = allPages.filter(p => !isInNav(p.href))

  // ── Custom page helpers ───────────────────────────────────────────────────
  const addCustomPage = () => {
    const slug = `new-page-${Date.now()}`
    setPagesForm(prev => ({
      ...prev,
      pages: [...(prev.pages || []), { slug, title: 'New Page', blocks: [] }],
    }))
  }

  const setPageField = (slug, key, val) => {
    setPagesForm(prev => ({
      ...prev,
      pages: prev.pages.map(p => {
        if (p.slug !== slug) return p
        const updated = { ...p, [key]: key === 'slug' ? val.toLowerCase().replace(/[^a-z0-9-]/g, '-') : val }
        // When blocks are updated, drop the legacy content string to avoid confusion
        if (key === 'blocks') delete updated.content
        return updated
      }),
    }))
  }

  const removeCustomPage = (slug) => {
    setPagesForm(prev => ({ ...prev, pages: prev.pages.filter(p => p.slug !== slug) }))
    setNav('links', links.filter(l => l.href !== `/page/${slug}`))
  }

  // ── Save / Undo ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    const [{ error: e1 }, { error: e2 }] = await Promise.all([saveNav(navForm), savePages(pagesForm)])
    if (e1 || e2) toast.error('Save failed.')
    else toast.success('Navigation saved!')
    setSaving(false)
  }

  const handleUndo = async () => {
    const { error } = await undoNav()
    if (error) toast.error('Nothing to undo.')
    else toast.success('Changes undone!')
  }

  return (
    <div className="space-y-10 p-6 lg:p-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Navigation & Pages</h2>
        <p className="text-sm text-gray-500">Control the site name, menu links, link order, and custom pages</p>
      </div>

      {/* ── Logo & CTA ────────────────────────────────────────────────────── */}
      <section>
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Logo & Call-to-Action Button</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Site Name / Logo Text</label>
            <input value={navForm.logo || ''} onChange={e => setNav('logo', e.target.value)}
              className={`w-full ${inp}`} placeholder="My Website" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Button Label</label>
            <input value={navForm.ctaLabel || ''} onChange={e => setNav('ctaLabel', e.target.value)}
              className={`w-full ${inp}`} placeholder="Get Started" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Button Link</label>
            <input value={navForm.ctaHref || ''} onChange={e => setNav('ctaHref', e.target.value)}
              className={`w-full ${inp} font-mono text-xs`} placeholder="/page or #section" />
          </div>
        </div>
      </section>

      {/* ── Navigation Menu ───────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Navigation Menu</h3>
        </div>

        {/* ── Quick-add any page ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <Navigation size={14} className="text-blue-500 shrink-0" />
          <select
            value=""
            onChange={e => {
              const page = allPages.find(p => p.href === e.target.value)
              if (page) addPageToNav(page.label, page.href)
              e.target.value = ''
            }}
            className="flex-1 min-w-0 bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">
              {addablePages.length === 0 ? 'All pages are already in the nav' : 'Add a page to the nav…'}
            </option>
            {addablePages.length > 0 && (
              <>
                <optgroup label="Built-in Pages">
                  {addablePages.filter(p => !p.href.startsWith('/page/')).map(p => (
                    <option key={p.href} value={p.href}>{p.label}</option>
                  ))}
                </optgroup>
                {addablePages.some(p => p.href.startsWith('/page/')) && (
                  <optgroup label="Custom Pages">
                    {addablePages.filter(p => p.href.startsWith('/page/')).map(p => (
                      <option key={p.href} value={p.href}>{p.label}</option>
                    ))}
                  </optgroup>
                )}
              </>
            )}
          </select>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          Use ↑↓ arrows to reorder · eye icon shows/hides · <span className="font-semibold text-gray-500">▾</span> adds a dropdown sub-menu ·
          <button onClick={addLink} className="ml-1 text-blue-500 hover:text-blue-700 font-medium underline underline-offset-2">
            + add external/custom link
          </button>
        </p>

        {links.length === 0 && (
          <div className="text-center py-8 rounded-xl border border-dashed border-gray-300 bg-gray-50">
            <p className="text-sm text-gray-400 mb-2">No nav links yet.</p>
            <button onClick={addLink} className="text-sm text-blue-600 hover:text-blue-700">+ Add a link</button>
          </div>
        )}

        <div className="space-y-2">
          {links.map((link, i) => {
            const hasChildren = Array.isArray(link.children)
            const isHidden    = link.visible === false
            const isExpanded  = dropOpen[i]

            return (
              <div key={i} className={`rounded-xl border transition-opacity ${isHidden ? 'border-gray-200 opacity-50' : 'border-gray-200'}`}>

                {/* ── Main row ─────────────────────────────────────────── */}
                <div className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-xl">

                  {/* Up / Down */}
                  <div className="flex flex-col gap-0 shrink-0">
                    <button onClick={() => moveLink(i, -1)} disabled={i === 0}
                      className="text-gray-300 hover:text-gray-500 disabled:opacity-20 leading-none">
                      <ChevronUp size={13} />
                    </button>
                    <button onClick={() => moveLink(i, 1)} disabled={i === links.length - 1}
                      className="text-gray-300 hover:text-gray-500 disabled:opacity-20 leading-none">
                      <ChevronDown size={13} />
                    </button>
                  </div>

                  {/* Eye toggle */}
                  <button onClick={() => toggleVisible(i)}
                    title={isHidden ? 'Hidden — click to show' : 'Visible — click to hide'}
                    className={`shrink-0 p-1 rounded transition-colors ${isHidden ? 'text-gray-300 hover:text-gray-500' : 'text-blue-500 hover:text-blue-700'}`}>
                    {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>

                  {/* Label */}
                  <input value={link.label} onChange={e => setLink(i, 'label', e.target.value)}
                    className={`w-28 shrink-0 ${inp} text-xs`} placeholder="Label" />

                  {/* Href */}
                  <input value={link.href} onChange={e => setLink(i, 'href', e.target.value)}
                    className={`flex-1 min-w-0 ${inp} text-xs font-mono`} placeholder="/page or #section" />

                  {/* Dropdown toggle */}
                  <button onClick={() => toggleDropdown(i)}
                    title={hasChildren ? 'Remove dropdown sub-menu' : 'Add dropdown sub-menu'}
                    className={`shrink-0 text-xs px-2 py-1 rounded-lg border font-bold transition-colors ${
                      hasChildren
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'
                        : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                    }`}>
                    ▾
                  </button>

                  {/* Expand children arrow */}
                  {hasChildren && (
                    <button onClick={() => setDropOpen(p => ({ ...p, [i]: !p[i] }))}
                      className="shrink-0 text-gray-400 hover:text-gray-600">
                      <ChevronRight size={14} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  )}

                  {/* Delete */}
                  <button onClick={() => removeLink(i)} className="shrink-0 text-red-400 hover:text-red-600">
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* ── Children ─────────────────────────────────────────── */}
                {hasChildren && isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 space-y-2 rounded-b-xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Sub-menu items
                    </p>
                    {link.children.map((child, ci) => {
                      const childHidden = child.visible === false
                      return (
                        <div key={ci} className="flex items-center gap-2">
                          {/* Up / Down */}
                          <div className="flex flex-col gap-0 shrink-0">
                            <button onClick={() => moveChild(i, ci, -1)} disabled={ci === 0}
                              className="text-gray-300 hover:text-gray-500 disabled:opacity-20 leading-none">
                              <ChevronUp size={11} />
                            </button>
                            <button onClick={() => moveChild(i, ci, 1)} disabled={ci === link.children.length - 1}
                              className="text-gray-300 hover:text-gray-500 disabled:opacity-20 leading-none">
                              <ChevronDown size={11} />
                            </button>
                          </div>

                          {/* Eye */}
                          <button onClick={() => toggleChildVisible(i, ci)}
                            className={`shrink-0 p-1 rounded transition-colors ${childHidden ? 'text-gray-300 hover:text-gray-500' : 'text-blue-500 hover:text-blue-700'}`}>
                            {childHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>

                          <input value={child.label} onChange={e => setChild(i, ci, 'label', e.target.value)}
                            className={`w-28 shrink-0 ${inp} text-xs`} placeholder="Label" />
                          <input value={child.href} onChange={e => setChild(i, ci, 'href', e.target.value)}
                            className={`flex-1 min-w-0 ${inp} text-xs font-mono`} placeholder="/page or #section" />
                          <button onClick={() => removeChild(i, ci)} className="shrink-0 text-red-400 hover:text-red-600">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )
                    })}
                    <button onClick={() => addChild(i)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-1">
                      <Plus size={12} /> Add sub-item
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Custom Pages ──────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Custom Pages</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Each page gets its own URL at <span className="font-mono">/page/slug</span>.
          Click <span className="font-semibold text-gray-500">Add to Nav</span> to show it in the menu.
        </p>

        {/* New page CTA */}
        <button onClick={addCustomPage}
          className="w-full flex items-center justify-center gap-2 py-3 mb-4 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors text-sm font-semibold">
          <Plus size={16} /> Create New Page
        </button>

        <p className="text-xs text-gray-400 mb-3">
          New pages appear in the <span className="font-semibold text-gray-500">Pages</span> section of the sidebar — click them there to edit content with the block builder.
        </p>

        {(!pagesForm.pages || pagesForm.pages.length === 0) ? (
          <div className="text-center py-6 rounded-xl border border-gray-200 bg-gray-50">
            <FileText size={28} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No custom pages yet. Click the button above to create one.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {(pagesForm.pages || []).map(page => {
              const blockCount  = (page.blocks?.length) ?? (page.content ? 1 : 0)
              const pageHref    = `/page/${page.slug}`
              const inNav       = isInNav(pageHref)

              return (
                <div key={page.slug} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50">
                  <FileText size={14} className="text-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{page.title || 'Untitled'}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{pageHref}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 hidden sm:block">
                    {blockCount} block{blockCount !== 1 ? 's' : ''}
                  </span>

                  {/* Add to Nav / In Nav toggle */}
                  {inNav ? (
                    <button
                      onClick={() => removePageFromNav(pageHref)}
                      title="In nav — click to remove"
                      className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shrink-0"
                    >
                      <Navigation size={11} /> In Nav
                    </button>
                  ) : (
                    <button
                      onClick={() => addPageToNav(page.title || page.slug, pageHref)}
                      title="Add to navigation menu"
                      className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white text-gray-500 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shrink-0"
                    >
                      <Navigation size={11} /> Add to Nav
                    </button>
                  )}

                  <a href={pageHref} target="_blank" rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 transition-colors shrink-0" title="Preview page">
                    <ExternalLink size={13} />
                  </a>
                  <button onClick={() => removeCustomPage(page.slug)}
                    className="text-red-400 hover:text-red-600 shrink-0" title="Delete page">
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
        <Button variant="ghost" onClick={handleUndo}><Undo2 size={16} className="mr-1" /> Undo Last Save</Button>
      </div>
    </div>
  )
}
