import { useEffect, useRef, useState } from 'react'
import {
  Cake,
  Gift,
  Heart,
  Sparkles,
  Star,
  Sun,
  Moon,
  Flower2,
  Smile,
  PartyPopper,
  CakeSlice,
  type LucideIcon,
} from 'lucide-react'

// ---------- Confeti (canvas propio, sin dependencias) ----------

function ConfettiBurst({ burstId }: { burstId: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (burstId === 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const colors = ['#f472b6', '#c084fc', '#60a5fa', '#fbbf24', '#34d399', '#fb7185', '#f9a8d4']
    const pieces = Array.from({ length: 180 }, () => ({
      x: w / 2 + (Math.random() - 0.5) * w * 0.5,
      y: h * 0.38 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 15,
      vy: -(4 + Math.random() * 11),
      size: 6 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.35,
      shape: Math.random() > 0.45 ? 'rect' : 'circle',
    }))

    const start = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const elapsed = now - start
      ctx.clearRect(0, 0, w, h)

      for (const p of pieces) {
        p.vy += 0.34
        p.vx *= 0.992
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = Math.max(0, 1 - elapsed / 2800)
        ctx.fillStyle = p.color
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.6)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      if (elapsed < 2900) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, w, h)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [burstId])

  return <canvas ref={canvasRef} className="fixed inset-0 z-50 pointer-events-none" />
}

// ---------- Corazones flotando de fondo ----------

const HEARTS = [
  { left: '8%', size: 22, duration: 14, delay: 0 },
  { left: '22%', size: 14, duration: 18, delay: 3 },
  { left: '45%', size: 28, duration: 16, delay: 6 },
  { left: '63%', size: 16, duration: 20, delay: 1 },
  { left: '78%', size: 20, duration: 15, delay: 8 },
  { left: '92%', size: 13, duration: 19, delay: 4 },
]

function FloatingHearts() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {HEARTS.map((h, i) => (
        <Heart
          key={i}
          className="heart-float absolute text-pink-400/30"
          style={{
            left: h.left,
            bottom: '-40px',
            width: h.size,
            height: h.size,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
          fill="currentColor"
        />
      ))}
    </div>
  )
}

// ---------- Datos ----------

interface Message {
  icon: LucideIcon
  text: string
  color: string // color del icono
  bg: string // color del fondo del icono
}

const messages: Message[] = [
  { icon: Heart, text: 'Gracias por ser una amiga increíble', color: 'text-pink-400', bg: 'bg-pink-500/15' },
  { icon: Sparkles, text: 'Aprecio mucho nuestra amistad', color: 'text-purple-400', bg: 'bg-purple-500/15' },
  { icon: Sun, text: 'Gracias por tu apoyo y tu buen corazón', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  { icon: Star, text: '¡Eres amazing! 🌟', color: 'text-yellow-300', bg: 'bg-yellow-500/15' },
  { icon: Moon, text: 'Siempre estás cuando más necesito', color: 'text-blue-400', bg: 'bg-blue-500/15' },
  { icon: Flower2, text: 'Tu energía positiva ilumina el día', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  { icon: Smile, text: 'Gracias por ser tú mismo', color: 'text-teal-300', bg: 'bg-teal-500/15' },
  { icon: Gift, text: 'La amistad contigo es un regalo', color: 'text-rose-400', bg: 'bg-rose-500/15' },
]

// ---------- App ----------

export default function App() {
  const [burstId, setBurstId] = useState(0)
  const [showSpecial, setShowSpecial] = useState(false)

  // Cumpleaños: 11 de noviembre
  const now = new Date()
  let year = now.getFullYear()
  const nov11 = new Date(year, 10, 11)
  let birthday = nov11
  if (now.getTime() > new Date(year, 10, 11, 23, 59, 59).getTime()) {
    birthday = new Date(year + 1, 10, 11)
    year += 1
  }

  const isToday =
    now.getDate() === 11 && now.getMonth() === 10 && now.getFullYear() === birthday.getFullYear()
  const daysUntil = Math.max(0, Math.ceil((birthday.getTime() - now.getTime()) / 86400000))

  const fireConfetti = () => setBurstId((id) => id + 1)

  // Lluvia de confeti automática si es EL día
  useEffect(() => {
    if (isToday) {
      const t = setTimeout(() => setBurstId(1), 600)
      return () => clearTimeout(t)
    }
  }, [isToday])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-800 text-zinc-100 font-sans">
      {/* Confeti */}
      <ConfettiBurst burstId={burstId} />

      {/* Blobs decorativos */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <div className="animate-float absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-pink-500/15 blur-3xl" />
        <div className="animate-float-2 absolute bottom-1/4 right-[15%] w-48 h-48 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="animate-float absolute top-1/3 left-[12%] w-40 h-40 rounded-full bg-blue-500/10 blur-3xl" style={{ animationDelay: '2s' }} />
      </div>

      <FloatingHearts />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-14 px-4 gap-10">

        {/* Cuenta regresiva */}
        <div className="flex items-center gap-2.5 rounded-full border border-zinc-700/60 bg-zinc-900/60 backdrop-blur px-6 py-2.5 shadow-lg">
          <Cake className="w-5 h-5 text-pink-400" />
          <span className="text-base sm:text-lg text-zinc-300 font-medium">
            {isToday
              ? '¡Hoy es tu cumpleaños! 🎉'
              : daysUntil === 1
                ? `Falta ${daysUntil} día para tu cumpleaños`
                : `Faltan ${daysUntil} días para tu cumpleaños`}
          </span>
        </div>

        {/* Título */}
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
            ¡Feliz Cumpleaños!
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-zinc-400 max-w-xl mx-auto">
            {messages[0].text} 💖
          </p>
        </div>

        {/* Grid de mensajes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
          {messages.map((msg, i) => {
            const Icon = msg.icon
            return (
              <button
                key={i}
                onClick={fireConfetti}
                className="card-enter group text-left p-5 rounded-2xl border border-zinc-800/70 bg-zinc-900/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-zinc-600 hover:bg-zinc-800/70 hover:shadow-xl hover:shadow-pink-500/5 cursor-pointer"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`shrink-0 w-10 h-10 rounded-xl ${msg.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon className={`w-5 h-5 ${msg.color}`} />
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-300 pt-1.5">{msg.text}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Mensaje especial */}
        <div className="w-full max-w-lg text-center">
          {showSpecial ? (
            <div className="card-enter rounded-3xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur px-8 py-6 shadow-xl">
              <PartyPopper className="w-8 h-8 text-pink-400 mx-auto mb-3" />
              <p className="text-lg text-zinc-200 leading-relaxed">
                Espero que este año te traiga tanta alegría como tú le has traído a mi vida.
                ¡Que cumplas muchos más! 🎂✨
              </p>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowSpecial(true)
                fireConfetti()
              }}
              className="w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 px-8 py-3.5 text-lg font-semibold text-white shadow-lg shadow-pink-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              💖 Mostrar mensaje de afecto
            </button>
          )}
        </div>

        {/* Footer */}
        <p className="flex items-center gap-2 text-zinc-500 text-sm">
          <CakeSlice className="w-4 h-4" />
          Con afecto y amistad 🌹
        </p>
      </div>
    </div>
  )
}
