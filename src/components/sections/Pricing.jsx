import { useContent } from '../../hooks/useContent'
import { BlockRenderer } from '../BlockRenderer'
import { Check } from 'lucide-react'

export default function Pricing() {
  const { content } = useContent('pricing')

  if (!content || content.visible === false) return null

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-gray-50">
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

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {content.tiers?.map((tier) => (
            <div
              key={tier.id}
              className={`relative flex flex-col p-8 rounded-2xl bg-white border transition-all duration-300 ${
                tier.popular
                  ? 'border-[var(--color-accent)] shadow-xl scale-[1.02] md:scale-105'
                  : 'border-gray-200 hover:border-[var(--color-accent)] hover:shadow-lg'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-bold text-[var(--color-primary)]">{tier.price}</span>
                  {tier.billing && (
                    <span className="text-sm text-[var(--color-text-muted)]">{tier.billing}</span>
                  )}
                </div>
                {tier.description && (
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{tier.description}</p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <Check
                      size={18}
                      className="text-[var(--color-accent)] flex-shrink-0 mt-0.5"
                    />
                    <span className="text-[var(--color-text)]">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={tier.ctaHref || '#contact'}
                className={`block text-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  tier.popular
                    ? 'bg-[var(--color-accent)] text-white hover:opacity-90'
                    : 'bg-gray-100 text-[var(--color-primary)] hover:bg-gray-200'
                }`}
              >
                {tier.ctaLabel || 'Get Started'}
              </a>
            </div>
          ))}
        </div>

        {content.hostingPlan?.enabled && (
          <div className="max-w-6xl mx-auto mt-10">
            <div className={`relative flex flex-col md:flex-row md:items-center gap-8 p-8 rounded-2xl bg-white ${
              content.hostingPlan.badge ? 'border-2 border-[var(--color-accent)] shadow-lg' : 'border border-gray-200'
            }`}>
              {content.hostingPlan.badge && (
                <span className="absolute -top-3 left-8 bg-[var(--color-accent)] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                  {content.hostingPlan.badge}
                </span>
              )}
              <div className="md:w-1/3">
                <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">{content.hostingPlan.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-bold text-[var(--color-primary)]">{content.hostingPlan.price}</span>
                  {content.hostingPlan.billing && (
                    <span className="text-sm text-[var(--color-text-muted)]">{content.hostingPlan.billing}</span>
                  )}
                </div>
                {content.hostingPlan.description && (
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{content.hostingPlan.description}</p>
                )}
              </div>

              <ul className="flex-1 grid sm:grid-cols-2 gap-3">
                {content.hostingPlan.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <Check size={18} className="text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-text)]">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={content.hostingPlan.ctaHref || '#contact'}
                className="block text-center px-6 py-3 rounded-lg font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition-all duration-300 md:self-center shrink-0"
              >
                {content.hostingPlan.ctaLabel || 'Get Started'}
              </a>
            </div>
          </div>
        )}

        {content.footnote && (
          <p className="max-w-2xl mx-auto mt-10 text-center text-sm text-[var(--color-text-muted)]">
            {content.footnote}
          </p>
        )}
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
