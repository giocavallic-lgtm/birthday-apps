import { useMemo } from 'react'

interface Ribbon {
  left: number
  size: number
  fallDur: number
  swayDur: number
  rot: number
  tone: string
}

const TONES = [
  'from-sky-300/60 to-sky-500/50',
  'from-white/70 to-sky-200/50',
  'from-amber-200/60 to-amber-300/45',
  'from-sky-200/50 to-sky-400/40',
]

/** Serpentinas albicelestes que caen suavecito (solo el día del cumpleaños). */
export default function Serpentinas() {
  const ribbons = useMemo<Ribbon[]>(
    () =>
      Array.from({ length: 14 }, () => ({
        left: 2 + Math.random() * 96,
        size: 10 + Math.random() * 10,
        fallDur: 10 + Math.random() * 8,
        swayDur: 2.6 + Math.random() * 2,
        rot: Math.floor(Math.random() * 360),
        tone: TONES[Math.floor(Math.random() * TONES.length)],
      })),
    [],
  )

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
      {ribbons.map((r, i) => (
        <span
          key={i}
          className="absolute -top-10"
          style={{
            left: `${r.left}%`,
            animation: `petalFall ${r.fallDur}s linear ${-Math.random() * 18}s infinite`,
          }}
        >
          <span
            className="inline-block"
            style={{ animation: `swayX ${r.swayDur}s ease-in-out infinite alternate` }}
          >
            <span
              className={`block bg-gradient-to-b ${r.tone}`}
              style={{
                width: r.size * 0.34,
                height: r.size * 1.7,
                borderRadius: 3,
                transform: `rotate(${r.rot}deg)`,
              }}
            />
          </span>
        </span>
      ))}
    </div>
  )
}
