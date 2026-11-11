import { useEffect, useRef } from 'react'
import { fireBurst } from '../effects'

/**
 * Rastro de chispitas que sigue al cursor / dedo por toda la app.
 */
export default function SparkleTrail() {
  const last = useRef(0)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      if (now - last.current < 55) return
      last.current = now
      fireBurst({ x: e.clientX, y: e.clientY, tiny: true, count: 2 })
    }

    const onDown = (e: PointerEvent) => {
      fireBurst({ x: e.clientX, y: e.clientY, tiny: true, count: 7 })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return null
}
