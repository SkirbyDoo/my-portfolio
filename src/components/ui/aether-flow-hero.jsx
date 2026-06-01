import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'

/**
 * Aether Flow Hero — animated particle canvas hero.
 * Source: https://21st.dev/community/components/dhiluxui/aether-flow-hero
 * Modified to accept props so it can be driven by the Supabase-backed
 * Hero content (headline, subheadline, badge, ctaLabel/Href, secondary CTA).
 */
const AetherFlowHero = ({
  badge,
  headline = 'Aether Flow',
  subheadline,
  ctaLabel,
  ctaHref = '#',
  secondaryLabel,
  secondaryHref,
}) => {
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []
    let width = 0
    let height = 0
    let connectRadius = 120
    const mouse = { x: null, y: null, radius: 200 }

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x
        this.y = y
        this.directionX = directionX
        this.directionY = directionY
        this.size = size
        this.color = color
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
      }

      update() {
        if (this.x > width || this.x < 0) this.directionX = -this.directionX
        if (this.y > height || this.y < 0) this.directionY = -this.directionY

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < mouse.radius + this.size) {
            const forceDirectionX = dx / distance
            const forceDirectionY = dy / distance
            const force = (mouse.radius - distance) / mouse.radius
            this.x -= forceDirectionX * force * 5
            this.y -= forceDirectionY * force * 5
          }
        }

        this.x += this.directionX
        this.y += this.directionY
        this.draw()
      }
    }

    function init() {
      particles = []
      const density = width < 768 ? 18000 : 9000
      const numberOfParticles = Math.min((width * height) / density, 140)
      for (let i = 0; i < numberOfParticles; i++) {
        const size = (Math.random() * 2) + 1
        const x = (Math.random() * ((width - size * 2) - (size * 2)) + size * 2)
        const y = (Math.random() * ((height - size * 2) - (size * 2)) + size * 2)
        const directionX = (Math.random() * 0.4) - 0.2
        const directionY = (Math.random() * 0.4) - 0.2
        const color = 'rgba(191, 128, 255, 0.8)'
        particles.push(new Particle(x, y, directionX, directionY, size, color))
      }
    }

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      connectRadius = Math.min(width, height) < 768 ? 90 : 140
      init()
    }
    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    const connect = () => {
      let opacityValue = 1
      const maxDistance = connectRadius * connectRadius
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
            + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y))

          if (distance < maxDistance) {
            opacityValue = 1 - (distance / maxDistance)

            const dx_mouse_a = particles[a].x - mouse.x
            const dy_mouse_a = particles[a].y - mouse.y
            const distance_mouse_a = Math.sqrt(dx_mouse_a * dx_mouse_a + dy_mouse_a * dy_mouse_a)

            if (mouse.x && distance_mouse_a < mouse.radius) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`
            } else {
              ctx.strokeStyle = `rgba(200, 150, 255, ${opacityValue})`
            }

            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
      }
      connect()
    }

    const handleMouseMove = (event) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
    }

    const handleMouseOut = () => {
      mouse.x = null
      mouse.y = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseout', handleMouseOut)

    init()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseout', handleMouseOut)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 + 0.5, duration: 0.8, ease: 'easeInOut' },
    }),
  }

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>

      <div className="relative z-10 text-center p-6">
        {badge && (
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-sm"
          >
            <Zap className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-200">{badge}</span>
          </motion.div>
        )}

        <motion.h1
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
        >
          {headline}
        </motion.h1>

        {subheadline && (
          <motion.p
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto text-lg text-gray-400 mb-10"
          >
            {subheadline}
          </motion.p>
        )}

        <motion.div
          custom={3}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {ctaLabel && (
            <a
              href={ctaHref || '#'}
              className="px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2"
            >
              {ctaLabel}
              <ArrowRight className="h-5 w-5" />
            </a>
          )}

          {secondaryLabel && (
            <a
              href={secondaryHref || '#'}
              className="px-8 py-4 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-300"
            >
              {secondaryLabel}
            </a>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AetherFlowHero
