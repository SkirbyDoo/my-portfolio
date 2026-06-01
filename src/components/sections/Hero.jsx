import { useContent } from '../../hooks/useContent'
import AetherFlowHero from '../ui/aether-flow-hero'

/**
 * Hero section — renders the AetherFlowHero with editable content from Supabase.
 * Field mapping:
 *   content.headline       → big gradient title
 *   content.subheadline    → description paragraph
 *   content.ctaLabel/Href  → primary white button
 *   content.secondaryLabel/Href → outline secondary button
 *   content.badge          → top pill badge (with Zap icon). Optional.
 */
export default function Hero() {
  const { content } = useContent('hero')

  if (!content || content.visible === false) return null

  return (
    <section id="hero">
      <AetherFlowHero
        badge={content.badge}
        headline={content.headline}
        subheadline={content.subheadline}
        ctaLabel={content.ctaLabel}
        ctaHref={content.ctaHref}
        secondaryLabel={content.secondaryLabel}
        secondaryHref={content.secondaryHref}
      />
    </section>
  )
}
