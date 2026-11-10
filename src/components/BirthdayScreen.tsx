import { useEffect, useState } from 'react'
import {
  Heart,
  Sparkles,
  Sun,
  Moon,
  Star,
  Flower2,
  Music,
  Gift,
  MailOpen,
  type LucideIcon,
} from 'lucide-react'
import Cake from './Cake'
import { fireBurst } from '../effects'

interface Note {
  icon: LucideIcon
  text: string
  color: string
  bg: string
}

const NOTES: Note[] = [
  { icon: Heart, text: 'Te echo de menos. Hoy más que nunca.', color: 'text-pink-400', bg: 'bg-pink-500/15' },
  { icon: Sparkles, text: 'Sigues siendo mi persona favorita', color: 'text-purple-400', bg: 'bg-purple-500/15' },
  { icon: Sun, text: 'Tu sonrisa sigue siendo mi lugar favorito', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  { icon: Moon, text: 'Pienso en ti más de lo que confieso', color: 'text-blue-400', bg: 'bg-blue-500/15' },
  { icon: Star, text: 'Brillas incluso en mis días grises', color: 'text-yellow-300', bg: 'bg-yellow-500/15' },
  { icon: Flower2, text: 'El mundo es más bonito contigo en él', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  { icon: Music, text: 'Hay canciones que no puedo escuchar sin pensar en ti', color: 'text-rose-400', bg: 'bg-rose-500/15' },
  { icon: Gift, text: 'Este pequeño rincón lo hice pensando en ti', color: 'text-teal-300', bg: 'bg-teal-500/15' },
]

const LETTER = `Para ti,

Hoy el mundo celebra que existes, y yo celebro haber coincidido contigo alguna vez. Te echo de menos: más de lo que digo, más de lo que debería.

No puedo abrazarte hoy, así que te hice este pequeño rincón. Tócalo todo, cada detalle tiene algo para ti.

Que este año te traiga risas, calma y todo lo que sueñas. Feliz cumpleaños.`

function Letter({ onClose }: { onClose: () => void }) {
  const [chars, setChars] = useState(0)
  const done = chars >= LETTER.length

  useEffect(() => {
    if (done) return
    const t = setTimeout(() => setChars((v) => v + 1), 26)
    return () => clearTimeout(t)
  }, [chars, done])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="card-enter relative w-full max-w-lg rounded-3xl border border-amber-100/60 bg-[#fdf8ee] p-7 sm:p-9 shadow-2xl cursor-pointer"
        onClick={(e) => {
          e.stopPropagation()
          setChars(LETTER.length)
        }}
      >
        {/* sello */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center ring-4 ring-red-400/30 shadow-lg">
          <Heart className="w-5 h-5 text-rose-100" fill="currentColor" />
        </div>

        <h2 className="font-script text-4xl sm:text-5xl text-center mt-3 text-rose-600">Para ti</h2>

        <p className="mt-5 whitespace-pre-line font-hand text-xl sm:text-2xl leading-snug text-stone-700">
          {LETTER.slice(0, chars)}
          {!done && <span className="caret" />}
        </p>

        {done && (
          <p className="mt-6 text-right font-hand text-2xl text-rose-500">
            con todo mi corazón 💜
          </p>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-6 py-3 text-white font-semibold shadow-lg shadow-rose-500/25 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          Guardar la carta 💌
        </button>
        <p className="mt-2.5 text-center text-[11px] text-stone-400">
          (toca la carta para leerla completa al instante)
        </p>
      </div>
    </div>
  )
}

export default function BirthdayScreen() {
  const [letterOpen, setLetterOpen] = useState(false)
  const [wishShown, setWishShown] = useState(false)
  const [cakeKey, setCakeKey] = useState(0)

  // celebración al entrar
  useEffect(() => {
    const t1 = setTimeout(
      () => fireBurst({ x: window.innerWidth / 2, y: window.innerHeight * 0.3, count: 200 }),
      350,
    )
    const t2 = setTimeout(
      () => fireBurst({ x: window.innerWidth * 0.12, y: window.innerHeight * 0.5, count: 90 }),
      700,
    )
    const t3 = setTimeout(
      () => fireBurst({ x: window.innerWidth * 0.88, y: window.innerHeight * 0.5, count: 90 }),
      950,
    )
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  const burstAt = (e: React.MouseEvent) =>
    fireBurst({ x: e.clientX, y: e.clientY, hearts: true, count: 12 })

  const allCandlesOut = () => {
    setWishShown(true)
    fireBurst({ count: 220 })
    setTimeout(() => fireBurst({ x: window.innerWidth * 0.2, y: window.innerHeight * 0.4, count: 120 }), 250)
    setTimeout(() => fireBurst({ x: window.innerWidth * 0.8, y: window.innerHeight * 0.4, count: 120 }), 450)
  }

  const relight = () => {
    setWishShown(false)
    setCakeKey((k) => k + 1)
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center gap-12 sm:gap-16 px-4 py-14 text-center">
      {/* fecha */}
      <div className="card-enter flex items-center gap-2.5 rounded-full border border-rose-300/20 bg-rose-400/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-rose-200">
        11 · Noviembre
      </div>

      {/* título */}
      <div className="card-enter" style={{ animationDelay: '120ms' }}>
        <h1 className="font-script text-7xl sm:text-8xl md:text-9xl leading-tight bg-gradient-to-r from-rose-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
          Feliz Cumpleaños
        </h1>
        <p className="mt-3 text-zinc-300/90 text-base sm:text-lg">
          Hoy el mundo celebra que existes 💜
        </p>
      </div>

      {/* tarta */}
      <section
        className="card-enter flex flex-col items-center gap-5"
        style={{ animationDelay: '260ms' }}
      >
        <h2 className="font-hand text-3xl sm:text-4xl text-zinc-200">
          Apaga las velitas y pide un deseo 🕯️
        </h2>
        <p className="-mt-3 text-xs text-zinc-400">(toca cada vela)</p>

        <Cake key={cakeKey} onAllOut={allCandlesOut} />

        {wishShown && (
          <div className="card-enter flex flex-col items-center gap-4">
            <p className="font-script text-5xl sm:text-6xl bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
              Pide un deseo
            </p>
            <p className="font-hand text-xl text-zinc-300">…que se supone que se cumple 🌟</p>
            <button
              onClick={relight}
              className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm text-zinc-200 backdrop-blur transition-transform hover:scale-105 cursor-pointer"
            >
              Volver a encender 🕯️
            </button>
          </div>
        )}
      </section>

      {/* notas */}
      <section className="w-full max-w-5xl flex flex-col items-center gap-6" style={{ animationDelay: '380ms' }}>
        <h2 className="card-enter font-hand text-3xl sm:text-4xl text-zinc-200">
          Unas cuantas cosas que quería decirte
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {NOTES.map((note, i) => {
            const Icon = note.icon
            return (
              <button
                key={i}
                onClick={burstAt}
                className="card-enter group text-left p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-300/30 hover:bg-white/10 hover:shadow-xl hover:shadow-pink-500/10 cursor-pointer"
                style={{ animationDelay: `${420 + i * 110}ms` }}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`shrink-0 w-10 h-10 rounded-xl ${note.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <Icon className={`w-5 h-5 ${note.color}`} />
                  </div>
                  <p className="font-hand text-lg leading-snug text-zinc-200 pt-1">{note.text}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* carta */}
      <section className="card-enter w-full max-w-lg" style={{ animationDelay: '1.2s' }}>
        <button
          onClick={() => {
            setLetterOpen(true)
            fireBurst({ hearts: true, count: 24, y: window.innerHeight * 0.5 })
          }}
          className="group w-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-300 hover:to-pink-400 px-8 py-4 font-semibold text-lg text-white shadow-xl shadow-rose-500/25 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
        >
          <span className="inline-flex items-center gap-2.5">
            <MailOpen className="w-5 h-5 transition-transform group-hover:rotate-6" />
            Abrir tu carta
          </span>
        </button>
      </section>

      <p className="text-sm text-zinc-400 pb-4">Hecho con el corazón, para ti 💌</p>

      {letterOpen && <Letter onClose={() => setLetterOpen(false)} />}
    </div>
  )
}
