import { useEffect, useMemo, useState } from 'react'
import { fireBurst } from '../effects'

const CANDLE_COLORS = ['#38bdf8', '#7dd3fc', '#fbbf24', '#60a5fa', '#fde68a']
const SPRINKLE_COLORS = ['#ffffff', '#7dd3fc', '#38bdf8', '#fbbf24', '#e0f2fe']

function makeSprinkles(n: number) {
  return Array.from({ length: n }, () => ({
    left: `${8 + Math.random() * 84}%`,
    top: `${35 + Math.random() * 55}%`,
    color: SPRINKLE_COLORS[Math.floor(Math.random() * SPRINKLE_COLORS.length)],
    rot: Math.floor(Math.random() * 180),
  }))
}

function Candle({
  index,
  lit,
  onBlow,
}: {
  index: number
  lit: boolean
  onBlow: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
  const color = CANDLE_COLORS[index % CANDLE_COLORS.length]
  return (
    <button
      onClick={onBlow}
      aria-label={`Vela ${index + 1}`}
      className="relative group cursor-pointer bg-transparent border-0 p-0 before:absolute before:-left-3 before:-right-3 before:-top-7 before:bottom-0 before:content-['']"
    >
      {/* llama */}
      {lit && (
        <span
          className="flame absolute left-1/2 -top-6 w-3.5 h-6 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 50% 75%, #fff7cc 0%, #ffd166 45%, #ff9f1c 75%, transparent 100%)',
            boxShadow: '0 0 18px 6px rgba(255,190,80,0.55)',
          }}
        />
      )}
      {/* humo al apagarse */}
      {!lit && (
        <>
          <span className="smoke absolute left-1/2 -top-2 w-2 h-2 rounded-full bg-zinc-400/70" />
          <span
            className="smoke absolute left-1/2 -top-2 w-2.5 h-2.5 rounded-full bg-zinc-400/60"
            style={{ animationDelay: '0.25s' }}
          />
        </>
      )}
      {/* mecha */}
      <span className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-0.5 h-2 bg-zinc-700 rounded" />
      {/* vela */}
      <span
        className="block w-3.5 h-14 rounded-sm shadow-md transition-transform group-hover:scale-105"
        style={{
          background: `repeating-linear-gradient(45deg, ${color} 0 6px, #fff 6px 12px)`,
        }}
      />
    </button>
  )
}

export default function Cake({ onAllOut }: { onAllOut: () => void }) {
  const [lit, setLit] = useState<boolean[]>(() => Array(5).fill(true))
  const sprinklesTop = useMemo(() => makeSprinkles(12), [])
  const sprinklesBottom = useMemo(() => makeSprinkles(16), [])

  const allOut = lit.every((l) => !l)

  useEffect(() => {
    if (allOut) onAllOut()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOut])

  const blow = (i: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!lit[i]) return
    setLit((arr) => arr.map((v, idx) => (idx === i ? false : v)))
    fireBurst({ x: e.clientX, y: e.clientY, hearts: true, count: 10 })
  }

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* velitas */}
      <div className="flex items-end gap-4 sm:gap-7 -mb-1.5 relative z-10">
        {lit.map((isLit, i) => (
          <Candle key={i} index={i} lit={isLit} onBlow={blow(i)} />
        ))}
      </div>

      {/* piso superior */}
      <div
        className="relative w-52 h-16 rounded-t-2xl shadow-lg shadow-sky-950/40"
        style={{ background: 'repeating-linear-gradient(90deg, #f8fafc 0 13px, #7dd3fc 13px 26px)' }}
      >
        <div className="absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-white to-sky-100 rounded-t-2xl" />
        <div className="absolute top-7 inset-x-2 flex justify-between">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="w-3.5 h-4 rounded-b-full bg-sky-100" />
          ))}
        </div>
        {sprinklesTop.map((s, i) => (
          <span
            key={i}
            className="absolute w-1.5 h-3 rounded-full"
            style={{ left: s.left, top: s.top, background: s.color, transform: `rotate(${s.rot}deg)` }}
          />
        ))}
        <span className="absolute left-[24%] top-[52%] text-base leading-none select-none">⚽</span>
        <span className="absolute right-[22%] top-[54%] text-base leading-none select-none">⚽</span>
      </div>

      {/* piso inferior */}
      <div
        className="relative w-72 h-20 rounded-t-xl shadow-xl shadow-sky-950/40"
        style={{ background: 'repeating-linear-gradient(90deg, #f8fafc 0 15px, #7dd3fc 15px 30px)' }}
      >
        <div className="absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-white to-sky-100 rounded-t-xl" />
        <div className="absolute top-7 inset-x-4 flex justify-between">
          {[...Array(7)].map((_, i) => (
            <span key={i} className="w-4 h-4 rounded-b-full bg-sky-100" />
          ))}
        </div>
        {sprinklesBottom.map((s, i) => (
          <span
            key={i}
            className="absolute w-1.5 h-3 rounded-full"
            style={{ left: s.left, top: s.top, background: s.color, transform: `rotate(${s.rot}deg)` }}
          />
        ))}
        <span className="absolute left-[16%] top-[48%] text-xl leading-none select-none">⚽</span>
        <span className="absolute right-[14%] top-[50%] text-xl leading-none select-none">⚽</span>
      </div>

      {/* plato */}
      <div className="w-80 max-w-full h-4 rounded-[50%] bg-white/20 shadow-lg" />
    </div>
  )
}
