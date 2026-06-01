import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useContent } from '../hooks/useContent'
import {
  Menu, Image, MessageSquare, Navigation,
  Settings, LogOut, ExternalLink, Star, ChevronRight, ChevronDown,
  Info, Home, DollarSign, Briefcase,
  Mail, Pencil, FileText,
} from 'lucide-react'
import HeroEditor         from './editors/HeroEditor'
import AboutEditor        from './editors/AboutEditor'
import ServicesEditor     from './editors/ServicesEditor'
import PricingEditor      from './editors/PricingEditor'
import PortfolioEditor    from './editors/PortfolioEditor'
import TestimonialsEditor from './editors/TestimonialsEditor'
import ContactEditor      from './editors/ContactEditor'
import SettingsEditor     from './editors/SettingsEditor'
import PagesEditor        from './editors/PagesEditor'
import CustomPageEditor   from './editors/CustomPageEditor'

// ── Default sidebar labels ────────────────────────────────────────────────────
const DEFAULT_LABELS = {
  home: 'Home Page',
}

// ── Static page tree ─────────────────────────────────────────────────────────
const PAGE_TREE = [
  {
    id: 'home',
    icon: Home,
    defaultOpen: true,
    children: [
      { id: 'hero',         label: 'Hero',         icon: Image,         component: HeroEditor },
      { id: 'services',     label: 'Services',     icon: Star,          component: ServicesEditor },
      { id: 'pricing',      label: 'Pricing',      icon: DollarSign,    component: PricingEditor },
      { id: 'portfolio',    label: 'Portfolio',    icon: Briefcase,     component: PortfolioEditor },
      { id: 'about',        label: 'About',        icon: Info,          component: AboutEditor },
      { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, component: TestimonialsEditor },
      { id: 'contact',      label: 'Contact',      icon: Mail,          component: ContactEditor },
    ],
  },
]

const SITE_ITEMS = [
  { id: 'navigation', label: 'Navigation & Pages', icon: Navigation, component: PagesEditor },
  { id: 'settings',   label: 'Settings',           icon: Settings,   component: SettingsEditor },
]

