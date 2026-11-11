import { useRef, useState } from 'react'
import { fireBurst } from '../effects'

type Zone = 'left' | 'mid' | 'right'
const ZONES: Zone[] = ['left', 'mid', 'right']

/** A dónde se tira la pelota y a dónde vuela el arquero. */
const KEEPER_T: Record<Zone, string> = {
  mid: 'translate(-50%, -34px)',
  left: 'translate(calc(-50% - 92px), -26px) rotate(-58deg)',
  right: 'translate(calc(-50% + 92px), -26px) rotate(58deg)',
}

const BALL_T: Record<Zone, string> = {
  mid: 'translate(-50%, -100px)',
  left: 'translate(calc(-50% - 98px), -92px)',
  right: 'translate(calc(-50% + 98px), -92px)',
}

const GOAL_TEXTS = [
  '¡abajo el arquero y arriba tu remate!',
  '¡qué golazo, capitán!',
  '¡al ángulo, imparabile!',
  '¡de primera, al palo lejos!',
]

const SAVE_TEXTS = [
  'el arquero te leyó la intención…',
  '¡voló y te la sacó!',
  'el arquero adivinó tu remate…',
  '¡atajón del gigante del arco!',
]

const ZONE_LABEL: Record<Zone, string> = {
  left: 'Patear a la izquierda',
  mid: 'Patear al centro',
  right: 'Patear a la derecha',
}

/**
 * Tanda de penales para matar la espera:
 * tocás dónde patear y el arquero vuela a un lado al azar.
 */
export default function PenaltyGame() {
  const [goals, setGoals] = useState(0)
  const [saves, setSaves] = useState(0)
  const [shot, setShot] = useState<Zone | null>(null)
  const [keeper, setKeeper] = useState<Zone>('mid')
  const [result, setResult] = useState<{ goal: boolean; text: string; k: number } | null>(null)
  const busy = useRef(false)
  const goalRef = useRef<HTMLDivElement>(null)

  const shoot = (zone: Zone) => {
    if (busy.current) return
    busy.current = true
    const dive: Zone = ZONES[Math.floor(Math.random() * ZONES.length)]
    setShot(zone)
    setKeeper(dive)
    setResult(null)

    const saved = dive === zone
    window.setTimeout(() => {
      if (saved) {
        setSaves((s) => s + 1)
        setResult({
          goal: false,
          text: SAVE_TEXTS[Math.floor(Math.random() * SAVE_TEXTS.length)],
          k: Date.now(),
        })
      } else {
        setGoals((g) => g + 1)
        setResult({
          goal: true,
          text: GOAL_TEXTS[Math.floor(Math.random() * GOAL_TEXTS.length)],
          k: Date.now(),
        })
        const r = goalRef.current?.getBoundingClientRect()
        if (r) fireBurst({ x: r.left + r.width / 2, y: r.top + r.height * 0.45, count: 45 })
      }
    }, 480)

    window.setTimeout(() => {
      setShot(null)
      setKeeper('mid')
      setResult(null)
      busy.current = false
    }, 1600)
  }

  return (
    <div className="flex w-full flex-col items-center gap-3 select-none">
      <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
        Mientras esperás: tanda de penales 🥅
      </p>

      <div className="relative">
        {/* arco */}
        <div
          ref={goalRef}
          className="relative w-[min(84vw,340px)] h-[150px] sm:h-[170px] rounded-t-xl border-[5px] border-white/85 bg-black/25 shadow-[0_0_35px_rgba(125,211,252,0.12)]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.07) 0 2px, transparent 2px 15px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.07) 0 2px, transparent 2px 15px)',
          }}
        >
          {/* arquero */}
          <div
            className="absolute bottom-4 left-1/2 z-[5]"
            style={{
              transform: keeper === 'mid' && !shot ? 'translate(-50%, 0)' : KEEPER_T[keeper],
              transition: 'transform 0.42s cubic-bezier(0.3, 0.8, 0.3, 1)',
            }}
            aria-hidden="true"
          >
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-amber-200 border border-amber-300/80" />
              <div className="relative w-11 h-12 -mt-0.5 rounded-t-lg bg-gradient-to-b from-yellow-400 to-amber-500">
                <span className="absolute -left-1 top-1 w-2.5 h-8 rounded-full bg-amber-300 -rotate-12" />
                <span className="absolute -right-1 top-1 w-2.5 h-8 rounded-full bg-amber-300 rotate-12" />
                <span className="absolute -left-2 top-7 w-3 h-3 rounded-full bg-white shadow" />
                <span className="absolute -right-2 top-7 w-3 h-3 rounded-full bg-white shadow" />
              </div>
            </div>
          </div>

          {/* pelota */}
          <span
            className="absolute bottom-3 left-1/2 z-[6] text-2xl leading-none"
            style={{
              transform: shot ? BALL_T[shot] : 'translate(-50%, 0)',
              transition: 'transform 0.44s ease-in',
              filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))',
            }}
            aria-hidden="true"
          >
            ⚽
          </span>

          {/* zonas de remate */}
          {(['left', 'mid', 'right'] as Zone[]).map((zone) => (
            <button
              key={zone}
              onClick={() => shoot(zone)}
              aria-label={ZONE_LABEL[zone]}
              className={`absolute inset-y-0 w-1/3 z-10 cursor-pointer bg-transparent border-0 p-0 before:absolute before:-inset-x-3 before:inset-y-0 before:content-[''] ${
                zone === 'left' ? 'left-0' : zone === 'mid' ? 'left-1/3' : 'right-0'
              }`}
            />
          ))}

          {/* resultado */}
          {result && (
            <div
              key={result.k}
              className="goal-pop pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-0.5 rounded-t-xl bg-black/30"
            >
              <span className="font-display text-4xl sm:text-5xl bg-gradient-to-r from-sky-200 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(56,189,248,0.4)]">
                {result.goal ? '¡GOOOOL!' : '¡ATAJÓN!'}
              </span>
              <span className="font-hand text-base text-zinc-100/90">{result.text}</span>
            </div>
          )}
        </div>

        {/* línea del piso y punto penal */}
        <div className="mx-auto h-[5px] w-[calc(100%+14px)] -mt-[3px] rounded-full bg-white/30" />
        <div className="mx-auto mt-2.5 w-2 h-2 rounded-full bg-white/40" />
      </div>

      {/* marcador */}
      <div className="flex items-center gap-2.5">
        <span className="flex items-center gap-1.5 rounded-full border border-sky-300/25 bg-sky-400/10 px-3.5 py-1 text-xs font-semibold text-sky-200 tabular-nums">
          ⚽ {goals} goles
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-zinc-300 tabular-nums">
          🧤 {saves} atajadas
        </span>
      </div>
      <p className="text-xs text-zinc-500">tocá adonde querés patear 👇</p>
    </div>
  )
}
