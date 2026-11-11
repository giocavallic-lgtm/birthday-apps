import { useEffect, useMemo, useRef } from 'react'
import { Heart } from 'lucide-react'

const FLOATING_HEARTS = [
  { left: '8%', size: 22, duration: 15, delay: 0 },
  { left: '22%', size: 14, duration: 19, delay: 3 },
  { left: '45%', size: 28, duration: 17, delay: 6 },
  { left: '63%', size: 16, duration: 21, delay: 1 },
  { left: '78%', size: 20, duration: 16, delay: 8 },
  { left: '92%', size: 13, duration: 20, delay: 4 },
]

function makeStars(n: number) {
  return Array.from({ length: n }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 1.5 + Math.random() * 1.8,
    dur: 2 + Math.random() * 3,
    delay: Math.random() * 4,
  }))
}

export default function Backdrop() {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const stars = useMemo(() => makeStars(30), [])

  // parallax suave de los blobs según el cursor
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = parallaxRef.current
      if (!el) return
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      el.style.setProperty('--mx', String(x))
      el.style.setProperty('--my', String(y))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* estrellas titilantes */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="twinkle absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* estrellas fugaces */}
      <span className="shooting-star absolute top-[14%] right-[8%] w-24 h-[2px] rounded-full bg-gradient-to-l from-white/90 via-white/40 to-transparent" />
      <span
        className="shooting-star absolute top-[36%] right-[52%] w-32 h-[2px] rounded-full bg-gradient-to-l from-white/80 via-white/30 to-transparent"
        style={{ animationDuration: '13s', animationDelay: '6s' }}
      />

      {/* blobs con parallax */}
      <div ref={parallaxRef} className="parallax absolute inset-0">
        <div className="animate-float absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-pink-500/15 blur-3xl" />
        <div className="animate-float-2 absolute bottom-1/4 right-[12%] w-56 h-56 rounded-full bg-purple-500/15 blur-3xl" />
        <div
          className="animate-float absolute top-1/3 left-[10%] w-44 h-44 rounded-full bg-blue-500/10 blur-3xl"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* corazones ascendiendo */}
      {FLOATING_HEARTS.map((h, i) => (
        <Heart
          key={i}
          className="heart-float absolute text-pink-400/25"
          style={{
            left: h.left,
            bottom: '-40px',
            width: h.size,
            height: h.size,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
          fill="currentColor"
        />
      ))}
    </div>
  )
}
