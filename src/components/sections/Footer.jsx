import { useLocation } from 'react-router-dom'
import { useContent, useSettings } from '../../hooks/useContent'
import { Twitter, Linkedin, Instagram, Facebook, Youtube, Github, Phone, MapPin } from 'lucide-react'

// Identity (name, contact, socials) comes from Settings / Business Info — entered
// once. Each entry maps a settings key → its icon. The legacy footer.socialLinks
// list is only used as a fallback when no settings socials are set.
const SETTINGS_SOCIALS = [
  { key: 'social_x',         Icon: Twitter,   label: 'X' },
  { key: 'social_instagram', Icon: Instagram, label: 'Instagram' },
  { key: 'social_linkedin',  Icon: Linkedin,  label: 'LinkedIn' },
  { key: 'social_facebook',  Icon: Facebook,  label: 'Facebook' },
  { key: 'social_youtube',   Icon: Youtube,   label: 'YouTube' },
  { key: 'social_github',    Icon: Github,    label: 'GitHub' },
]
const LEGACY_ICONS = { Twitter, LinkedIn: Linkedin, Instagram, Facebook, Youtube }

// TEMP: also strip social links out of the footer link columns (per request).
// Delete this helper + its uses below to restore them.
const SOCIAL_RE = /facebook|instagram|twitter|linkedin|youtube|tiktok|github|threads|t\.me|x\.com/i
const isSocialLink = (l) => SOCIAL_RE.test(`${l?.label || ''} ${l?.href || ''}`)

export default function Footer() {
  const { content } = useContent('footer')
  const { settings } = useSettings()
  const { pathname } = useLocation()
  const inPreview = pathname.startsWith('/preview')
  const homeBase = inPreview ? '/preview' : '/'
  const onHome = pathname === homeBase

  // Resolve a footer link so it works from ANY page:
  //  - hash links (e.g. "#about") scroll in-page on the home page, but on other
  //    pages route to the home section ("/#about") instead of being a dead click.
  //  - internal paths stay within /preview/* when viewing the demo site.
  const resolveHref = (href) => {
    if (!href || href.startsWith('http') || href.startsWith('mailto')) return href
    if (href.startsWith('#')) return onHome ? href : `${homeBase}${href}`
    if (inPreview && !href.startsWith('/preview')) return href === '/' ? '/preview' : `/preview${href}`
    return href
  }

  if (!content) return null

  // Identity comes from Settings / Business Info (entered once), with the footer
  // content section as a fallback for older data.
  const brand   = settings.site_name || content.logo
  const phone   = settings.site_phone
  const address = settings.site_address
  let socials = SETTINGS_SOCIALS
    .filter(s => settings[s.key])
    .map(s => ({ ...s, href: settings[s.key] }))
  if (socials.length === 0 && content.socialLinks?.length) {
    socials = content.socialLinks.map(s => ({
      key: s.platform, Icon: LEGACY_ICONS[s.platform] || Twitter, label: s.platform, href: s.href,
    }))
  }

  // TEMP: social links hidden for now (per request). Delete this line to restore them.
  socials = []

  return (
    <footer className="bg-gray-950 text-white py-16">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <p className="font-heading font-bold text-2xl mb-3">{brand}</p>
            {content.tagline && (
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{content.tagline}</p>
            )}
            {(phone || address) && (
              <div className="mt-5 space-y-2 text-sm text-gray-400 max-w-xs">
                {phone && (
                  <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-2 hover:text-white transition-colors">
                    <Phone size={14} className="shrink-0" /> {phone}
                  </a>
                )}
                {address && (
                  <p className="flex items-start gap-2">
                    <MapPin size={14} className="shrink-0 mt-0.5" /> {address}
                  </p>
                )}
              </div>
            )}
            {socials.length > 0 && (
              <div className="flex gap-4 mt-6">
                {socials.map(({ key, Icon, label, href }) => (
                  <a
                    key={key}
                    href={href}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-accent)] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {content.columns?.map((col) => {
            // TEMP: hide social links (and any column left empty by removing them).
            const links = (col.links || []).filter(link => !isSocialLink(link))
            if (links.length === 0) return null
            return (
              <div key={col.heading}>
                <p className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">{col.heading}</p>
                <ul className="space-y-2">
                  {links.map(link => (
                    <li key={link.label}>
                      <a href={resolveHref(link.href)} className="text-gray-400 hover:text-white text-sm transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
          {content.copyright}
        </div>
      </div>
    </footer>
  )
}
