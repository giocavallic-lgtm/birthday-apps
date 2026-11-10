import { useMemo } from 'react'

interface Petal {
  left: number
  size: number
  fallDur: number
  swayDur: number
  rot: number
  tone: string
}

const TONES = [
  'from-pink-200/60 to-rose-300/50',
  'from-rose-200/60 to-pink-300/50',
  'from-rose-100/50 to-rose-200/40',
]

/** Pétalos que caen suavecito por toda la pantalla (solo el día del cumpleaños). */
export default function Petals() {
  const petals = useMemo<Petal[]>(
    () =>
      Array.from({ length: 14 }, () => ({
        left: 2 + Math.random() * 96,
        size: 8 + Math.random() * 8,
        fallDur: 10 + Math.random() * 8,
        swayDur: 2.6 + Math.random() * 2,
        rot: Math.floor(Math.random() * 360),
        tone: TONES[Math.floor(Math.random() * TONES.length)],
      })),
    [],
  )

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute -top-8"
          style={{
            left: `${p.left}%`,
            animation: `petalFall ${p.fallDur}s linear ${-Math.random() * 18}s infinite`,
          }}
        >
          <span
            className="inline-block"
            style={{ animation: `swayX ${p.swayDur}s ease-in-out infinite alternate` }}
          >
            <span
              className={`block bg-gradient-to-br ${p.tone}`}
              style={{
                width: p.size,
                height: p.size * 0.72,
                borderRadius: '100% 0 100% 0',
                transform: `rotate(${p.rot}deg)`,
              }}
            />
          </span>
        </span>
      ))}
    </div>
  )
}
