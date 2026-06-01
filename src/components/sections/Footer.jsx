import { useLocation } from 'react-router-dom'
import { useContent } from '../../hooks/useContent'
import { Twitter, Linkedin, Instagram, Facebook, Youtube } from 'lucide-react'

const SOCIAL_ICONS = { Twitter, LinkedIn: Linkedin, Instagram, Facebook, Youtube }

export default function Footer() {
  const { content } = useContent('footer')
  const { pathname } = useLocation()
  const inPreview = pathname.startsWith('/preview')

  // Rewrite internal hrefs to stay in /preview/* when viewing the demo site
  const resolveHref = (href) => {
    if (!inPreview || !href || href.startsWith('http') || href.startsWith('#')) return href
    if (href === '/') return '/preview'
    return `/preview${href}`
  }

  if (!content) return null

  return (
    <footer className="bg-gray-950 text-white py-16">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <p className="font-heading font-bold text-2xl mb-3">{content.logo}</p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{content.tagline}</p>
            {content.socialLinks?.length > 0 && (
              <div className="flex gap-4 mt-6">
                {content.socialLinks.map(social => {
                  const Icon = SOCIAL_ICONS[social.platform] || Twitter
                  return (
                    <a
                      key={social.platform}
                      href={social.href}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-accent)] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.platform}
                    >
                      <Icon size={14} />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Link columns */}
          {content.columns?.map((col) => (
            <div key={col.heading}>
              <p className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link.label}>
                    <a href={resolveHref(link.href)} className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
          {content.copyright}
        </div>
      </div>
    </footer>
  )
}
