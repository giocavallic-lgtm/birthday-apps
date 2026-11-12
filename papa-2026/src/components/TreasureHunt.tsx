import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { fireBurst } from '../effects'

const STEP_KEY = 'papa-hunt-step'
const DONE_KEY = 'papa-hunt-done'

interface Trap {
  match: string[]
  joke: string
}

interface Step {
  trail: string
  riddle: string
  /** respuestas válidas, ya normalizadas (sin acentos) */
  keys: string[]
  /** pifias con broma propia */
  traps: Trap[]
  /** mensaje del árbitro cuando no coincide con ninguna trampa */
  hint: string
  success: string
}

const STEPS: Step[] = [
  {
    trail: '🍳 Cocina',
    riddle: `Arranca el partido, capitán.
La primera parada es una cancha
donde la heladera ataja el calor
y el microondas saca el entretiempo.
¿Adónde vas?`,
    keys: ['cocina', 'heladera', 'nevera', 'microondas'],
    traps: [
      {
        match: ['bano', 'banio', 'wc', 'ducha', 'inodoro'],
        joke: '¿Ya querés ir al baño? 😂 Tranquilo, viejo, el partido recién arranca. Acá solo hay agua y jabón.',
      },
      {
        match: ['salon', 'sala', 'living', 'sofa', 'tele'],
        joke: '¿A mirar la tele tan temprano? 😌 La pista habla de frío y entretiempo… pensá, pensá.',
      },
    ],
    hint: '🟨 ¡Uy! Ahí no es, capitán. Releé la pista: habla de frío, heladera y entretiempo.',
    success: `¿Fuiste a la heladera pensando que el regalo estaba ahí? 😏 Frío, frío, papá. Acá solo hay comida. Regalo encontrado: ninguno.`,
  },
  {
    trail: '🛋️ Salón',
    riddle: `Segunda jugada, esta es de visitante:
la cancha donde la banca es un sofá,
donde se gritan los goles por la tele
y se celebra con control remoto en mano.
¿Adónde vas?`,
    keys: ['salon', 'sala', 'living', 'sofa', 'tele'],
    traps: [
      {
        match: ['cocina', 'heladera', 'nevera', 'microondas'],
        joke: '¿Otra vez a la cocina? 🤣 Ya revisaste esa cancha, capitán. Mirá la pista otra vez.',
      },
      {
        match: ['habitacion', 'cuarto', 'pieza', 'dormitorio', 'cama'],
        joke: '¿A dormir? ¡Ni en tus sueños! 😂 La pista habla de sillones, no de sábanas.',
      },
    ],
    hint: '🟨 Esa no era, crack. La pista habla de sofá, tele y control remoto.',
    success: `¿Levantaste los almohadones del sofá? 🤣 ¡No está! Igual vas haciendo un lindo recorrido, capitán.`,
  },
  {
    trail: '🚪 Pasillo',
    riddle: `Tercera pista, y esta tiene doble filo:
es el que une todas las canchas de la casa,
por él se corre cuando hay gol,
pero nadie lo pone nunca en la formación.
¿Adónde vas?`,
    keys: ['pasillo', 'corredor', 'hall'],
    traps: [
      {
        match: ['bano', 'banio', 'wc', 'ducha', 'inodoro'],
        joke: '🟨 ¡Camaaon! 🤣 ¿Todo bien, papá? Acá solo hay agua y jabón. La pista habla del que UNE las habitaciones, no del que tira la cadena.',
      },
      {
        match: ['cocina', 'heladera', 'nevera'],
        joke: '¿Otra vez la cocina? 😂 Ya estuvo ahí, crack. Releé la pista: une todas las canchas…',
      },
    ],
    hint: '🟨 ¡Casi! Pensá: es el que conecta todas las habitaciones de la casa…',
    success: `Buen pase por el mediocampo… pero el regalo no corre por acá. (¿Ya miraste el baño otra vez? Es broma. No lo mires.)`,
  },
  {
    trail: '🦁 Habitación del enano',
    riddle: `Cuarta pista, se viene el clásico familiar:
buscá el vestuario del más chico del plantel,
el que comparte contigo partidos y tele,
el crack que todavía entrena la gambeta.
¿De quién es la puerta?`,
    keys: ['leo', 'enano', 'peque', 'chico', 'menor'],
    traps: [
      {
        match: ['mayor'],
        joke: '¿El mayor? 😏 Todavía no. La pista habla del más chico del plantel.',
      },
      {
        match: ['habitacion', 'cuarto', 'pieza', 'dormitorio'],
        joke: '¿Esa puerta? 😏 No, capitán. Releé: buscamos al más chico del plantel.',
      },
    ],
    hint: '🟨 Esa puerta no, capitán. La pista habla del más chico de la casa.',
    success: `¿Creíste que el enano te escondía el regalo? 😂 Si apenas ordena su ropa. Estás más cerca… pero no acá.`,
  },
  {
    trail: '👑 Tu habitación',
    riddle: `Quinta pista, ya se huele la final:
buscá el vestuario del director técnico.
Sí, ese donde dormís vos,
el que maneja este equipo desde hace años
sin pedir nunca un cambio.
¿Adónde vas?`,
    keys: [
      'tu habitacion',
      'tu cuarto',
      'tu pieza',
      'tu dormitorio',
      'mi habitacion',
      'mi cuarto',
      'mi pieza',
      'la tuya',
      'tus padres',
      'tus viejos',
      'padres',
    ],
    traps: [
      {
        match: ['bano', 'banio', 'wc', 'ducha', 'inodoro'],
        joke: '🟨 ¡Otra vez el baño! 🤣 Te prometo que el tesoro nunca estuvo ahí. (Lo revisé dos veces.)',
      },
      {
        match: ['mayor'],
        joke: '¿La del mayor? 😏 Esa es la de tu hijo. Acá la pista habla de vos, capitán.',
      },
    ],
    hint: '🟨 Esa no es, DT. La pista dice que es donde dormís vos.',
    success: `¿Miraste debajo de tu propia cama? 🤣 Los campeones no esconden ahí. Aguanta una pista más, que ya casi estás.`,
  },
  {
    trail: '🛏️ Habitación del mayor',
    riddle: `Última pista, la del campeonato:
el escondite está en el vestuario
del mayor de los dos pibes de esta casa,
el que te hizo esta web.
Ahí adentro te toca a vos, capitán:
buscá donde la ropa hace la alineación.
¿Adónde corrés?`,
    keys: ['mayor', 'hijo mayor', 'tu hijo', 'hijo'],
    traps: [
      {
        match: ['bano', 'banio', 'wc', 'ducha', 'inodoro'],
        joke: 'PAPÁ. 😂 Si volvés a mirar dentro del baño te saco tarjeta roja y te expulso del cumple.',
      },
      {
        match: ['salon', 'sala', 'living', 'sofa', 'tele'],
        joke: '¿Otra vez el sillón? 🤣 ¡Ya casi estás! No te enfríes ahora, capitán.',
      },
    ],
    hint: '🟨 Casi, capitán. La pista habla del mayor de los dos pibes de la casa…',
    success: `¡ÚLTIMA PARADA!`,
  },
]

