import { useEffect, useRef, useState } from 'react'
import { Music, MailOpen } from 'lucide-react'
import Cake from './Cake'
import Serpentinas from './Serpentinas'
import PaniniCards from './PaniniCards'
import Scoreboard from './Scoreboard'
import { fireBurst } from '../effects'
import { startMusic, toggleMusic } from '../music'

const DEFAULT_LED = 'FELIZ CUMPLE PAPÁ ⚽ 12.11'

const LETTER = `Papá:

Hoy no hay clásico, ni copa, ni estadio lleno… pero igual es el día más grande del año: el día que llegó a esta cancha el mejor refuerzo de la familia. Vos.

Gracias por cada pase de gol que me diste en la vida, por enseñarme a levantarme cada vez que el piso me tiraba, y por festejar mis goles como si fueran de una final del mundo.

Si la vida es una cancha, vos sos el capitán: el que marca el ritmo, el que corre por todos, el que se pone el equipo al hombro cuando nadie más puede.

No importa cuántos años pasen ni cuántos partidos se nos escapen: yo siempre voy a estar en tu tribuna, alentándote.

Feliz cumpleaños, viejo. Que este año sea uno de títulos.

Te quiere,
tu hijo`

function Letter({ onClose }: { onClose: () => void }) {
  const [chars, setChars] = useState(0)
  const paperRef = useRef<HTMLDivElement>(null)
  const done = chars >= LETTER.length

  useEffect(() => {
    if (done) return
    const t = setTimeout(() => setChars((v) => v + 1), 26)
    return () => clearTimeout(t)
  }, [chars, done])

  // en pantallas pequeñas, sigue el texto mientras se escribe
  useEffect(() => {
    const el = paperRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [chars])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={paperRef}
        className="card-enter relative w-full max-w-lg max-h-[85dvh] overflow-y-auto rounded-3xl border border-amber-100/60 bg-[#fdf8ee] p-6 sm:p-9 shadow-2xl cursor-pointer"
        onClick={(e) => {
          e.stopPropagation()
          setChars(LETTER.length)
        }}
      >
        {/* sello */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-yellow-600 flex items-center justify-center ring-4 ring-amber-400/30 shadow-lg">
          <span className="text-xl leading-none select-none">⚽</span>
        </div>

        <h2 className="font-hand text-4xl sm:text-5xl text-center mt-3 text-sky-700">Para vos, papá</h2>

        <p className="mt-5 whitespace-pre-line font-hand text-xl sm:text-2xl leading-snug text-stone-700">
          {LETTER.slice(0, chars)}
          {!done && <span className="caret" />}
        </p>

        {done && (
          <p className="mt-6 text-right font-hand text-2xl text-sky-600">
            te banca siempre, tu hijo ⚽💙
          </p>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 px-6 py-3 text-white font-semibold shadow-lg shadow-sky-500/25 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          Guardar la carta ⚽
        </button>
        <p className="mt-2.5 text-center text-[11px] text-stone-400">
          (tocá la carta para leerla completa al instante)
        </p>
      </div>
    </div>
  )
}

export default function BirthdayScreen() {
  const [letterOpen, setLetterOpen] = useState(false)
  const [wishShown, setWishShown] = useState(false)
  const [cakeKey, setCakeKey] = useState(0)
  const [musicOn, setMusicOn] = useState(false)
  const [wish, setWish] = useState('')
  const [led, setLed] = useState({ text: DEFAULT_LED, k: 0 })
  const musicStarted = useRef(false)
  const ledTimer = useRef<number | null>(null)

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

  // la música empieza sola con el primer toque (el navegador lo exige así)
  // y tocar el cielo lanza un fuego artificial
  const onRootTap = (e: React.MouseEvent) => {
    if (!musicStarted.current) {
      musicStarted.current = true
      setMusicOn(true)
      startMusic()
    }
    const el = e.target as HTMLElement
    if (!el.closest('button, input, a, textarea')) {
      fireBurst({ x: e.clientX, y: e.clientY, firework: true })
    }
  }

  const toggleMusicBtn = () => {
    musicStarted.current = true
    setMusicOn(toggleMusic())
  }

  /** El deseo se enciende en el videomarcador del estadio. */
  const sendWish = () => {
    const text = wish.trim().slice(0, 60)
    if (!text) return
    setLed({ text: `TU DESEO: ${text.toUpperCase()}`, k: Date.now() })
    setWish('')
    fireBurst({ x: window.innerWidth / 2, y: window.innerHeight * 0.42, count: 150 })
    setTimeout(() => fireBurst({ x: window.innerWidth * 0.25, y: window.innerHeight * 0.5, count: 80 }), 250)
    setTimeout(() => fireBurst({ x: window.innerWidth * 0.75, y: window.innerHeight * 0.5, count: 80 }), 450)
    if (ledTimer.current) clearTimeout(ledTimer.current)
    ledTimer.current = window.setTimeout(() => {
      setLed({ text: DEFAULT_LED, k: Date.now() })
    }, 16000)
  }

  return (
    <div
      onClick={onRootTap}
      className="relative z-10 min-h-dvh flex flex-col items-center gap-8 sm:gap-14 px-4 py-10 sm:py-14 text-center"
    >
      <Serpentinas />

      {/* música */}
      <button
        onClick={toggleMusicBtn}
        aria-label="Música de cajita"
        className={`fixed top-3 right-3 z-[70] flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold backdrop-blur shadow-lg cursor-pointer ${
          musicOn
            ? 'border-amber-300/40 bg-amber-300/15 text-amber-200 animate-pulse-soft'
            : 'border-white/15 bg-white/5 text-zinc-300'
        }`}
      >
        <Music className="w-3.5 h-3.5" />
        {musicOn ? 'Sonando ♫' : 'Música ♫'}
      </button>

      {/* videomarcador del estadio */}
      <Scoreboard text={led.text} k={led.k} />

      {/* título */}
      <div className="card-enter" style={{ animationDelay: '120ms' }}>
        <h1 className="font-display text-7xl sm:text-8xl md:text-9xl leading-[0.92] tracking-wide bg-gradient-to-r from-sky-200 via-sky-300 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
          ¡Feliz Cumple
          <br />
          Papá!
        </h1>
        <p className="mt-3 text-zinc-300/90 text-base sm:text-lg font-hand text-xl sm:text-2xl">
          Hoy saca la cancha el capitán de esta familia ⚽💙
        </p>
      </div>

      {/* torta */}
      <section
        className="card-enter flex flex-col items-center gap-5"
        style={{ animationDelay: '260ms' }}
      >
        <h2 className="font-hand text-3xl sm:text-4xl text-zinc-200">
          Soplá las velitas y pedí un deseo 🕯️
        </h2>
        <p className="-mt-3 text-xs text-zinc-400">(tocá cada velita)</p>

        <Cake key={cakeKey} onAllOut={allCandlesOut} />

        {wishShown && (
          <div className="card-enter flex flex-col items-center gap-4">
            <p className="font-display text-4xl sm:text-5xl tracking-wide bg-gradient-to-r from-sky-200 to-blue-300 bg-clip-text text-transparent">
              Pedí un deseo, capitán
            </p>
            <p className="font-hand text-xl text-zinc-300">…y se enciende en el videomarcador 🏟️</p>

            <div className="card-enter flex w-full max-w-md flex-col gap-2.5 px-2">
              <div className="flex w-full items-center gap-2">
                <input
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendWish()
                  }}
                  maxLength={60}
                  placeholder="escribí tu deseo…"
                  aria-label="Escribí tu deseo"
                  className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/10 backdrop-blur px-5 py-3 font-hand text-lg text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-sky-300/40"
                />
                <button
                  onClick={sendWish}
                  className="shrink-0 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Al marcador 🏟️
                </button>
              </div>
              <p className="text-xs text-zinc-500">se ilumina el videomarcador del estadio ⚽</p>
            </div>

            <button
              onClick={relight}
              className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm text-zinc-200 backdrop-blur transition-transform hover:scale-105 cursor-pointer"
            >
              Volver a encender 🕯️
            </button>
          </div>
        )}
      </section>

      {/* figuritas */}
      <PaniniCards />

      {/* carta */}
      <section className="card-enter w-full max-w-lg" style={{ animationDelay: '1.2s' }}>
        <button
          onClick={() => {
            setLetterOpen(true)
            fireBurst({ hearts: true, count: 24, y: window.innerHeight * 0.5 })
          }}
          className="group w-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 px-8 py-4 font-semibold text-lg text-white shadow-xl shadow-sky-500/25 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
        >
          <span className="inline-flex items-center gap-2.5">
            <MailOpen className="w-5 h-5 transition-transform group-hover:rotate-6" />
            Abrir tu carta
          </span>
        </button>
      </section>

      <p className="text-sm text-zinc-400 pb-4">Hecho de hijo a padre, con todo el corazón ⚽💙</p>

      {letterOpen && <Letter onClose={() => setLetterOpen(false)} />}
    </div>
  )
}
