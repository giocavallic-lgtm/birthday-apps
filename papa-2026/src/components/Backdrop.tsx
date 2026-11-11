import { useEffect, useMemo, useRef } from 'react'

const FLOATING_BALLS = [
  { left: '8%', size: 20, duration: 15, delay: 0 },
  { left: '22%', size: 15, duration: 19, delay: 3 },
  { left: '45%', size: 26, duration: 17, delay: 6 },
  { left: '63%', size: 17, duration: 21, delay: 1 },
  { left: '78%', size: 22, duration: 16, delay: 8 },
  { left: '92%', size: 14, duration: 20, delay: 4 },
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

/** Reflector de estadio: haz de luz que baja en diagonal. */
function Beam({ className, rot }: { className: string; rot: number }) {
  return (
    <div
      className={`absolute -top-24 h-[130vh] w-28 sm:w-36 origin-top blur-[5px] bg-gradient-to-b from-sky-100/10 via-sky-100/5 to-transparent ${className}`}
      style={{ transform: `rotate(${rot}deg)` }}
    />
  )
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

      {/* reflectores del estadio */}
      <Beam className="left-[6%]" rot={16} />
      <Beam className="left-[15%]" rot={27} />
      <Beam className="right-[6%]" rot={-16} />
      <Beam className="right-[15%]" rot={-27} />
      {/* focos */}
      <div className="absolute top-1 left-[9%] w-10 h-3 rounded-full bg-sky-100/25 blur-[3px]" />
      <div className="absolute top-1 right-[9%] w-10 h-3 rounded-full bg-sky-100/25 blur-[3px]" />

      {/* blobs con parallax */}
      <div ref={parallaxRef} className="parallax absolute inset-0">
        <div className="animate-float absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="animate-float-2 absolute bottom-1/4 right-[12%] w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl" />
        <div
          className="animate-float absolute top-1/3 left-[10%] w-44 h-44 rounded-full bg-blue-500/10 blur-3xl"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* pelotitas ascendiendo despacito */}
      {FLOATING_BALLS.map((b, i) => (
        <span
          key={i}
          className="heart-float absolute select-none"
          style={{
            left: b.left,
            bottom: '-40px',
            fontSize: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            filter: 'drop-shadow(0 0 8px rgba(125,211,252,0.35))',
          }}
        >
          ⚽
        </span>
      ))}

      {/* mitad de la cancha */}
      <div className="absolute bottom-0 inset-x-0 h-[24vh] bg-gradient-to-t from-emerald-950/80 via-emerald-900/25 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[22vh] w-px bg-white/10" />
      <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-white/10" />
      <div className="absolute bottom-[calc(4%+2.2rem)] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/20" />
    </div>
  )
}
