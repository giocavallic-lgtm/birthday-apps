import { useEffect, useState } from 'react'
import Effects from './components/Effects'
import Backdrop from './components/Backdrop'
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

export default function App() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(i)
  }, [])

  // ?preview fuerza la vista de cumpleaños (para comprobar cómo se verá)
  const preview = new URLSearchParams(window.location.search).has('preview')
  const unlocked = preview || isBirthday(now)

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#17101f] via-[#221531] to-[#2e1a3f] text-zinc-100 font-sans">
      <Backdrop />
      <Effects />
      {unlocked ? <BirthdayScreen /> : <LockScreen now={now} unlocksAt={nextUnlock(now)} />}
    </div>
  )
}
