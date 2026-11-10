export interface BurstOptions {
  x?: number
  y?: number
  count?: number
  hearts?: boolean
}

type Listener = (b: BurstOptions) => void

const listeners = new Set<Listener>()

/** Dispara confeti (o corazones) en cualquier parte de la app. */
export function fireBurst(opts: BurstOptions = {}) {
  listeners.forEach((l) => l(opts))
}

export function onBurst(fn: Listener) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
