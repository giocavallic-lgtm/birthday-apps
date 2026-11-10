import { useEffect, useMemo, useState } from 'react'
import { fireBurst } from '../effects'

const CANDLE_COLORS = ['#f472b6', '#a78bfa', '#60a5fa', '#fbbf24', '#fb7185']
const SPRINKLE_COLORS = ['#ffffff', '#fbbf24', '#60a5fa', '#f472b6', '#34d399']

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
      className="relative group cursor-pointer bg-transparent border-0 p-0"
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
      <div className="flex items-end gap-7 -mb-1.5 relative z-10">
        {lit.map((isLit, i) => (
          <Candle key={i} index={i} lit={isLit} onBlow={blow(i)} />
        ))}
      </div>

      {/* piso superior */}
      <div className="relative w-52 h-16 rounded-t-2xl bg-gradient-to-b from-pink-400 to-pink-500 shadow-lg shadow-purple-950/40">
        <div className="absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-rose-50 to-rose-100 rounded-t-2xl" />
        <div className="absolute top-7 inset-x-2 flex justify-between">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="w-3.5 h-4 rounded-b-full bg-rose-100" />
          ))}
        </div>
        {sprinklesTop.map((s, i) => (
          <span
            key={i}
            className="absolute w-1.5 h-3 rounded-full"
            style={{ left: s.left, top: s.top, background: s.color, transform: `rotate(${s.rot}deg)` }}
          />
        ))}
      </div>

      {/* piso inferior */}
      <div className="relative w-72 h-20 rounded-t-xl bg-gradient-to-b from-purple-400 to-purple-500 shadow-xl shadow-purple-950/40">
        <div className="absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-violet-50 to-violet-100 rounded-t-xl" />
        <div className="absolute top-7 inset-x-4 flex justify-between">
          {[...Array(7)].map((_, i) => (
            <span key={i} className="w-4 h-4 rounded-b-full bg-violet-100" />
          ))}
        </div>
        {sprinklesBottom.map((s, i) => (
          <span
            key={i}
            className="absolute w-1.5 h-3 rounded-full"
            style={{ left: s.left, top: s.top, background: s.color, transform: `rotate(${s.rot}deg)` }}
          />
        ))}
      </div>

      {/* plato */}
      <div className="w-80 max-w-full h-4 rounded-[50%] bg-white/20 shadow-lg" />
    </div>
  )
}
