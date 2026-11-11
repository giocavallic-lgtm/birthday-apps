import { useEffect, useRef, useState } from 'react'
import { Lock } from 'lucide-react'
import { fireBurst } from '../effects'
import Secrets from './Secrets'
import PenaltyGame from './PenaltyGame'

const WAIT_MESSAGES = [
  'Cada segundo que pasa se acerca el pitazo inicial…',
  'Detrás de esta pelota hay más de lo que imaginás ⚽',
  'El 12 de noviembre sale a la cancha el capitán de la familia',
  'Hoy es la víspera. Mañana arranca la final 🏆',
  'La entrada es gratis: sos el invitado de honor 🎟️',
  '¿Ansioso? El árbitro todavía no llega 😌',
  'Hay una torta esperándote en el vestuario 🎂',
  'Casi casi… aguantá un poquito más ⏱️',
  'Podés tocar la pelota… pero no se va a abrir sola 😏',
  'Mientras esperás, ¿por qué no practicás penales? 👇',
  'Cositas escondidas hay por acá… mirá bien los bordes 👀',
  'El que busca con ojo de hincha encuentra secretitos ✨',
]

const TAP_MESSAGES = [
  '¡Eh! Todavía no es tu día ⚽',
  'Nop. La pelota sigue sellada 😌',
  'Ay… la ansiedad te puede 😏',
  'Menos un intento. Aguanta 💙',
  '¿Otra vez? Qué apuro, viejo… 👀',
  'El reglamento dice que ni lo intentes ✋',
  'Casi casi… pero no 😌',
]

const MSG_MS = 4200

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        key={value}
        className="digit-tick text-3xl sm:text-4xl font-bold tabular-nums text-zinc-100"
      >
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">{label}</span>
    </div>
  )
}

export default function LockScreen({ now, unlocksAt }: { now: Date; unlocksAt: Date }) {
  const [msgIdx, setMsgIdx] = useState(() => Math.floor(Date.now() / MSG_MS) % WAIT_MESSAGES.length)
  const [kicking, setKicking] = useState(false)
  const [toast, setToast] = useState<{ text: string; k: number } | null>(null)
  const tapIdx = useRef(0)

  // mensajes de espera rotativos
  useEffect(() => {
    const i = setInterval(
      () => setMsgIdx((v) => (v + 1) % WAIT_MESSAGES.length),
      MSG_MS,
    )
    return () => clearInterval(i)
  }, [])

  // auto-ocultar el toast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const diff = Math.max(0, unlocksAt.getTime() - now.getTime())
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)

  const tap = (e: React.MouseEvent<HTMLButtonElement>) => {
    setKicking(true)
    setTimeout(() => setKicking(false), 650)
    const r = e.currentTarget.getBoundingClientRect()
    fireBurst({ x: r.left + r.width / 2, y: r.top + r.height / 3, hearts: true, count: 16 })
    const text = TAP_MESSAGES[tapIdx.current % TAP_MESSAGES.length]
    tapIdx.current++
    setToast({ text, k: Date.now() })
  }

  return (
    <div className="relative z-10 min-h-dvh flex flex-col items-center justify-center gap-5 sm:gap-8 px-4 py-10 sm:py-14 text-center">
      <Secrets />
      {/* badge */}
      <div className="card-enter flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">
        <Lock className="w-3.5 h-3.5" />
        Se juega el 12 de noviembre
      </div>

      {/* título */}
      <h1
        className="card-enter font-display text-6xl sm:text-7xl md:text-8xl leading-[0.95] tracking-wide bg-gradient-to-r from-sky-200 via-sky-300 to-blue-300 bg-clip-text text-transparent drop-shadow-lg"
        style={{ animationDelay: '120ms' }}
      >
        Hay un partido
        <br />
        para vos…
      </h1>

      {/* mensaje de espera rotativo */}
      <div className="min-h-16 sm:min-h-20 flex items-center justify-center max-w-md">
        <p key={msgIdx} className="msg-rotate font-hand text-xl sm:text-3xl text-zinc-300/90">
          {WAIT_MESSAGES[msgIdx]}
        </p>
      </div>

      {/* pelota sellada */}
      <button
        onClick={tap}
        aria-label="Pelota sellada, tocala para intentar abrirla"
        className={`card-enter relative mt-2 cursor-pointer bg-transparent border-0 p-0 outline-none ${
          kicking ? 'ball-kick' : 'animate-float'
        }`}
        style={{ animationDelay: '360ms' }}
      >
        <div className="wiggle-occ">
          <div className="absolute -inset-10 rounded-full bg-sky-400/20 blur-3xl animate-pulse-soft" />
          <div className="relative seal-glow rounded-full p-6 sm:p-8 bg-white/5 backdrop-blur-sm">
            <span
              className="block text-8xl sm:text-9xl leading-none select-none"
              style={{ filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.55))' }}
            >
              ⚽
            </span>
          </div>
          {/* sombra en el piso */}
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-7 w-28 h-3 rounded-[50%] bg-black/45 blur-[3px]" />
        </div>
      </button>

      {/* cuenta regresiva */}
      <div
        className="card-enter flex items-stretch gap-3 sm:gap-7 rounded-3xl border border-white/10 bg-white/5 backdrop-blur px-5 sm:px-8 py-5 shadow-2xl"
        style={{ animationDelay: '480ms' }}
      >
        {days > 0 && <Unit value={String(days)} label="días" />}
        <Unit value={pad(hours)} label="horas" />
        <Unit value={pad(mins)} label="min" />
        <Unit value={pad(secs)} label="seg" />
      </div>

      {/* penales mientras espera */}
      <div className="card-enter" style={{ animationDelay: '560ms' }}>
        <PenaltyGame />
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="card-enter text-sm text-zinc-400" style={{ animationDelay: '640ms' }}>
          Volvé mañana, que se juega la final 🎟️
        </p>
        <p className="card-enter text-xs text-zinc-500" style={{ animationDelay: '720ms' }}>
          Psst… las pelotitas que flotan se pueden atrapar 👀⚽
        </p>
      </div>

      {/* toast */}
      {toast && (
        <div
          key={toast.k}
          className="card-enter fixed bottom-28 left-1/2 -translate-x-1/2 z-[80] max-w-[86vw] text-center rounded-full border border-white/15 bg-white/10 backdrop-blur px-5 py-2.5 text-sm text-zinc-100 shadow-xl"
        >
          {toast.text}
        </div>
      )}
    </div>
  )
}
