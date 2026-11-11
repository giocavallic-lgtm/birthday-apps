import { useEffect, useRef, useState } from 'react'
import { fireBurst } from '../effects'

type PopKind = 'ball' | 'trophy' | 'jersey' | 'medal' | 'gold'

interface PopItem {
  id: number
  kind: PopKind
  x: number
  size: number
  dur: number
  swayDur: number
}

const KIND_POOL: PopKind[] = [
  'ball', 'ball', 'ball', 'ball',
  'trophy', 'trophy',
  'jersey',
  'medal',
  'ball', 'ball', 'trophy',
  'gold',
]

const POINTS: Record<PopKind, number> = {
  ball: 1,
  trophy: 1,
  jersey: 1,
  medal: 1,
  gold: 5,
}

const EMOJI: Record<PopKind, string> = {
  ball: '⚽',
  trophy: '🏆',
  jersey: '🎽',
  medal: '🥇',
  gold: '⚽',
}

const GLOW: Record<PopKind, string> = {
  ball: '',
  trophy: '',
  jersey: '',
  medal: '',
  gold: 'drop-shadow-[0_0_12px_rgba(252,211,77,0.95)] animate-pulse-soft',
}

const MAX_ON_SCREEN = 5
const SPAWN_MS = 2300

/**
 * Pelotitas y premios que flotan hacia arriba por toda la pantalla.
 * Se pueden atrapar (clic / tap) y explotan en confeti albiceleste.
 */
export default function PopField({ onCollect }: { onCollect: (points: number) => void }) {
  const [items, setItems] = useState<PopItem[]>([])
  const idRef = useRef(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const spawn = () => {
      setItems((current) => {
        if (current.length >= MAX_ON_SCREEN) return current
        const kind = KIND_POOL[Math.floor(Math.random() * KIND_POOL.length)]
        const item: PopItem = {
          id: ++idRef.current,
          kind,
          x: 5 + Math.random() * 78,
          size: (30 + Math.random() * 12) + (kind === 'gold' ? 14 : 0),
          dur: 8 + Math.random() * 3.5,
          swayDur: 2.2 + Math.random() * 1.6,
        }
        // autolimpieza cuando termina de subir
        const t = window.setTimeout(() => {
          setItems((arr) => arr.filter((i) => i.id !== item.id))
        }, item.dur * 1000)
        timers.current.push(t)
        return [...current, item]
      })
    }

    const first = window.setTimeout(spawn, 700)
    const i = window.setInterval(spawn, SPAWN_MS)
    return () => {
      clearTimeout(first)
      clearInterval(i)
      timers.current.forEach(clearTimeout)
    }
  }, [])

  const pop = (item: PopItem, e: React.MouseEvent<HTMLButtonElement>) => {
    setItems((arr) => arr.filter((i) => i.id !== item.id))
    const gold = item.kind === 'gold'
    fireBurst({
      x: e.clientX,
      y: e.clientY,
      hearts: true,
      count: gold ? 30 : item.kind === 'trophy' ? 20 : 10,
    })
    if (gold || item.kind === 'trophy') {
      fireBurst({ x: e.clientX, y: e.clientY, count: gold ? 50 : 25 })
    }
    onCollect(POINTS[item.kind])
  }

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none overflow-hidden">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={(e) => pop(item, e)}
          aria-label={`Atrapar ${item.kind === 'gold' ? 'el balón dorado' : 'una pelotita'}`}
          className="pointer-events-auto group absolute bottom-[-60px] cursor-pointer bg-transparent border-0 p-0 select-none before:absolute before:-inset-3 before:content-['']"
          style={{
            left: `${item.x}%`,
            width: item.size,
            height: item.size,
            animation: `bubbleRise ${item.dur}s linear forwards`,
          }}
        >
          <span
            className="block"
            style={{ animation: `swayX ${item.swayDur}s ease-in-out infinite alternate` }}
          >
            <span
              className={`flex items-center justify-center leading-none transition-transform duration-150 group-hover:scale-125 ${GLOW[item.kind]}`}
              style={{ fontSize: item.size }}
            >
              {EMOJI[item.kind]}
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}
