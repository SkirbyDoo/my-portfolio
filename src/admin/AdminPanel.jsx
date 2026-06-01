// ⚠️  CORE DASHBOARD FILE — do not edit in client project folders.
// Any changes made here WILL BE OVERWRITTEN the next time update-dashboard.js runs.
// To make dashboard improvements:
//   1. Edit this file in: client-website-template/
//   2. Run: node update-dashboard.js /path/to/client-project
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// CORE FILE — do not edit per client.
// Client-specific sections and labels live in src/client/clientConfig.js
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useContent } from '../hooks/useContent'
import {
  Menu, Navigation,
  Settings, LogOut, ExternalLink,
  Pencil, FileText, GripVertical, Plus,
} from 'lucide-react'
import SettingsEditor   from './editors/SettingsEditor'
import PagesEditor      from './editors/PagesEditor'
import CustomPageEditor from './editors/CustomPageEditor'
import { PAGE_TREE, DEFAULT_LABELS as CLIENT_DEFAULT_LABELS } from '../client/clientConfig'

const SITE_ITEMS = [
  { id: 'navigation', label: 'Navigation & Pages', icon: Navigation, component: PagesEditor },
  { id: 'settings',   label: 'Settings',           icon: Settings,   component: SettingsEditor },
]

export default function AdminPanel({ reviewMode = false, onExit }) {
  const { signOut } = useAuth()
  const handleExit = reviewMode ? onExit : signOut
  const { content: savedLabels,  saveContent: saveLabels }   = useContent('page_labels')
  const { content: customPagesData, saveContent: saveCustomPages } = useContent('custom_pages')
  const { content: siteStructure,   saveContent: saveStructure }   = useContent('site_structure')

  const [labels,           setLabels]           = useState(CLIENT_DEFAULT_LABELS)
  const [active,      setActive]      = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingId,        setEditingId]        = useState(null)
  const [editingVal,       setEditingVal]       = useState('')
  const [homeOrder,        setHomeOrder]        = useState(null)
  const [sitePageSections, setSitePageSections] = useState([])
  const [dragItem,         setDragItem]         = useState(null)  // { id, group }
  const [overItem,         setOverItem]         = useState(null)  // { id, group }

  useEffect(() => {
    if (savedLabels) setLabels({ ...CLIENT_DEFAULT_LABELS, ...savedLabels })
  }, [savedLabels])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    const meta = document.querySelector('meta[name="viewport"]')
    if (!meta) return
    const original = meta.getAttribute('content')
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    return () => meta.setAttribute('content', original)
  }, [])

  // ── Site structure (home order + site page sections) ──────────────────────
  const homeChildren     = PAGE_TREE.find(item => item.id === 'home')?.children || []
  const defaultHomeOrder = homeChildren.map(c => c.id)

  useEffect(() => {
    if (siteStructure) {
      setHomeOrder(siteStructure.homeOrder ?? defaultHomeOrder)
      setSitePageSections(siteStructure.sitePageSections ?? [])
    }
  }, [siteStructure])

  const resolvedHomeOrder = homeOrder ?? defaultHomeOrder

  const homeItems       = resolvedHomeOrder
    .map(id => homeChildren.find(c => c.id === id))
    .filter(Boolean)

  const siteBuiltInItems = sitePageSections
    .map(id => homeChildren.find(c => c.id === id))
    .filter(Boolean)

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const saveStructureData = async (newHome, newSite) => {
    setHomeOrder(newHome)
    setSitePageSections(newSite)
    await saveStructure({ homeOrder: newHome, sitePageSections: newSite })
  }

  const handleDragStart = (id, group) => setDragItem({ id, group })
  const handleDragOver  = (e, id, group) => { e.preventDefault(); setOverItem({ id, group }) }
  const handleDragLeave = () => setOverItem(null)

  const handleDrop = (e, targetId, targetGroup) => {
    e.preventDefault()
    if (!dragItem) return
    const { id: dragId, group: fromGroup } = dragItem

    if (dragId === targetId) { setDragItem(null); setOverItem(null); return }

    if (fromGroup === 'home' && targetGroup === 'home') {
      // Reorder within home
      const arr  = [...resolvedHomeOrder]
      const from = arr.indexOf(dragId)
      const to   = arr.indexOf(targetId)
      if (from === -1 || to === -1) return
      arr.splice(from, 1)
      arr.splice(to, 0, dragId)
      saveStructureData(arr, sitePageSections)

    } else if (fromGroup === 'home' && targetGroup === 'site') {
      // Move section to site pages
      const newHome = resolvedHomeOrder.filter(id => id !== dragId)
      const newSite = [...sitePageSections, dragId]
      saveStructureData(newHome, newSite)

    } else if (fromGroup === 'site' && targetGroup === 'home') {
      // Move section back to home (only built-in sections, not custom pages)
      if (!homeChildren.find(c => c.id === dragId)) return
      const newSite = sitePageSections.filter(id => id !== dragId)
      const arr     = [...resolvedHomeOrder]
      const toIdx   = arr.indexOf(targetId)
      if (toIdx === -1) { arr.push(dragId) } else { arr.splice(toIdx, 0, dragId) }
      saveStructureData(arr, newSite)

    } else if (fromGroup === 'site' && targetGroup === 'site') {
      // Reorder site page sections
      if (!homeChildren.find(c => c.id === dragId)) return // skip custom pages reorder for now
      const arr  = [...sitePageSections]
      const from = arr.indexOf(dragId)
      const to   = arr.indexOf(targetId)
      if (from === -1 || to === -1) return
      arr.splice(from, 1)
      arr.splice(to, 0, dragId)
      saveStructureData(resolvedHomeOrder, arr)
    }

    setDragItem(null)
    setOverItem(null)
  }

  // ── Add Page handler ───────────────────────────────────────────────────────
  const handleAddPage = async () => {
    const slug    = `new-page-${Date.now()}`
    const newPage = { slug, title: 'New Page', blocks: [] }
    const newData = { pages: [...(customPagesData?.pages || []), newPage] }
    await saveCustomPages(newData)
    selectItem(`page_${slug}`)
  }

  // ── Dynamic custom-page sidebar items ─────────────────────────────────────
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

  // ── Flat map of all items ──────────────────────────────────────────────────
  const FLAT = useMemo(() => {
    const map = {}
    for (const item of PAGE_TREE) {
      map[item.id] = item
      if (item.children) {
        for (const child of item.children) map[child.id] = { ...child, parentId: item.id }
      }
    }
    for (const item of SITE_ITEMS)      map[item.id] = item
    for (const item of customPageItems) map[item.id] = item
    return map
  }, [customPageItems])

  const getLabel = (id) => {
    const item = FLAT[id]
    return labels[id] ?? CLIENT_DEFAULT_LABELS[id] ?? item?.dynamicLabel ?? id
  }

  // ── Label editing ──────────────────────────────────────────────────────────
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
    const updated = { ...labels, [editingId]: editingVal.trim() || CLIENT_DEFAULT_LABELS[editingId] }
    setLabels(updated)
    await saveLabels(updated)
    setEditingId(null)
  }

  const cancelEdit = () => setEditingId(null)

  // ── Navigation ─────────────────────────────────────────────────────────────
  const selectItem = (id) => { setActive(id); setSidebarOpen(false) }

  const activeItem  = FLAT[active]
  const parentLabel = activeItem?.parentId ? getLabel(activeItem.parentId) : null
  const thisLabel   = activeItem?.label ?? activeItem?.dynamicLabel ?? getLabel(active)
  const breadcrumb  = !active
    ? (reviewMode ? 'Overview' : 'Dashboard')
    : parentLabel ? `${parentLabel}  /  ${thisLabel}` : thisLabel

  const ActiveEditor = activeItem?.component
  const editorProps  = activeItem?.props ?? {}

  // ── Reusable label cell ────────────────────────────────────────────────────
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

  // ── Sidebar item style ────────────────────────────────────────────────────
  const itemCls = (id, extra = '') =>
    `w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left cursor-pointer transition-colors group text-sm
     ${active === id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} ${extra}`

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

        <div className={`px-4 py-4 border-b border-gray-100 shrink-0 ${reviewMode ? 'bg-blue-50' : ''}`}>
          <p className="font-bold text-gray-900 text-sm">{reviewMode ? 'Client Review' : 'Website Admin'}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{reviewMode ? 'Your personal preview' : 'Content Manager'}</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">

          {/* ── HOME PAGE ─────────────────────────────────────────────── */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1.5">Home Page</p>

            {/* Drop zone when dragging from site → home (empty home or between items) */}
            <div
              onDragOver={e => { if (dragItem?.group === 'site') { e.preventDefault(); setOverItem({ id: '__home_end', group: 'home' }) } }}
              onDrop={e => handleDrop(e, '__home_end', 'home')}
            >
              {homeItems.length === 0 && (
                <div className={`text-[11px] text-gray-400 italic px-2 py-2 rounded-lg border border-dashed ${dragItem?.group === 'site' ? 'border-blue-300 bg-blue-50 text-blue-400' : 'border-gray-200'}`}>
                  Drop sections here
                </div>
              )}
              {homeItems.map(item => {
                const Icon      = item.icon
                const isOver    = overItem?.id === item.id && overItem?.group === 'home'
                const isDragging = dragItem?.id === item.id
                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item.id, 'home')}
                    onDragOver={e => handleDragOver(e, item.id, 'home')}
                    onDragLeave={handleDragLeave}
                    onDrop={e => handleDrop(e, item.id, 'home')}
                    onDragEnd={() => { setDragItem(null); setOverItem(null) }}
                    onClick={() => selectItem(item.id)}
                    className={itemCls(item.id, `${isOver ? 'border-t-2 border-blue-400' : ''} ${isDragging ? 'opacity-40' : ''}`)}
                  >
                    <GripVertical size={12} className="text-gray-300 shrink-0 cursor-grab active:cursor-grabbing" />
                    <Icon size={13} className="shrink-0 opacity-70" />
                    <LabelCell id={item.id} staticLabel={item.label} editable={item.editable} />
                    {item.editable && editingId !== item.id && <EditBtn id={item.id} />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── SITE PAGES ────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Site Pages</p>
              <button
                onClick={handleAddPage}
                className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                title="Add new page"
              >
                <Plus size={11} /> Add
              </button>
            </div>

            {/* Drop zone when dragging from home → site */}
            <div
              onDragOver={e => { if (dragItem?.group === 'home') { e.preventDefault(); setOverItem({ id: '__site_end', group: 'site' }) } }}
              onDrop={e => handleDrop(e, '__site_end', 'site')}
            >
              {/* Built-in sections promoted to site pages */}
              {siteBuiltInItems.map(item => {
                const Icon      = item.icon
                const isOver    = overItem?.id === item.id && overItem?.group === 'site'
                const isDragging = dragItem?.id === item.id
                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item.id, 'site')}
                    onDragOver={e => handleDragOver(e, item.id, 'site')}
                    onDragLeave={handleDragLeave}
                    onDrop={e => handleDrop(e, item.id, 'site')}
                    onDragEnd={() => { setDragItem(null); setOverItem(null) }}
                    onClick={() => selectItem(item.id)}
                    className={itemCls(item.id, `${isOver ? 'border-t-2 border-blue-400' : ''} ${isDragging ? 'opacity-40' : ''}`)}
                  >
                    <GripVertical size={12} className="text-gray-300 shrink-0 cursor-grab active:cursor-grabbing" />
                    <Icon size={13} className="shrink-0 opacity-70" />
                    <span className="flex-1 min-w-0 truncate">{item.label}</span>
                    <span className="text-[9px] text-gray-300 font-mono shrink-0">/page/{item.id}</span>
                  </div>
                )
              })}

              {/* Custom (block-based) pages */}
              {customPageItems.map(item => {
                const isOver = overItem?.id === item.id && overItem?.group === 'site'
                return (
                  <div
                    key={item.id}
                    onDragOver={e => handleDragOver(e, item.id, 'site')}
                    onDragLeave={handleDragLeave}
                    onDrop={e => handleDrop(e, item.id, 'site')}
                    onClick={() => selectItem(item.id)}
                    className={itemCls(item.id, `${isOver ? 'border-t-2 border-blue-400' : ''}`)}
                  >
                    <FileText size={13} className="shrink-0 opacity-60" />
                    <span className="flex-1 min-w-0 truncate">{item.dynamicLabel}</span>
                  </div>
                )
              })}

              {siteBuiltInItems.length === 0 && customPageItems.length === 0 && (
                <div className={`text-[11px] text-gray-400 italic px-2 py-2 rounded-lg border border-dashed ${dragItem?.group === 'home' ? 'border-blue-300 bg-blue-50 text-blue-400' : 'border-gray-200'}`}>
                  No site pages yet
                </div>
              )}
            </div>
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
              <a href="/preview" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-blue-600 font-medium hover:bg-blue-50 transition-colors">
                <ExternalLink size={13} /> Preview My Changes
              </a>
              <a href="/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <ExternalLink size={13} /> View Live Site
              </a>
            </>
          ) : (
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <ExternalLink size={13} /> View Live Site
            </a>
          )}
          <button onClick={handleExit}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
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
                <a href="/preview" target="_blank" rel="noopener noreferrer"
                  className="flex sm:hidden flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                  <ExternalLink size={16} />
                  <span className="text-[9px] font-semibold uppercase tracking-wide leading-none">Demo</span>
                </a>
                <a href="/" target="_blank" rel="noopener noreferrer"
                  className="flex sm:hidden flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                  <ExternalLink size={16} />
                  <span className="text-[9px] font-semibold uppercase tracking-wide leading-none">Live</span>
                </a>
                <a href="/preview" target="_blank" rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                  <ExternalLink size={12} /> Preview My Changes
                </a>
              </>
            )}
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">
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
            <div className="p-5 sm:p-8">
              <div className="max-w-2xl mx-auto space-y-6">

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

                <div className="space-y-5">

                  {/* Grouped items */}
                  {PAGE_TREE.filter(item => item.children).map(item => (
                    <div key={item.id}>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        {getLabel(item.id)}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {item.children.map(child => {
                          const CIcon = child.icon
                          return (
                            <button key={child.id} onClick={() => selectItem(child.id)}
                              className="flex items-center gap-2.5 px-3 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left group">
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

                  {/* Standalone pages */}
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
                              <button key={item.id} onClick={() => selectItem(item.id)}
                                className="flex items-center gap-2.5 px-3 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left group">
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
                          <button key={item.id} onClick={() => selectItem(item.id)}
                            className="flex items-center gap-2.5 px-3 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left group">
                            <FileText size={14} className="text-gray-400 group-hover:text-blue-500 shrink-0" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 truncate">
                              {item.dynamicLabel}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Site tools */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Site</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {SITE_ITEMS.map(item => {
                        const Icon = item.icon
                        return (
                          <button key={item.id} onClick={() => selectItem(item.id)}
                            className="flex items-center gap-2.5 px-3 py-3 bg-white border border-gray-100 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all text-left group">
                            <Icon size={14} className="text-gray-400 shrink-0" />
                            <span className="text-sm font-medium text-gray-500 truncate">{item.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
