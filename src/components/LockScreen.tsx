import { useEffect, useState } from 'react'
import { Heart, Lock } from 'lucide-react'
import { fireBurst } from '../effects'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl sm:text-4xl font-bold tabular-nums text-zinc-100">{value}</span>
      <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">{label}</span>
    </div>
  )
}

export default function LockScreen({ now, unlocksAt }: { now: Date; unlocksAt: Date }) {
  const [shaking, setShaking] = useState(false)
  const [toastKey, setToastKey] = useState(0)
  const [toastVisible, setToastVisible] = useState(false)

  const diff = Math.max(0, unlocksAt.getTime() - now.getTime())
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)

  useEffect(() => {
    if (!toastVisible) return
    const t = setTimeout(() => setToastVisible(false), 2600)
    return () => clearTimeout(t)
  }, [toastVisible, toastKey])

  const tap = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShaking(true)
    setTimeout(() => setShaking(false), 600)
    const r = e.currentTarget.getBoundingClientRect()
    fireBurst({ x: r.left + r.width / 2, y: r.top + r.height / 3, hearts: true, count: 16 })
    setToastKey((k) => k + 1)
    setToastVisible(true)
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-8 sm:gap-10 px-4 py-14 text-center">
      {/* badge */}
      <div className="card-enter flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-200">
        <Lock className="w-3.5 h-3.5" />
        Carta sellada
      </div>

      {/* título */}
      <h1
        className="card-enter font-script text-6xl sm:text-7xl md:text-8xl leading-tight bg-gradient-to-r from-rose-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg"
        style={{ animationDelay: '120ms' }}
      >
        Hay algo aquí para ti…
      </h1>

      <p
        className="card-enter max-w-md text-zinc-300/90 text-base sm:text-lg"
        style={{ animationDelay: '240ms' }}
      >
        Pero aún está sellado. El acceso abre mañana,{' '}
        <span className="text-rose-200 font-semibold">11 de noviembre</span>.
      </p>

      {/* sobre */}
      <button
        onClick={tap}
        aria-label="Sobre sellado, toca para intentar abrirlo"
        className={`card-enter relative mt-2 cursor-pointer bg-transparent border-0 p-0 outline-none ${
          shaking ? 'shake' : 'animate-float'
        }`}
        style={{ animationDelay: '360ms' }}
      >
        <div className="absolute -inset-10 rounded-full bg-pink-500/20 blur-3xl animate-pulse-soft" />
        <div className="relative w-60 h-40 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-200 shadow-2xl shadow-pink-950/50 overflow-hidden">
          {/* solapa */}
          <div
            className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-br from-rose-300 to-pink-400"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
          />
          <span className="absolute inset-x-0 top-[62%] flex justify-center font-hand text-2xl text-rose-500/80">
            para ti
          </span>
        </div>
        {/* sello de cera */}
        <div className="seal-glow absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center ring-4 ring-red-400/30">
          <Heart className="w-5 h-5 text-rose-100" fill="currentColor" />
        </div>
      </button>

      {/* cuenta regresiva */}
      <div
        className="card-enter flex items-stretch gap-4 sm:gap-7 rounded-3xl border border-white/10 bg-white/5 backdrop-blur px-6 sm:px-8 py-5 shadow-2xl"
        style={{ animationDelay: '480ms' }}
      >
        {days > 0 && <Unit value={String(days)} label="días" />}
        <Unit value={pad(hours)} label="horas" />
        <Unit value={pad(mins)} label="min" />
        <Unit value={pad(secs)} label="seg" />
      </div>

      <p className="card-enter text-sm text-zinc-400" style={{ animationDelay: '600ms' }}>
        Vuelve mañana y ábrela 💌
      </p>

      {/* toast */}
      {toastVisible && (
        <div
          key={toastKey}
          className="card-enter fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] rounded-full border border-white/15 bg-white/10 backdrop-blur px-5 py-2.5 text-sm text-zinc-100 shadow-xl"
        >
          ¡Paciencia! 💌 Todavía no es el día…
        </div>
      )}
    </div>
  )
}
