// CircularTestimonials — a 3-up circular image carousel (center + left/right peek).
// Ported from a shadcn/TSX snippet to this stack:
//   • JSX, not TSX
//   • lucide-react icons instead of react-icons
//   • a real CSS file (circular-testimonials.css) instead of styled-jsx
//
// Repurposed here as an image showcase: caption text (name/designation/quote) is
// OPTIONAL, so it can render image-only. Missing images degrade to a labeled
// placeholder instead of a broken <img>. Used on the case-study pages to show a
// few screenshots of a finished website.
//
// CLIENT-SPECIFIC UI (lives under src/components/ui/, alongside Navbar) — safe to
// edit here; not a core dashboard file.
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './circular-testimonials.css'

function calculateGap(width) {
  const minWidth = 1024
  const maxWidth = 1456
  const minGap = 60
  const maxGap = 86
  if (width <= minWidth) return minGap
  if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth))
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth))
}

export function CircularTestimonials({
  items = [],
  autoplay = true,
  colors = {},
  fontSizes = {},
}) {
  // Color & font config (with sensible light-theme defaults)
  const colorName = colors.name ?? '#0a0a0a'
  const colorDesignation = colors.designation ?? '#6b7280'
  const colorTestimony = colors.testimony ?? '#4b5563'
  const colorArrowBg = colors.arrowBackground ?? '#141414'
  const colorArrowFg = colors.arrowForeground ?? '#f1f1f7'
  const colorArrowHoverBg = colors.arrowHoverBackground ?? '#00a6fb'
  const fontSizeName = fontSizes.name ?? '1.75rem'
  const fontSizeDesignation = fontSizes.designation ?? '0.95rem'
  const fontSizeQuote = fontSizes.quote ?? '1.05rem'

  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverPrev, setHoverPrev] = useState(false)
  const [hoverNext, setHoverNext] = useState(false)
  const [containerWidth, setContainerWidth] = useState(1200)
  const [errored, setErrored] = useState({})

  const imageContainerRef = useRef(null)
  const autoplayIntervalRef = useRef(null)

  const itemsLength = useMemo(() => items.length, [items])
  const activeItem = useMemo(() => items[activeIndex], [activeIndex, items])

  // Responsive gap calculation
  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Autoplay
  useEffect(() => {
    if (autoplay && itemsLength > 1) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % itemsLength)
      }, 5000)
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
    }
  }, [autoplay, itemsLength])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % itemsLength)
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
  }, [itemsLength])
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + itemsLength) % itemsLength)
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
  }, [itemsLength])

  // Compute transforms for each image (show 3: left, center, right)
  function getImageStyle(index) {
    const gap = calculateGap(containerWidth)
    const maxStickUp = gap * 0.8
    const isActive = index === activeIndex
    const isLeft = (activeIndex - 1 + itemsLength) % itemsLength === index
    const isRight = (activeIndex + 1) % itemsLength === index
    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: 'auto',
        transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)',
        transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
      }
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: 'auto',
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
      }
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: 'auto',
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
      }
    }
    // Hide all other images
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: 'none',
      transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
    }
  }

  const quoteVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  if (!itemsLength) return null

  const hasCaption = !!(activeItem?.name || activeItem?.designation || activeItem?.quote)

  return (
    <div className="ct-container">
      <div className="ct-grid">
        {/* Images */}
        <div className="ct-images" ref={imageContainerRef}>
          {items.map((item, index) =>
            errored[item.src] ? (
              <div key={item.src} className="ct-placeholder" style={getImageStyle(index)}>
                <ImageOff size={28} />
                <span className="ct-placeholder-label">{item.name || 'Add image'}</span>
                <span className="ct-placeholder-src">{item.src}</span>
              </div>
            ) : (
              <img
                key={item.src}
                src={item.src}
                alt={item.alt || item.name || ''}
                className="ct-image"
                data-index={index}
                style={getImageStyle(index)}
                onError={() => setErrored((prev) => ({ ...prev, [item.src]: true }))}
              />
            )
          )}
        </div>

        {/* Content */}
        <div className="ct-content">
          {hasCaption && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={quoteVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {activeItem?.name && (
                  <h3 className="ct-name" style={{ color: colorName, fontSize: fontSizeName }}>
                    {activeItem.name}
                  </h3>
                )}
                {activeItem?.designation && (
                  <p
                    className="ct-designation"
                    style={{ color: colorDesignation, fontSize: fontSizeDesignation }}
                  >
                    {activeItem.designation}
                  </p>
                )}
                {activeItem?.quote && (
                  <motion.p
                    className="ct-quote"
                    style={{ color: colorTestimony, fontSize: fontSizeQuote }}
                  >
                    {activeItem.quote.split(' ').map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ filter: 'blur(10px)', opacity: 0, y: 5 }}
                        animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut', delay: 0.025 * i }}
                        style={{ display: 'inline-block' }}
                      >
                        {word}&nbsp;
                      </motion.span>
                    ))}
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          <div className="ct-arrows">
            <button
              className="ct-arrow ct-prev"
              onClick={handlePrev}
              style={{ backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg }}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} color={colorArrowFg} />
            </button>
            <button
              className="ct-arrow ct-next"
              onClick={handleNext}
              style={{ backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg }}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Next image"
            >
              <ChevronRight size={24} color={colorArrowFg} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircularTestimonials
