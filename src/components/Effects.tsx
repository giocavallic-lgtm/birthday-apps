import { useEffect, useRef } from 'react'
import { onBurst } from '../effects'

const COLORS = ['#f472b6', '#fb7185', '#c084fc', '#a78bfa', '#60a5fa', '#fbbf24', '#f9a8d4', '#fff1f2']
const PINKS = ['#f472b6', '#fb7185', '#f9a8d4']
const SPARKS = ['#fff1f2', '#f9a8d4', '#f472b6', '#fde68a', '#ffffff']

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rot: number
  vr: number
  shape: 'rect' | 'circle' | 'heart'
  gravity: number
  sway: number
  phase: number
  life: number
  maxLife: number
  rise: boolean
}

function drawHeart(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath()
  ctx.moveTo(0, s * 0.9)
  ctx.bezierCurveTo(-s * 1.1, s * 0.2, -s * 0.9, -s * 0.9, 0, -s * 0.35)
  ctx.bezierCurveTo(s * 0.9, -s * 0.9, s * 1.1, s * 0.2, 0, s * 0.9)
  ctx.closePath()
}

export default function Effects() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: Particle[] = []
    let raf = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const off = onBurst((b) => {
      // Chispitas diminutas para el rastro del cursor
      if (b.tiny) {
        const count = b.count ?? 2
        for (let i = 0; i < count; i++) {
          particles.push({
            x: cx + (Math.random() - 0.5) * 8,
            y: cy + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 0.7,
            vy: -0.2 - Math.random() * 0.5,
            size: 1.8 + Math.random() * 2.6,
            color: SPARKS[Math.floor(Math.random() * SPARKS.length)],
            rot: 0,
            vr: 0,
            shape: Math.random() > 0.55 ? 'circle' : 'heart',
            gravity: -0.004,
            sway: 0.15,
            phase: Math.random() * Math.PI * 2,
            life: 0,
            maxLife: 38 + Math.random() * 22,
            rise: true,
          })
        }
        particles = particles.slice(-700)
        return
      }

      const count = b.count ?? (b.hearts ? 14 : 160)
      const cx = b.x ?? window.innerWidth / 2
      const cy = b.y ?? window.innerHeight * 0.35
      const extra: Particle[] = []

      for (let i = 0; i < count; i++) {
        if (b.hearts) {
          extra.push({
            x: cx + (Math.random() - 0.5) * 30,
            y: cy + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 1.4,
            vy: -(1.2 + Math.random() * 2.2),
            size: 8 + Math.random() * 12,
            color: PINKS[Math.floor(Math.random() * PINKS.length)],
            rot: (Math.random() - 0.5) * 0.4,
            vr: 0,
            shape: 'heart',
            gravity: -0.006,
            sway: 0.5 + Math.random() * 0.6,
            phase: Math.random() * Math.PI * 2,
            life: 0,
            maxLife: 90 + Math.random() * 50,
            rise: true,
          })
        } else {
          const shapeRoll = Math.random()
          extra.push({
            x: cx + (Math.random() - 0.5) * 140,
            y: cy + (Math.random() - 0.5) * 40,
            vx: (Math.random() - 0.5) * 13,
            vy: -(4 + Math.random() * 10),
            size: 5 + Math.random() * 7,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rot: Math.random() * Math.PI * 2,
            vr: (Math.random() - 0.5) * 0.3,
            shape: shapeRoll < 0.55 ? 'rect' : shapeRoll < 0.78 ? 'circle' : 'heart',
            gravity: 0.3,
            sway: 0,
            phase: 0,
            life: 0,
            maxLife: 150 + Math.random() * 60,
            rise: false,
          })
        }
      }
      particles = particles.concat(extra).slice(-700)
    })

    const loop = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      particles = particles.filter((p) => {
        p.life++
        if (p.rise) {
          p.vy += p.gravity
          p.x += p.vx + Math.sin((p.phase += 0.07)) * p.sway
          p.y += p.vy
          p.rot += 0.01
        } else {
          p.vy += p.gravity
          p.vx *= 0.992
          p.x += p.vx
          p.y += p.vy
          p.rot += p.vr
        }

        const t = p.life / p.maxLife
        const alpha = t < 0.75 ? 1 : 1 - (t - 0.75) / 0.25
        if (alpha <= 0 || p.y > h + 40) return false

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = Math.max(0, alpha)
        ctx.fillStyle = p.color
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.55)
        } else if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          drawHeart(ctx, p.size / 2)
          ctx.fill()
        }
        ctx.restore()
        return true
      })

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      off()
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="fixed inset-0 z-[70] pointer-events-none" aria-hidden="true" />
}
