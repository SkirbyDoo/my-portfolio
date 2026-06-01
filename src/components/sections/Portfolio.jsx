import { useContent } from '../../hooks/useContent'
import { BlockRenderer } from '../BlockRenderer'
import { ArrowUpRight, Image as ImageIcon } from 'lucide-react'

export default function Portfolio() {
  const { content } = useContent('portfolio')

  if (!content || content.visible === false) return null

  return (
    <section id="portfolio" className="py-20 lg:py-32 bg-white">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          {content.badge && (
            <span className="inline-block text-sm font-semibold text-[var(--color-accent)] uppercase tracking-widest mb-4">
              {content.badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-[var(--color-primary)] mb-4 leading-[1.05]">
            {content.headline}
          </h2>
          {content.subheadline && (
            <p className="text-[var(--color-text-muted)] text-lg">{content.subheadline}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.items?.map((item) => {
            const CardWrapper = item.link ? 'a' : 'div'
            const wrapperProps = item.link
              ? { href: item.link, target: item.link.startsWith('http') ? '_blank' : undefined, rel: 'noopener noreferrer' }
              : {}

            return (
              <CardWrapper
                key={item.id}
                {...wrapperProps}
                className="group block rounded-2xl overflow-hidden border border-gray-100 bg-white hover:border-[var(--color-accent)] hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <ImageIcon size={48} className="text-gray-400" />
                    </div>
                  )}
                  {item.link && (
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight size={18} className="text-[var(--color-primary)]" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {item.category && (
                    <span className="inline-block text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-2">
                      {item.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{item.description}</p>
                  )}
                </div>
              </CardWrapper>
            )
          })}
        </div>
      </div>

      {/* Additional content blocks from dashboard */}
      {content.blocks?.length > 0 && (
        <div className="mt-8">
          <BlockRenderer blocks={content.blocks} />
        </div>
      )}
    </section>
  )
}
