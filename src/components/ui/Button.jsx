import { useLocation, Link } from 'react-router-dom'

export default function Button({ children, variant = 'primary', size = 'md', className = '', href, ...props }) {
  const { pathname } = useLocation()
  const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-[var(--border-radius)] focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'bg-[var(--color-accent)] text-white hover:opacity-90 focus:ring-[var(--color-accent)]',
    secondary: 'bg-transparent border-2 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white focus:ring-[var(--color-accent)]',
    ghost: 'bg-transparent text-[var(--color-text)] hover:bg-gray-100 focus:ring-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    const inPreview = pathname.startsWith('/preview')
    const isExternal = href.startsWith('http') || href.startsWith('mailto')
    const isHash = href.startsWith('#')

    if (isExternal) {
      return <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
    }

    // Resolve the destination: in preview mode, internal paths stay within /preview/*
    // Guard against double-prefixing if the href was already rewritten upstream
    const to = inPreview && !isHash && !href.startsWith('/preview')
      ? (href === '/' ? '/preview' : `/preview${href}`)
      : href

    if (isHash) {
      // Hash links use <a> so they scroll without a route change
      return <a href={href} className={classes} {...props}>{children}</a>
    }

    return <Link to={to} className={classes} {...props}>{children}</Link>
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
