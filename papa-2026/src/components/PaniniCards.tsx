import { useState } from 'react'
import { fireBurst } from '../effects'

interface Sticker {
  emoji: string
  pos: string
  line: string
  stat: string
  statVal: number
}

/** El álbum: 8 figuritas de los papeles que cumple el capitán en esta familia. */
const CARDS: Sticker[] = [
  {
    emoji: '🧤',
    pos: 'EL ARQUERO',
    line: 'Ataja todo lo que nos puede pasar. Reflejos de felino.',
    stat: 'Reflejos',
    statVal: 99,
  },
  {
    emoji: '🎽',
    pos: 'EL CAPITÁN',
    line: 'Lleva la cinta de esta familia desde el día uno.',
    stat: 'Liderazgo',
    statVal: 99,
  },
  {
    emoji: '⚽',
    pos: 'EL 9 DE ÁREA',
    line: 'Siempre en el lugar justo, justo en el momento justo.',
    stat: 'Instinto',
    statVal: 99,
  },
  {
    emoji: '🪄',
    pos: 'EL ENGANCHE',
    line: 'Hace jugar mejor a todos los que lo rodean.',
    stat: 'Magia',
    statVal: 99,
  },
  {
    emoji: '📋',
    pos: 'EL DT',
    line: 'Los cambios que hace desde el banco nunca fallan.',
    stat: 'Estrategia',
    statVal: 99,
  },
  {
    emoji: '📣',
    pos: 'EL HINCHA',
    line: 'Alienta en las buenas… y en las malas mucho más.',
    stat: 'Pasión',
    statVal: 99,
  },
  {
    emoji: '🏆',
    pos: 'EL ÍDOLO',
    line: 'El estadio de esta casa se llena solo con vos.',
    stat: 'Carisma',
    statVal: 99,
  },
  {
    emoji: '👑',
    pos: 'LA LEYENDA',
    line: 'De esas que no se repiten. Directo al mural.',
    stat: 'Eterno',
    statVal: 100,
  },
]

function StickerCard({ card, i }: { card: Sticker; i: number }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      onClick={(e) => {
        if (!flipped) fireBurst({ x: e.clientX, y: e.clientY, tiny: true, count: 8 })
        setFlipped((v) => !v)
      }}
      aria-label={`Figurita ${card.pos}`}
      className={`flip-card card-enter group relative aspect-[3/4.1] w-full cursor-pointer bg-transparent border-0 p-0 select-none transition-transform duration-300 ${
        flipped ? '' : 'hover:-translate-y-1.5'
      }`}
      style={{ animationDelay: `${420 + i * 110}ms` }}
    >
      <div className={`flip-inner ${flipped ? 'flipped' : ''}`}>
        {/* frente */}
        <div className="flip-face flex flex-col overflow-hidden rounded-2xl border-2 border-amber-300/30 bg-gradient-to-b from-[#123a52] to-[#0c2436] shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-3 pt-2.5 pb-1.5">
            <span className="font-display text-sm tracking-[0.2em] text-sky-300 leading-none">PAPÁ FC</span>
            <span className="text-[10px] font-semibold text-zinc-400 tabular-nums">
              {String(i + 1).padStart(2, '0')}/08
            </span>
          </div>
          <div className="flex flex-1 items-center justify-center text-5xl sm:text-6xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110">
            {card.emoji}
          </div>
          <div className="px-3 pb-3">
            <p className="font-display text-xl tracking-wide text-amber-200 leading-none">{card.pos}</p>
            <div className="mt-2 flex items-center justify-between rounded-lg bg-black/40 px-2.5 py-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                {card.stat}
              </span>
              <span className="font-display text-lg text-lime-300 leading-none">{card.statVal}</span>
            </div>
          </div>
        </div>

        {/* dorso */}
        <div className="flip-face flip-back flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-sky-300/40 bg-gradient-to-b from-sky-400 to-blue-600 px-4 py-5 text-center shadow-xl">
          <span className="text-3xl">{card.emoji}</span>
          <p className="font-hand text-xl leading-snug text-white">{card.line}</p>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-100/80">
            figurita pegada ✓
          </span>
        </div>
      </div>
    </button>
  )
}

export default function PaniniCards() {
  return (
    <section className="w-full max-w-5xl flex flex-col items-center gap-6" style={{ animationDelay: '380ms' }}>
      <h2 className="card-enter font-display text-3xl sm:text-4xl tracking-wide text-zinc-100">
        El álbum del capitán 🏅
      </h2>
      <p className="-mt-3 text-xs text-zinc-400">(tocá cada figurita para voltearla)</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
        {CARDS.map((card, i) => (
          <StickerCard key={card.pos} card={card} i={i} />
        ))}
      </div>
    </section>
  )
}
