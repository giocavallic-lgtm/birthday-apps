import { useEffect, useRef, useState } from 'react'
import { Gift, Heart, Sparkles, Star } from 'lucide-react'
import { fireBurst } from '../effects'

type PopKind = 'heart' | 'star' | 'gift' | 'gold' | 'sparkle'

interface PopItem {
  id: number
  kind: PopKind
  x: number
  size: number
  dur: number
  swayDur: number
}

const KIND_POOL: PopKind[] = [
  'heart', 'heart', 'heart', 'heart',
  'star', 'star',
  'gift',
  'sparkle',
  'heart', 'heart', 'star',
  'gold',
]

const POINTS: Record<PopKind, number> = {
  heart: 1,
  star: 1,
  gift: 1,
  sparkle: 1,
  gold: 5,
}

const STYLES: Record<PopKind, { icon: typeof Heart; className: string }> = {
  heart: { icon: Heart, className: 'text-pink-400' },
  star: { icon: Star, className: 'text-yellow-300' },
  gift: { icon: Gift, className: 'text-purple-400' },
  sparkle: { icon: Sparkles, className: 'text-amber-200' },
  gold: {
    icon: Heart,
    className: 'text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.9)] animate-pulse-soft',
  },
}

const MAX_ON_SCREEN = 5
const SPAWN_MS = 2300

/**
 * Corazones y regalitos que flotan hacia arriba por toda la pantalla.
 * Se pueden atrapar (clic / tap) y explotan en corazoncitos.
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
          x: 6 + Math.random() * 88,
          size: (26 + Math.random() * 14) + (kind === 'gold' ? 10 : 0),
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
      count: gold ? 30 : item.kind === 'gift' ? 20 : 10,
    })
    if (gold || item.kind === 'gift') {
      fireBurst({ x: e.clientX, y: e.clientY, count: gold ? 50 : 25 })
    }
    onCollect(POINTS[item.kind])
  }

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none overflow-hidden">
      {items.map((item) => {
        const { icon: Icon, className } = STYLES[item.kind]
        return (
          <button
            key={item.id}
            onClick={(e) => pop(item, e)}
            aria-label={`Atrapar ${item.kind === 'gold' ? 'el corazón dorado' : 'un corazón'}`}
            className="pointer-events-auto group absolute bottom-[-60px] cursor-pointer bg-transparent border-0 p-0"
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
              <Icon
                className={`${className} w-full h-full transition-transform duration-150 group-hover:scale-125`}
                fill="currentColor"
                strokeWidth={item.kind === 'gold' ? 1.5 : 2}
              />
            </span>
          </button>
        )
      })}
    </div>
  )
}
