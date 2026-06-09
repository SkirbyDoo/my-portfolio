// ClaritySlider — interactive drag-to-clean before/after slider.
// Ported from the All Pro Window Cleaning redesign so prospects can play with the
// real feature on the Redesigns page. Takes ONE image and fakes "grimy/blurred →
// spotless" with CSS filters; drag the handle (pointer or touch) to wipe between.
import { useState, useRef, useEffect } from 'react'
import { MoveHorizontal } from 'lucide-react'

// Fallback "view" — a crisp skyline seen through a clean pane.
const DEFAULT_VIEW = 'https://images.unsplash.com/photo-1635782609365-eb5ee6514d02?auto=format&fit=crop&w=1300&q=80'

export default function ClaritySlider({ image, caption = 'Drag to see the difference →' }) {
  const ref = useRef(null)
  const [pos, setPos] = useState(56)
  const [dragging, setDragging] = useState(false)
  const [broken, setBroken] = useState(false)
  const src = image || DEFAULT_VIEW

  const update = (clientX) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos(Math.max(3, Math.min(97, ((clientX - r.left) / r.width) * 100)))
  }

  useEffect(() => {
    if (!dragging) return
    const move = (e) => update(e.touches ? e.touches[0].clientX : e.clientX)
    const up = () => setDragging(false)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('touchmove', move, { passive: true })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', up)
    }
  }, [dragging])

  return (
    <div>
      <div
        ref={ref}
        onPointerDown={(e) => { setDragging(true); update(e.clientX) }}
        className="relative aspect-[16/10] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl ring-1 ring-inset ring-black/10 shadow-sm"
      >
        {/* AFTER — spotless (slight clarity boost so the clean reveal pops) */}
        {!broken
          ? <img src={src} alt="A crystal-clear view" draggable={false} onError={() => setBroken(true)} className="absolute inset-0 h-full w-full object-cover" style={{ filter: 'saturate(1.08) contrast(1.05) brightness(1.08)' }} />
          : <div className="absolute inset-0 bg-gradient-to-br from-[#bcd3ee] via-[#dbe7f4] to-[#eef3f8]" />}

        {/* BEFORE — grimy + blurred, clipped to the left of the handle */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          {!broken
            ? <img src={src} alt="A dirty window" draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ filter: 'blur(3px) saturate(0.6) contrast(0.92) brightness(1.06)' }} />
            : <div className="absolute inset-0 bg-gradient-to-br from-[#9aa39a] to-[#cdd2c8]" />}
          <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(102deg, rgba(255,255,255,0.05) 0 7px, rgba(110,118,104,0.12) 7px 15px)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 80% at 30% 20%, rgba(94,86,52,0.18), transparent 60%)' }} />
          <span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-sm">Before</span>
        </div>

        <span className="absolute right-4 top-4 rounded-full bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--color-primary)] backdrop-blur-sm">After</span>

        {/* window mullions to read the frame as a real pane */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/30" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/30" />
        </div>

        {/* handle */}
        <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
          <div className="absolute inset-y-0 -translate-x-1/2 w-[3px] bg-white/90 shadow-[0_0_18px_rgba(255,255,255,0.6)]" />
          <div className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 backdrop-blur text-[var(--color-primary)] shadow-lg ring-1 ring-black/5">
            <MoveHorizontal size={20} />
          </div>
        </div>
      </div>
      {caption && (
        <p className="mt-3 text-center text-sm text-[var(--color-text-muted)]">{caption}</p>
      )}
    </div>
  )
}
