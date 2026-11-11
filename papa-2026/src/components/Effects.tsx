import { useEffect, useRef } from 'react'
import { onBurst } from '../effects'

const COLORS = ['#7dd3fc', '#38bdf8', '#0ea5e9', '#bae6fd', '#ffffff', '#e0f2fe', '#fbbf24', '#fde68a']
const CELESTES = ['#7dd3fc', '#38bdf8', '#bae6fd']
const SPARKS = ['#e0f2fe', '#bae6fd', '#38bdf8', '#fde68a', '#ffffff']
const FW_COLORS = ['#fff7cc', '#fde68a', '#fbbf24', '#ffffff', '#7dd3fc', '#38bdf8', '#bae6fd']

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rot: number
  vr: number
  shape: 'rect' | 'circle' | 'heart' | 'ball'
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

/** Pelotita de fútbol: blanca con pentágono oscuro al centro. */
function drawBall(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath()
  ctx.arc(0, 0, s, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5
    const r = s * 0.45
    if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
    else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  ctx.closePath()
  ctx.fillStyle = '#0f172a'
  ctx.fill()
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
      const cx = b.x ?? window.innerWidth / 2
      const cy = b.y ?? window.innerHeight * 0.35

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
            shape: Math.random() > 0.55 ? 'circle' : 'ball',
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

      // fuego artificial: estela que sube y explota un poquito más arriba
      if (b.firework) {
        const fx = cx
        const fy = cy
        for (let i = 0; i < 12; i++) {
          particles.push({
            x: fx + (Math.random() - 0.5) * 4,
            y: fy + Math.random() * 10,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -(6 + Math.random() * 3),
            size: 1.4 + Math.random() * 1.4,
            color: Math.random() > 0.4 ? '#fff7cc' : '#fde68a',
            rot: 0,
            vr: 0,
            shape: 'circle',
            gravity: 0.26,
            sway: 0,
            phase: 0,
            life: 0,
            maxLife: 14 + Math.random() * 8,
            rise: false,
          })
        }
        const peak = Math.max(50, fy - (60 + Math.random() * 70))
        window.setTimeout(() => {
          const n = b.count ?? 90
          const extra: Particle[] = []
          for (let i = 0; i < n; i++) {
            const ang = Math.random() * Math.PI * 2
            const sp = 1.8 + Math.random() * 2.2
            extra.push({
              x: fx + (Math.random() - 0.5) * 4,
              y: peak,
              vx: Math.cos(ang) * sp,
              vy: Math.sin(ang) * sp,
              size: 2 + Math.random() * 2.2,
              color: FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)],
              rot: 0,
              vr: (Math.random() - 0.5) * 0.2,
              shape: Math.random() < 0.18 ? 'ball' : 'circle',
              gravity: 0.035,
              sway: 0,
              phase: 0,
              life: 0,
              maxLife: 55 + Math.random() * 30,
              rise: false,
            })
          }
          particles = particles.concat(extra).slice(-900)
        }, 240)
        return
      }

      const count = b.count ?? (b.hearts ? 14 : 160)
      const extra: Particle[] = []

      for (let i = 0; i < count; i++) {
        if (b.hearts) {
          // ráfaga de pelotitas que flotan hacia arriba
          extra.push({
            x: cx + (Math.random() - 0.5) * 30,
            y: cy + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 1.4,
            vy: -(1.2 + Math.random() * 2.2),
            size: 8 + Math.random() * 12,
            color: CELESTES[Math.floor(Math.random() * CELESTES.length)],
            rot: 0,
            vr: (Math.random() - 0.5) * 0.12,
            shape: 'ball',
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
            shape:
              shapeRoll < 0.5 ? 'rect' : shapeRoll < 0.75 ? 'circle' : shapeRoll < 0.9 ? 'ball' : 'heart',
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
        } else if (p.shape === 'ball') {
          drawBall(ctx, p.size / 2)
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
