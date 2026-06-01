import { useContent } from '../../hooks/useContent'
import { BlockRenderer } from '../BlockRenderer'
import { Quote } from 'lucide-react'

export default function Testimonials() {
  const { content } = useContent('testimonials')

  if (!content || content.visible === false) return null

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-white">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          {content.badge && (
            <span className="inline-block text-sm font-semibold text-[var(--color-accent)] uppercase tracking-widest mb-4">
              {content.badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-[var(--color-primary)] leading-[1.05]">
            {content.headline}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.items?.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-2xl p-8 relative hover:shadow-md transition-shadow duration-300"
            >
              <Quote size={32} className="text-[var(--color-accent)] opacity-30 mb-4" />
              <p className="text-[var(--color-text)] text-lg leading-relaxed mb-6 italic">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => { e.target.src = `https://placehold.co/40x40?text=${item.name.charAt(0)}` }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-bold text-sm">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[var(--color-primary)] text-sm">{item.name}</p>
                  <p className="text-[var(--color-text-muted)] text-xs">{item.company}</p>
                </div>
              </div>
            </div>
          ))}
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
