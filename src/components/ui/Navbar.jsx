import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useContent } from '../../hooks/useContent'
import { useContentNamespace } from '../../contexts/ContentNamespaceContext'
import Button from './Button'

// ── Single nav link (handles internal, hash, and external hrefs) ──────────────
function NavLink({ href, children, onClick }) {
  const { pathname } = useLocation()
  const inPreview = pathname.startsWith('/preview')
  const classes = 'text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors'
  const handleClick = () => onClick?.()

  if (href?.startsWith('http')) {
    return <a href={href} className={classes} target="_blank" rel="noopener noreferrer" onClick={handleClick}>{children}</a>
  }

  // Hash links — stay on the current base page (preview or live)
  if (href?.startsWith('#')) {
    const basePath = inPreview ? '/preview' : '/'
    return (
      <Link to={{ pathname: basePath, hash: href }} className={classes} onClick={handleClick}>
        {children}
      </Link>
    )
  }

  // Internal path — in preview mode prefix with /preview so we stay in the review namespace
  const to = inPreview
    ? (href === '/' || !href ? '/preview' : `/preview${href}`)
    : (href || '/')

  return (
    <Link
      to={to}
      className={classes}
      onClick={() => { if (to === '/' || to === '/preview') window.scrollTo({ top: 0, behavior: 'smooth' }); handleClick() }}
    >
      {children}
    </Link>
  )
}

// ── Desktop dropdown for a parent link ───────────────────────────────────────
function DropdownItem({ link }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const labelCls = 'text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1 cursor-pointer'

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const visibleChildren = (link.children || []).filter(c => c.visible !== false)
  if (!visibleChildren.length) return null

  return (
    <div ref={ref} className="relative">
      <button className={labelCls} onClick={() => setOpen(o => !o)}>
        {link.label}
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
          {visibleChildren.map(child => (
            <NavLink key={child.label} href={child.href} onClick={() => setOpen(false)}>
              <span className="block px-4 py-2 hover:bg-gray-50 rounded-lg text-sm">{child.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const { content } = useContent('navigation')
  const namespace = useContentNamespace()
  const isPreview = namespace === 'review' || namespace === 'review_draft'
  const [open,            setOpen]            = useState(false)
  const [mobileDropdowns, setMobileDropdowns] = useState({})
  const [scrolled,        setScrolled]        = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu when navigating
  useEffect(() => { setOpen(false) }, [location.pathname])

  if (!content) return null

  const visibleLinks = (content.links || []).filter(l => l.visible !== false)
  const ctaHref = content.ctaHref
  // In preview mode, rewrite path-based CTA hrefs so they stay within /preview/*
  const resolvedCtaHref = isPreview && ctaHref && !ctaHref.startsWith('http') && !ctaHref.startsWith('#')
    ? `/preview${ctaHref}`
    : ctaHref

  const toggleMobileDropdown = (label) =>
    setMobileDropdowns(prev => ({ ...prev, [label]: !prev[label] }))

  return (
    <nav className={`fixed ${isPreview ? 'top-[44px]' : 'top-0'} left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={isPreview ? '/preview' : '/'} className="font-heading font-bold text-xl text-[var(--color-primary)]"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {content.logo}
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {visibleLinks.map(link =>
              link.children?.length
                ? <DropdownItem key={link.label} link={link} />
                : <NavLink key={link.label} href={link.href}>{link.label}</NavLink>
            )}
            <Button size="sm" href={resolvedCtaHref}>{content.ctaLabel}</Button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-[var(--color-text)]" onClick={() => setOpen(o => !o)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-1">
          {visibleLinks.map(link => {
            if (link.children?.length) {
              const visibleChildren = link.children.filter(c => c.visible !== false)
              const expanded = mobileDropdowns[link.label]
              return (
                <div key={link.label}>
                  <button
                    className="w-full flex items-center justify-between py-2.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                    onClick={() => toggleMobileDropdown(link.label)}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                  </button>
                  {expanded && (
                    <div className="ml-4 border-l border-gray-100 pl-3 pb-1 space-y-0.5">
                      {visibleChildren.map(child => (
                        <NavLink key={child.label} href={child.href} onClick={() => setOpen(false)}>
                          <span className="block py-2 text-sm">{child.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <NavLink key={link.label} href={link.href} onClick={() => setOpen(false)}>
                <span className="block py-2.5">{link.label}</span>
              </NavLink>
            )
          })}
          <div className="pt-2">
            <Button size="sm" className="w-full" href={resolvedCtaHref}>{content.ctaLabel}</Button>
          </div>
        </div>
      )}
    </nav>
  )
}
