import { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'
import Effects from './components/Effects'
import Backdrop from './components/Backdrop'
import SparkleTrail from './components/SparkleTrail'
import PopField from './components/PopField'
import LockScreen from './components/LockScreen'
import BirthdayScreen from './components/BirthdayScreen'

/** El cumpleaños es el 11 de noviembre. */
function isBirthday(d: Date) {
  return d.getMonth() === 10 && d.getDate() === 11
}

/** Fecha de desbloqueo: el próximo 11 de noviembre a medianoche. */
function nextUnlock(now: Date): Date {
  const y = now.getFullYear()
  const thisYear = new Date(y, 10, 11, 0, 0, 0)
  if (now.getTime() >= thisYear.getTime()) return new Date(y + 1, 10, 11, 0, 0, 0)
  return thisYear
}

const MILESTONES: Record<number, string> = {
  10: '¡10 corazones! 😌 esto engancha, ¿verdad?',
  25: '25 corazones 💖 vaya vaya…',
  50: '50 💖 oficialmente la campeona de este juego',
  100: '100 CORAZONES 👑 nada de esto te lo esperabas hoy',
}

export default function App() {
  const [now, setNow] = useState(() => new Date())
  const [collected, setCollected] = useState(0)
  const [milestone, setMilestone] = useState<{ text: string; k: number } | null>(null)
  const collectedRef = useRef(0)

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(i)
  }, [])

  // auto-ocultar logro
  useEffect(() => {
    if (!milestone) return
    const t = setTimeout(() => setMilestone(null), 3400)
    return () => clearTimeout(t)
  }, [milestone])

  const handleCollect = (points: number) => {
    collectedRef.current += points
    const next = collectedRef.current
    setCollected(next)
    const text = MILESTONES[next]
    if (text) setMilestone({ text, k: Date.now() })
  }

  // ?preview fuerza la vista de cumpleaños (para comprobar cómo se verá)
  const preview = new URLSearchParams(window.location.search).has('preview')
  const unlocked = preview || isBirthday(now)

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-[#17101f] via-[#221531] to-[#2e1a3f] text-zinc-100 font-sans">
      <Backdrop />
      <Effects />
      <SparkleTrail />
      <PopField onCollect={handleCollect} />
      {unlocked ? <BirthdayScreen /> : <LockScreen now={now} unlocksAt={nextUnlock(now)} />}

      {/* contador de corazones atrapados */}
      <div
        aria-label="Corazones atrapados"
        className="fixed bottom-[calc(1rem_+_env(safe-area-inset-bottom))] right-4 z-[65] flex items-center gap-1.5 rounded-full border border-pink-300/25 bg-pink-400/10 backdrop-blur px-3.5 py-1.5 text-sm font-semibold text-pink-200 shadow-lg"
      >
        <Heart className="w-4 h-4 text-pink-400" fill="currentColor" />
        <span key={collected} className="digit-tick tabular-nums">
          {collected}
        </span>
      </div>

      {/* logro */}
      {milestone && (
        <div
          key={milestone.k}
          className="card-enter fixed bottom-16 left-1/2 -translate-x-1/2 z-[80] max-w-[86vw] text-center rounded-full border border-pink-300/30 bg-pink-400/15 backdrop-blur px-5 py-2.5 text-sm text-pink-100 shadow-xl"
        >
          {milestone.text}
        </div>
      )}
    </div>
  )
}