/** minúsculas, sin acentos ni signos, para comparar lo que escribe */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function loadStep(): number {
  try {
    const v = parseInt(localStorage.getItem(STEP_KEY) || '0', 10)
    return Number.isFinite(v) ? Math.min(STEPS.length - 1, Math.max(0, v)) : 0
  } catch {
    return 0
  }
}

function loadDone(): boolean {
  try {
    return localStorage.getItem(DONE_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * La búsqueda del tesoro del capitán: 6 pistas en verso por toda la casa,
 * con caminos falsos al baño y un final que él mismo tiene que descubrir.
 */
export default function TreasureHunt({ onDone, onClose }: { onDone: () => void; onClose: () => void }) {
  const [done, setDone] = useState(loadDone)
  const [step, setStep] = useState(loadStep)
  const [started, setStarted] = useState(() => loadStep() > 0)
  const [wrong, setWrong] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [answer, setAnswer] = useState('')

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  // cuando se llega al final: explosión de gooooool
  useEffect(() => {
    if (!done) return
    const w = window.innerWidth
    const h = window.innerHeight
    fireBurst({ count: 260 })
    const t1 = setTimeout(() => fireBurst({ x: w * 0.2, y: h * 0.35, firework: true }), 400)
    const t2 = setTimeout(() => fireBurst({ x: w * 0.8, y: h * 0.3, firework: true }), 800)
    const t3 = setTimeout(() => fireBurst({ x: w * 0.5, y: h * 0.2, firework: true }), 1300)
    const t4 = setTimeout(() => fireBurst({ x: w * 0.35, y: h * 0.45, count: 120 }), 1700)
    const t5 = setTimeout(() => fireBurst({ x: w * 0.65, y: h * 0.45, count: 120 }), 2000)
    return () => {
      ;[t1, t2, t3, t4, t5].forEach(clearTimeout)
    }
  }, [done])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (success) return
    const n = norm(answer)
    if (!n) return
    if (current.keys.some((k) => n.includes(k))) {
      setWrong(null)
      setSuccess(true)
      setAnswer('')
      fireBurst({ hearts: true, count: 24, y: window.innerHeight * 0.45 })
      fireBurst({ count: 45, y: window.innerHeight * 0.4 })
    } else {
      const trap = current.traps.find((t) => t.match.some((m) => n.includes(m)))
      setWrong(trap ? trap.joke : current.hint)
      setAnswer('')
      fireBurst({ tiny: true, count: 12, y: window.innerHeight * 0.4 })
    }
  }

  const next = () => {
    if (isLast) {
      try {
        localStorage.setItem(DONE_KEY, '1')
      } catch {
        /* sin almacenamiento no pasa nada */
      }
      setDone(true)
      onDone()
    } else {
      const s = step + 1
      setStep(s)
      setSuccess(false)
      setWrong(null)
      try {
        localStorage.setItem(STEP_KEY, String(s))
      } catch {
        /* idem */
      }
    }
  }

  const start = () => {
    setStarted(true)
    fireBurst({ hearts: true, count: 20, y: window.innerHeight * 0.5 })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label="Cerrar la búsqueda"
        className="absolute top-3 right-3 z-10 rounded-full border border-white/15 bg-white/5 p-2.5 text-zinc-300 backdrop-blur cursor-pointer hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </button>

      <div
        className="card-enter w-full max-w-md max-h-[88dvh] overflow-y-auto rounded-3xl border-2 border-emerald-200/15 bg-gradient-to-b from-emerald-950 to-[#071521] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== final: GOOOOL ===== */}
        {done ? (
          <div className="flex flex-col items-center gap-5 text-center py-6">
            <span className="text-7xl animate-float select-none">🏆</span>
            <h2 className="font-display text-6xl sm:text-7xl leading-none bg-gradient-to-r from-sky-200 via-sky-300 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
              ¡GOOOOOOL!
            </h2>
            <p className="font-hand text-2xl sm:text-3xl text-emerald-50 leading-snug">
              Descifraste el tesoro del capitán.
            </p>
            <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 px-5 py-4">
              <p className="font-hand text-xl sm:text-2xl text-amber-100 leading-snug">
                Está donde ya sabés…
                <br />
                y ahí adentro lo descubrís vos 😏
              </p>
              <p className="font-display text-3xl tracking-wide text-amber-200 mt-2">
                ¡A BUSCARLO, CAPITÁN! ⚽
              </p>
            </div>
            <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-200">
              📦 Regalos encontrados: 1/1 🏆
            </span>
            <button
              onClick={onClose}
              className="rounded-full bg-gradient-to-r from-sky-400 to-blue-500 px-8 py-3 font-semibold text-white shadow-lg shadow-sky-500/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Volver a la web ⚽
            </button>
          </div>
        ) : !started ? (
          /* ===== intro ===== */
          <div className="flex flex-col items-center gap-5 text-center py-4">
            <span className="text-6xl animate-float select-none">🗺️</span>
            <h2 className="font-display text-4xl sm:text-5xl tracking-wide text-emerald-50 leading-tight">
              La búsqueda del tesoro
              <br />
              del capitán
            </h2>
            <p className="font-hand text-2xl text-emerald-100/90 leading-snug">
              Hay un tesoro escondido en esta casa.
              <br />
              Leé cada pista, andá al lugar que creas
              <br />
              y escribí adónde llegaste.
              <br />
              Si la embocás, seguís. Si no… 🟨
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest">
              <span className="rounded-full border border-sky-300/25 bg-sky-400/10 px-3 py-1.5 text-sky-200">6 pistas</span>
              <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-amber-200">2 baños trampa</span>
              <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 text-emerald-200">1 final épico</span>
            </div>
            <p className="text-xs text-emerald-200/60">ojo con las trampas… 🟨</p>
            <button
              onClick={start}
              className="mt-1 rounded-full bg-gradient-to-r from-emerald-400 to-sky-500 px-8 py-3.5 font-semibold text-lg text-white shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Empezar la búsqueda 🏁
            </button>
          </div>
        ) : (
          /* ===== pista en juego ===== */
          <div className="flex flex-col items-center gap-5 text-center">
            {/* progreso */}
            <div className="flex flex-col items-center gap-2 w-full">
              <p className="font-display text-xl tracking-[0.3em] text-sky-300">
                PISTA {step + 1}/{STEPS.length}
              </p>
              <div className="flex items-center gap-1.5">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 rounded-full transition-all ${i < step ? 'w-2 bg-sky-300' : i === step ? 'w-6 bg-amber-300 animate-pulse-soft' : 'w-2 bg-white/15'}`}
                  />
                ))}
              </div>
              {/* recorrido */}
              {step > 0 && (
                <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-emerald-100/70">
                  {STEPS.slice(0, step).map((s, i) => (
                    <span key={i} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5">
                      {s.trail}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* pizarra táctica */}
            <div
              className="w-full rounded-2xl bg-black/30 px-5 py-6 sm:px-7"
              style={{ border: '2px dashed rgba(255,255,255,0.18)' }}
            >
              <p className="font-hand text-2xl sm:text-[1.7rem] leading-snug text-emerald-50 whitespace-pre-line text-left">
                {current.riddle}
              </p>
            </div>

            {/* tarjeta amarilla (trampa) */}
            {wrong && (
              <div
                key={wrong}
                className="shake w-full rounded-xl bg-amber-300 px-5 py-4 shadow-xl"
                style={{ transform: 'rotate(-1.5deg)' }}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-900/70">
                  🟨 Tarjeta amarilla
                </p>
                <p className="font-hand text-xl text-amber-950 leading-snug mt-1">{wrong}</p>
              </div>
            )}

            {/* parada conseguida */}
            {success ? (
              <div className="card-enter flex w-full flex-col items-center gap-4">
                <div className="w-full rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-5 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                    ✅ {isLast ? '¡Última parada conseguida!' : `Parada ${step + 1} conseguida`}
                  </p>
                  {!isLast && <p className="font-hand text-xl text-emerald-50 leading-snug mt-1">{current.success}</p>}
                </div>
                {!isLast && (
                  <span className="shake rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-amber-200">
                    📦 Regalos encontrados: 0/1 😏
                  </span>
                )}
                <button
                  onClick={next}
                  className="rounded-full bg-gradient-to-r from-emerald-400 to-sky-500 px-8 py-3.5 font-semibold text-lg text-white shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {isLast ? '¡Corré por el tesoro! 🎁' : 'Siguiente pista ➜'}
                </button>
              </div>
            ) : (
              /* respuesta libre: él tiene que adivinar el lugar */
              <form onSubmit={submit} className="flex w-full flex-col gap-2.5">
                <div className="flex w-full items-center gap-2">
                  <input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="escribí el lugar…"
                    aria-label="Escribí el lugar"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    maxLength={40}
                    className="min-w-0 flex-1 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 font-hand text-xl text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-sky-300/40"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    ¡Acá estoy!
                  </button>
                </div>
                <p className="text-[11px] text-emerald-200/50">
                  escribí adónde fuiste (el árbitro decide 🟨)
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