export default function AdminPanel({ reviewMode = false, onExit }) {
  const { signOut } = useAuth()
  const handleExit = reviewMode ? onExit : signOut
  const { content: savedLabels,      saveContent: saveLabels } = useContent('page_labels')
  const { content: customPagesData }                           = useContent('custom_pages')

  const [labels,      setLabels]      = useState(DEFAULT_LABELS)
  const [active,      setActive]      = useState(null)
  const [expanded,    setExpanded]    = useState(() => {
    const s = {}
    PAGE_TREE.forEach(item => { if (item.children) s[item.id] = item.defaultOpen ?? false })
    return s
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingId,   setEditingId]   = useState(null)
  const [editingVal,  setEditingVal]  = useState('')

  useEffect(() => {
    if (savedLabels) setLabels({ ...DEFAULT_LABELS, ...savedLabels })
  }, [savedLabels])

  // Scroll to top and reset any iOS zoom when the panel first mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    const meta = document.querySelector('meta[name="viewport"]')
    if (!meta) return
    const original = meta.getAttribute('content')
    // Setting maximum-scale=1.0 forces iOS Safari to snap back to 1× zoom immediately
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    return () => meta.setAttribute('content', original)
  }, [])

  // ── Dynamic custom page items ─────────────────────────────────────────────
  const customPageItems = useMemo(() =>
    (customPagesData?.pages || []).map(p => ({
      id:           `page_${p.slug}`,
      slug:         p.slug,
      icon:         FileText,
      component:    CustomPageEditor,
      props:        { slug: p.slug },
      dynamicLabel: p.title || p.slug,
    })),
    [customPagesData]
  )

  // ── Flat map (dynamic, includes custom pages) ─────────────────────────────
  const FLAT = useMemo(() => {
    const map = {}
    for (const item of PAGE_TREE) {
      map[item.id] = item
      if (item.children) {
        for (const child of item.children) map[child.id] = { ...child, parentId: item.id }
      }
    }
    for (const item of SITE_ITEMS) map[item.id] = item
    for (const item of customPageItems) map[item.id] = item
    return map
  }, [customPageItems])

  const getLabel = (id) => {
    const item = FLAT[id]
    return labels[id] ?? DEFAULT_LABELS[id] ?? item?.dynamicLabel ?? id
  }

  // ── Label editing ─────────────────────────────────────────────────────────
  const startEdit = (e, id) => {
    e.stopPropagation()
    setEditingId(id)
    setEditingVal(getLabel(id))
    requestAnimationFrame(() => {
      document.getElementById(`lbl-${id}`)?.focus()
      document.getElementById(`lbl-${id}`)?.select()
    })
  }

  const commitEdit = async () => {
    if (!editingId) return
    const updated = { ...labels, [editingId]: editingVal.trim() || DEFAULT_LABELS[editingId] }
    setLabels(updated)
    await saveLabels(updated)
    setEditingId(null)
  }

  const cancelEdit = () => setEditingId(null)

  // ── Navigation ────────────────────────────────────────────────────────────
  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const selectItem = (id) => {
    setActive(id)
    setSidebarOpen(false)
  }

  // Breadcrumb
  const activeItem  = FLAT[active]
  const parentLabel = activeItem?.parentId ? getLabel(activeItem.parentId) : null
  const thisLabel   = activeItem?.label ?? activeItem?.dynamicLabel ?? getLabel(active)
  const breadcrumb  = !active
    ? (reviewMode ? 'Overview' : 'Dashboard')
    : parentLabel ? `${parentLabel}  /  ${thisLabel}` : thisLabel

  const ActiveEditor = activeItem?.component
  const editorProps  = activeItem?.props ?? {}

  // All editors use the full-width container for consistent palette-left layout

  // ── Reusable label cell ───────────────────────────────────────────────────
  const LabelCell = ({ id, staticLabel, editable }) => {
    if (editingId === id) {
      return (
        <input
          id={`lbl-${id}`}
          value={editingVal}
          onChange={e => setEditingVal(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter')  { e.preventDefault(); commitEdit() }
            if (e.key === 'Escape') cancelEdit()
          }}
          onBlur={commitEdit}
          onClick={e => e.stopPropagation()}
          className="flex-1 min-w-0 text-sm bg-transparent border-b border-blue-400 outline-none"
        />
      )
    }
    return (
      <span className="flex-1 min-w-0 truncate text-sm">
        {staticLabel ?? getLabel(id)}
      </span>
    )
  }

  const EditBtn = ({ id }) => (
    <span
      role="button"
      tabIndex={0}
      onClick={e => startEdit(e, id)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startEdit(e, id) } }}
      className="opacity-0 group-hover:opacity-100 shrink-0 text-gray-400 hover:text-gray-600 transition-opacity ml-1 cursor-pointer"
      title="Rename"
    >
      <Pencil size={11} />
    </span>
  )

  // ── Sidebar item styles ───────────────────────────────────────────────────
  const parentCls = (id) => `
    w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left cursor-pointer
    transition-colors group
    ${FLAT[active]?.parentId === id ? 'text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
  `
  const childCls = (id) => `
    w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left cursor-pointer
    transition-colors group text-sm
    ${active === id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}
  `
  const standaloneCls = (id) => `
    w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left cursor-pointer
    transition-colors group text-sm
    ${active === id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
  `

  return (
    <div className="admin-panel h-screen bg-gray-100 flex overflow-hidden">

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-56 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}>

        {/* Header */}
        <div className={`px-4 py-4 border-b border-gray-100 shrink-0 ${reviewMode ? 'bg-blue-50' : ''}`}>
          <p className="font-bold text-gray-900 text-sm">{reviewMode ? 'Client Review' : 'Website Admin'}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{reviewMode ? 'Your personal preview' : 'Content Manager'}</p>
        </div>

        {/* Tree nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">

          {/* PAGES */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1.5">Pages</p>

            {/* Static page tree */}
            {PAGE_TREE.map(item => {
              const Icon = item.icon
              const isParent = !!item.children
              const isOpen = expanded[item.id]

              if (isParent) {
                return (
                  <div key={item.id}>
                    <button onClick={() => toggleExpand(item.id)} className={parentCls(item.id)}>
                      <Icon size={15} className="shrink-0 text-gray-400" />
                      <LabelCell id={item.id} editable={item.editable} />
                      {item.editable && editingId !== item.id && <EditBtn id={item.id} />}
                      {isOpen
                        ? <ChevronDown  size={13} className="shrink-0 text-gray-400 ml-auto" />
                        : <ChevronRight size={13} className="shrink-0 text-gray-400 ml-auto" />
                      }
                    </button>

                    {isOpen && (
                      <div className="ml-4 mt-0.5 pl-3 border-l border-gray-100 space-y-0.5">
                        {item.children.map(child => {
                          const CIcon = child.icon
                          return (
                            <button key={child.id} onClick={() => selectItem(child.id)} className={childCls(child.id)}>
                              {CIcon && <CIcon size={12} className="shrink-0 opacity-50" />}
                              <LabelCell id={child.id} staticLabel={child.label} editable={child.editable} />
                              {child.editable && editingId !== child.id && <EditBtn id={child.id} />}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <button key={item.id} onClick={() => selectItem(item.id)} className={standaloneCls(item.id)}>
                  <Icon size={15} className="shrink-0" />
                  <LabelCell id={item.id} editable={item.editable} />
                  {item.editable && editingId !== item.id && <EditBtn id={item.id} />}
                </button>
              )
            })}

            {/* ── Dynamic custom pages ─────────────────────────────────── */}
            {customPageItems.map(item => (
              <button
                key={item.id}
                onClick={() => selectItem(item.id)}
                className={standaloneCls(item.id)}
                title={`/page/${item.slug}`}
              >
                <FileText size={14} className="shrink-0 opacity-70" />
                <span className="flex-1 min-w-0 truncate text-sm">{item.dynamicLabel}</span>
              </button>
            ))}
          </div>

          {/* SITE */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1.5">Site</p>
            {SITE_ITEMS.map(item => {
              const Icon = item.icon
              return (
                <button key={item.id} onClick={() => selectItem(item.id)} className={standaloneCls(item.id)}>
                  <Icon size={15} className="shrink-0" />
                  <span className="flex-1 min-w-0 truncate">{item.label}</span>
                </button>
              )
            })}
          </div>

        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-gray-100 shrink-0">
          {reviewMode ? (
            <>
              <a
                href="/preview"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-blue-600 font-medium hover:bg-blue-50 transition-colors"
              >
                <ExternalLink size={13} /> Preview My Changes
              </a>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <ExternalLink size={13} /> View Live Site
              </a>
            </>
          ) : (
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <ExternalLink size={13} /> View Live Site
            </a>
          )}
          <button
            onClick={handleExit}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={13} /> {reviewMode ? 'Exit Review' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="flex items-center gap-2 px-3 sm:px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 text-gray-600 gap-0.5 shrink-0">
            <Menu size={20} />
            <span className="text-[9px] font-semibold uppercase tracking-wide leading-none">Pages</span>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-700 truncate">{breadcrumb}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {reviewMode && (
              <>
                {/* Mobile: icon + tiny label stacked */}
                <a
                  href="/preview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex sm:hidden flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <ExternalLink size={16} />
                  <span className="text-[9px] font-semibold uppercase tracking-wide leading-none">Demo</span>
                </a>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex sm:hidden flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink size={16} />
                  <span className="text-[9px] font-semibold uppercase tracking-wide leading-none">Live</span>
                </a>
                {/* Desktop: full text */}
                <a
                  href="/preview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <ExternalLink size={12} /> Preview My Changes
                </a>
              </>
            )}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <ExternalLink size={12} /> View Live Site
            </a>
          </div>
        </header>

        {/* Editor or Dashboard */}
        <main className="flex-1 overflow-y-auto">
          {active ? (
            <div className="p-0 sm:p-4 lg:p-8">
              <div className="bg-white sm:rounded-2xl border-y sm:border border-gray-200 shadow-sm overflow-hidden">
                {ActiveEditor && <ActiveEditor key={active} {...editorProps} />}
              </div>
            </div>
          ) : (
            /* ── Welcome dashboard ─────────────────────────────────────────── */
            <div className="p-5 sm:p-8">
              <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {reviewMode ? 'Welcome to Your Preview' : 'Website Admin'}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {reviewMode
                      ? 'Select a section to edit, then publish to demo when you\'re ready.'
                      : 'Select a section from the sidebar or below to start editing.'}
                  </p>
                </div>

                {/* Review-mode workflow hint */}
                {reviewMode && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['Edit content', 'Save Draft', 'Publish to Demo', 'Preview'].map((step, i, arr) => (
                      <div key={step} className="flex items-center gap-1.5">
                        <span className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                          {i + 1}. {step}
                        </span>
                        {i < arr.length - 1 && <ChevronRight size={11} className="text-gray-300 shrink-0" />}
                      </div>
                    ))}
                  </div>
                )}

                {/* Section cards */}
                <div className="space-y-5">

                  {/* Grouped items (Home, Season) */}
                  {PAGE_TREE.filter(item => item.children).map(item => (
                    <div key={item.id}>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        {getLabel(item.id)}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {item.children.map(child => {
                          const CIcon = child.icon
                          return (
                            <button
                              key={child.id}
                              onClick={() => selectItem(child.id)}
                              className="flex items-center gap-2.5 px-3 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                            >
                              {CIcon && <CIcon size={14} className="text-gray-400 group-hover:text-blue-500 shrink-0" />}
                              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 truncate">
                                {child.label || getLabel(child.id)}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Standalone page items (Rules, Register, etc.) */}
                  {(() => {
                    const standalones = PAGE_TREE.filter(item => !item.children)
                    if (!standalones.length) return null
                    return (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Pages</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {standalones.map(item => {
                            const Icon = item.icon
                            return (
                              <button
                                key={item.id}
                                onClick={() => selectItem(item.id)}
                                className="flex items-center gap-2.5 px-3 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                              >
                                {Icon && <Icon size={14} className="text-gray-400 group-hover:text-blue-500 shrink-0" />}
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 truncate">
                                  {getLabel(item.id)}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })()}

                  {/* Custom pages */}
                  {customPageItems.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Custom Pages</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {customPageItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => selectItem(item.id)}
                            className="flex items-center gap-2.5 px-3 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                          >
                            <FileText size={14} className="text-gray-400 group-hover:text-blue-500 shrink-0" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 truncate">
                              {item.dynamicLabel}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Site tools — admin only */}
                  {!reviewMode && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Site</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SITE_ITEMS.map(item => {
                          const Icon = item.icon
                          return (
                            <button
                              key={item.id}
                              onClick={() => selectItem(item.id)}
                              className="flex items-center gap-2.5 px-3 py-3 bg-white border border-gray-100 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all text-left group"
                            >
                              <Icon size={14} className="text-gray-400 shrink-0" />
                              <span className="text-sm font-medium text-gray-500 truncate">{item.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
