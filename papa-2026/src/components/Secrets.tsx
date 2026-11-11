import { useEffect, useState } from 'react'
import { Shirt, Trophy, Flag, Timer, Music, Crown, Star, Sparkles, type LucideIcon } from 'lucide-react'
import { fireBurst } from '../effects'

const STORAGE_KEY = 'papa-secrets-found'

interface SecretSpot {
  id: string
  icon: LucideIcon
  style: React.CSSProperties
  hint: string
}

/** Cositas escondidas por los bordes de la pantalla de espera. */
const SECRETS: SecretSpot[] = [
  {
    id: 'shirt',
    icon: Shirt,
    style: { left: '7%', top: '6%' },
    hint: 'hay una camiseta con tu nombre esperando en el vestuario 👕',
  },
  {
    id: 'trophy',
    icon: Trophy,
    style: { right: '8%', top: '8%' },
    hint: 'este regalo viene con copa incluida 🏆',
  },
  {
    id: 'flag',
    icon: Flag,
    style: { right: '4%', top: '33%' },
    hint: 'bandera albiceleste en cada rincón de esta cancha 💙',
  },
  {
    id: 'timer',
    icon: Timer,
    style: { left: '4%', top: '48%' },
    hint: 'el descuento ya corre: falta poquito para tu día ⏱️',
  },
  {
    id: 'music',
    icon: Music,
    style: { right: '4%', top: '58%' },
    hint: 'hay música preparada para cuando salgás a la cancha 🎶',
  },
  {
    id: 'crown',
    icon: Crown,
    style: { right: '6%', bottom: '24%' },
    hint: 'el rey de la casa cumple el 12 de noviembre 👑',
  },
  {
    id: 'star',
    icon: Star,
    style: { left: '8%', bottom: '12%' },
    hint: 'la estrella del equipo siempre fuiste vos, papá ⭐',
  },
]

const TOTAL = SECRETS.length

function loadFound(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr.filter((v) => typeof v === 'string') : []
  } catch {
    return []
  }
}

/**
 * Juego de secretitos: 7 iconos casi invisibles escondidos por los bordes.
 * Al tocarlos sueltan un mensajito secreto. Se guarda el progreso.
 */
export default function Secrets() {
  const [found, setFound] = useState<string[]>(loadFound)
  const [toast, setToast] = useState<{ text: string; k: number } | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4200)
    return () => clearTimeout(t)
  }, [toast])

  const find = (s: SecretSpot, e: React.MouseEvent<HTMLButtonElement>) => {
    if (found.includes(s.id)) {
      // ya descubierto: solo una chispita
      fireBurst({ x: e.clientX, y: e.clientY, tiny: true, count: 5 })
      return
    }
    const next = [...found, s.id]
    setFound(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* sin almacenamiento no pasa nada */
    }
    fireBurst({ x: e.clientX, y: e.clientY, hearts: true, count: 12 })

    if (next.length === TOTAL) {
      fireBurst({ x: e.clientX, y: e.clientY, count: 120 })
      setTimeout(
        () => fireBurst({ x: window.innerWidth / 2, y: window.innerHeight * 0.4, hearts: true, count: 40 }),
        300,
      )
      setToast({ text: `🏆 ¡Los ${TOTAL} secretos! Ya sos director técnico de esta cancha 💙`, k: Date.now() })
    } else {
      setToast({ text: `Secreto ${next.length}/${TOTAL} · ${s.hint}`, k: Date.now() })
    }
  }

  const done = found.length
  const complete = done === TOTAL

  return (
    <>
      {/* contador de secretos (aparece al encontrar el primero) */}
      {done > 0 && (
        <div
          aria-label="Secretos encontrados"
          className={`card-enter fixed top-3 left-3 z-[70] flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold tabular-nums backdrop-blur shadow-lg ${
            complete
              ? 'border-amber-300/40 bg-amber-300/15 text-amber-200 animate-pulse-soft'
              : 'border-white/15 bg-white/5 text-zinc-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {done}/{TOTAL}
        </div>
      )}

      {/* mensajito secreto */}
      {toast && (
        <div
          key={toast.k}
          className="card-enter fixed top-16 left-1/2 -translate-x-1/2 z-[80] max-w-[86vw] text-center rounded-full border border-amber-200/20 bg-amber-100/10 backdrop-blur px-5 py-2.5 text-sm text-amber-100 shadow-xl"
        >
          {toast.text}
        </div>
      )}

      {/* los secretitos */}
      <div className="fixed inset-0 z-[70] pointer-events-none">
        {SECRETS.map((s) => {
          const Icon = s.icon
          const isFound = found.includes(s.id)
          return (
            <button
              key={s.id}
              onClick={(e) => find(s, e)}
              aria-label="Un secreto escondido"
              className="group pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer bg-transparent border-0 p-2 select-none before:absolute before:-inset-2.5 before:content-[''] outline-none"
              style={s.style}
            >
              <Icon
                className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-150 ${
                  isFound ? 'text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.6)]' : 'text-zinc-300/45 animate-pulse-soft'
                }`}
                fill="currentColor"
              />
            </button>
          )
        })}
      </div>
    </>
  )
}
