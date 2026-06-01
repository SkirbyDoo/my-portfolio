import { useContent } from '../../hooks/useContent'
import { BlockRenderer } from '../BlockRenderer'

export default function About() {
  const { content } = useContent('about')

  if (!content || content.visible === false) return null

  return (
    <section id="about" className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image */}
          <div className="order-2 lg:order-1">
            {content.image ? (
              <img
                src={content.image}
                alt="About us"
                className="w-full h-80 lg:h-[480px] object-cover rounded-2xl shadow-xl"
                onError={(e) => { e.target.src = 'https://placehold.co/600x480?text=About+Us' }}
              />
            ) : (
              <div className="w-full h-80 lg:h-[480px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center text-gray-400 text-lg">
                Add your image in admin panel
              </div>
            )}
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            {content.badge && (
              <span className="inline-block text-sm font-semibold text-[var(--color-accent)] uppercase tracking-widest mb-4">
                {content.badge}
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-[var(--color-primary)] mb-6 leading-[1.05]">
              {content.headline}
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg leading-relaxed mb-10">
              {content.body}
            </p>

            {content.stats?.length > 0 && (
              <div className="grid grid-cols-3 gap-6">
                {content.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-3xl font-bold text-[var(--color-accent)]">{stat.value}</p>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
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
