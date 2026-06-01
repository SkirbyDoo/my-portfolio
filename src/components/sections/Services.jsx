import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useMotionValueEvent, animate } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useContent } from '../../hooks/useContent'
import { BlockRenderer } from '../BlockRenderer'
import {
  Zap, Shield, TrendingUp, Headphones, Smartphone, BarChart,
  Star, Heart, Globe, Code, Layers, Settings, Users, MessageCircle,
  CheckCircle, Award, Briefcase, Clock, DollarSign, Lock,
} from 'lucide-react'

const ICON_MAP = {
  Zap, Shield, TrendingUp, Headphones, Smartphone, BarChart,
  Star, Heart, Globe, Code, Layers, Settings, Users, MessageCircle,
  CheckCircle, Award, Briefcase, Clock, DollarSign, Lock,
}

function DynamicIcon({ name, ...props }) {
  const Icon = ICON_MAP[name] || Star
  return <Icon {...props} />
}

/**
 * Services — Horizontal Drag Carousel.
 * Uses framer-motion's transform-based drag (GPU-accelerated, spring physics
 * on release, velocity-based snap projection). Smoother than scrollLeft.
 */
export default function Services() {
  const { content } = useContent('services')
  const items = content?.items ?? []
  const [activeIdx, setActiveIdx] = useState(0)
  const [stepWidth, setStepWidth] = useState(0)
  const [minX, setMinX] = useState(0)

  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const x = useMotionValue(0)
  const isDraggingRef = useRef(false)

  // ── Measure card step + drag bounds. Re-measures on resize. ────────────────
  const measure = useCallback(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const cards = cardRefs.current.filter(Boolean)
    if (cards.length >= 2) {
      const r1 = cards[0].getBoundingClientRect()
      const r2 = cards[1].getBoundingClientRect()
      setStepWidth(r2.left - r1.left)
    } else if (cards.length === 1) {
      setStepWidth(cards[0].getBoundingClientRect().width)
    }

    const maxDrag = track.scrollWidth - container.clientWidth
    setMinX(maxDrag > 0 ? -maxDrag : 0)
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure, items.length])

  // ── Keep activeIdx in sync with x position (only when NOT dragging by user
  //    via mouse — during drag we still update so dots track in real time). ──
  useMotionValueEvent(x, 'change', (latest) => {
    if (stepWidth === 0) return
    const idx = Math.round(-latest / stepWidth)
    setActiveIdx(Math.max(0, Math.min(items.length - 1, idx)))
  })

  // ── Snap to a card index with spring physics ───────────────────────────────
  const snapTo = (idx) => {
    if (stepWidth === 0) return
    const clamped = Math.max(0, Math.min(items.length - 1, idx))
    const target = Math.max(minX, -clamped * stepWidth)
    animate(x, target, { type: 'spring', stiffness: 220, damping: 30, mass: 0.8 })
  }

  // ── On drag release, project final position from velocity and snap ────────
  const handleDragEnd = (e, info) => {
    isDraggingRef.current = false
    if (stepWidth === 0) return
    // Velocity-projected position (lets you flick to advance multiple cards)
    const projectedX = x.get() + info.velocity.x * 0.25
    const idx = Math.round(-projectedX / stepWidth)
    snapTo(idx)
  }

  // ── Wheel handler for trackpad horizontal scroll ───────────────────────────
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const onWheel = (e) => {
      // Only intercept if the user is scrolling horizontally
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      const newX = x.get() - e.deltaX
      x.set(Math.max(minX, Math.min(0, newX)))
    }
    container.addEventListener('wheel', onWheel, { passive: false })
    return () => container.removeEventListener('wheel', onWheel)
  }, [minX, x])

  if (!content || content.visible === false) return null

  const canScrollLeft = activeIdx > 0
  const canScrollRight = activeIdx < items.length - 1

  return (
    <section id="services" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-site mx-auto relative">
        {/* Section header — centered */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16 px-4 sm:px-6 lg:px-8">
          {content.badge && (
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-[var(--color-text)]/40" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text)]">
                {content.badge}
              </span>
              <div className="w-6 h-px bg-[var(--color-text)]/40" />
            </div>
          )}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-[var(--color-primary)] leading-[1.05]">
            {content.headline}
          </h2>
          {content.subheadline && (
            <p className="mt-6 text-lg text-[var(--color-text-muted)] leading-relaxed">
              {content.subheadline}
            </p>
          )}
        </div>

        {/* Carousel + arrows */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => snapTo(activeIdx - 1)}
            disabled={!canScrollLeft}
            aria-label="Previous service"
            className={`hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-[var(--color-primary)]/10 items-center justify-center transition-all duration-300 ${
              canScrollLeft
                ? 'opacity-100 hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-white hover:scale-110 cursor-pointer'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft size={22} strokeWidth={1.75} />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => snapTo(activeIdx + 1)}
            disabled={!canScrollRight}
            aria-label="Next service"
            className={`hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-[var(--color-primary)]/10 items-center justify-center transition-all duration-300 ${
              canScrollRight
                ? 'opacity-100 hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-white hover:scale-110 cursor-pointer'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronRight size={22} strokeWidth={1.75} />
          </button>

          {/* Outer viewport — clips overflow */}
          <div
            ref={containerRef}
            className="overflow-hidden cursor-grab active:cursor-grabbing px-4 sm:px-6 lg:px-12"
          >
            {/* Inner track — actually dragged via transform (GPU) */}
            <motion.div
              ref={trackRef}
              drag="x"
              dragConstraints={{ left: minX, right: 0 }}
              dragElastic={0.18}
              dragMomentum={false}
              onDragStart={() => { isDraggingRef.current = true }}
              onDragEnd={handleDragEnd}
              style={{ x }}
              className="flex gap-5 lg:gap-6 pb-4 will-change-transform"
            >
              {items.map((item, idx) => (
                <article
                  key={item.id}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  className="group flex-shrink-0 w-[280px] sm:w-[340px] lg:w-[400px] select-none"
                >
                  <div className="h-full rounded-3xl bg-gradient-to-br from-white to-gray-50/60 border border-[var(--color-primary)]/10 p-7 lg:p-9 transition-all duration-500 group-hover:border-[var(--color-accent)]/40 group-hover:shadow-2xl group-hover:shadow-[var(--color-accent)]/10 group-hover:-translate-y-1">
                    {/* Icon */}
                    <div className="relative inline-flex items-center justify-center mb-6">
                      <div className="absolute inset-0 bg-[var(--color-accent)]/20 rounded-full blur-2xl scale-150 group-hover:scale-[1.9] group-hover:bg-[var(--color-accent)]/40 transition-all duration-500" />
                      <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/15 to-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 group-hover:border-[var(--color-accent)]/50 flex items-center justify-center transition-all duration-500 group-hover:rotate-[-6deg]">
                        <DynamicIcon
                          name={item.icon}
                          size={36}
                          strokeWidth={1.5}
                          className="text-[var(--color-accent)] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    {/* Counter */}
                    <div className="text-xs font-mono tabular-nums text-[var(--color-primary)]/35 mb-3">
                      {String(idx + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[var(--color-primary)] mb-3 leading-[1.15] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[var(--color-text-muted)] leading-relaxed text-sm lg:text-base">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Progress dots + hint */}
        <div className="mt-10 lg:mt-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]/70 hidden sm:block">
              <span className="md:hidden">Swipe to explore</span>
              <span className="hidden md:inline">Drag, swipe, or use arrows</span>
            </p>

            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              {items.map((_, i) => {
                const isActive = activeIdx === i
                return (
                  <button
                    key={i}
                    onClick={() => snapTo(i)}
                    aria-label={`Go to service ${i + 1}`}
                    className={`relative rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-8 h-2 bg-[var(--color-accent)]'
                        : 'w-2 h-2 bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/40'
                    }`}
                  />
                )
              })}
            </div>

            <p className="text-xs font-mono tabular-nums text-[var(--color-text-muted)] hidden sm:block">
              {String(activeIdx + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </p>
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
