/**
 * Caja de música: "Happy Birthday" (dominio público) sintetizada con Web Audio.
 * No usa archivos de audio; suena como una cajita musical suave.
 */

type NoteDef = [freq: number, startBeat: number, beats: number]

const G4 = 392.0
const A4 = 440.0
const B4 = 493.88
const C5 = 523.25
const D5 = 587.33
const E5 = 659.25
const F5 = 698.46
const G5 = 783.99

const MELODY: NoteDef[] = [
  [G4, 0, 0.5], [G4, 0.5, 0.5],
  [A4, 1, 1], [G4, 2, 1], [C5, 3, 1], [B4, 4, 2],
  [G4, 6, 0.5], [G4, 6.5, 0.5],
  [A4, 7, 1], [G4, 8, 1], [D5, 9, 1], [C5, 10, 2],
  [G4, 12, 0.5], [G4, 12.5, 0.5],
  [G5, 13, 1], [E5, 14, 1], [C5, 15, 1], [B4, 16, 1], [A4, 17, 2],
  [F5, 19, 0.5], [F5, 19.5, 0.5],
  [E5, 20, 1], [C5, 21, 1], [D5, 22, 1], [C5, 23, 2.5],
]

const BEAT = 0.42
const MELODY_BEATS = 25.5
const GAP = 3.4 // silencio entre vueltas

let ctx: AudioContext | null = null
let master: GainNode | null = null
let loopTimer: number | null = null
let playing = false

function playNote(freq: number, t0: number, dur: number) {
  const c = ctx
  const out = master
  if (!c || !out) return

  // voz principal: timbre de cajita musical
  const osc = c.createOscillator()
  osc.type = 'triangle'
  osc.frequency.value = freq

  // destello suave una octava arriba
  const osc2 = c.createOscillator()
  osc2.type = 'sine'
  osc2.frequency.value = freq * 2
  const g2 = c.createGain()
  g2.gain.value = 0.22

  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(0.22, t0 + 0.014)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + 0.55)

  osc.connect(g)
  osc2.connect(g2)
  g2.connect(g)
  g.connect(out)

  const end = t0 + dur + 0.6
  osc.start(t0)
  osc.stop(end)
  osc2.start(t0)
  osc2.stop(end)
}

function scheduleRound() {
  if (!ctx || !playing) return
  const t0 = ctx.currentTime + 0.12
  for (const [freq, startBeat, beats] of MELODY) {
    playNote(freq, t0 + startBeat * BEAT, beats * BEAT)
  }
  loopTimer = window.setTimeout(scheduleRound, (MELODY_BEATS * BEAT + GAP) * 1000)
}

/** Empieza a sonar la cajita (hace falta un toque previo, el navegador lo exige). */
export function startMusic() {
  if (playing) return
  if (!ctx || ctx.state === 'closed') {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0.5
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  playing = true
  scheduleRound()
}

/** Para la música y suelta el audio. */
export function stopMusic() {
  playing = false
  if (loopTimer !== null) {
    clearTimeout(loopTimer)
    loopTimer = null
  }
  const old = ctx
  ctx = null
  master = null
  if (old && old.state !== 'closed') void old.close()
}

/** Alterna la música. Devuelve si ahora está sonando. */
export function toggleMusic(): boolean {
  if (playing) {
    stopMusic()
    return false
  }
  startMusic()
  return true
}
