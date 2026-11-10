import { Heart } from 'lucide-react'

const FLOATING_HEARTS = [
  { left: '8%', size: 22, duration: 15, delay: 0 },
  { left: '22%', size: 14, duration: 19, delay: 3 },
  { left: '45%', size: 28, duration: 17, delay: 6 },
  { left: '63%', size: 16, duration: 21, delay: 1 },
  { left: '78%', size: 20, duration: 16, delay: 8 },
  { left: '92%', size: 13, duration: 20, delay: 4 },
]

export default function Backdrop() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Blobs de color */}
      <div className="animate-float absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-pink-500/15 blur-3xl" />
      <div className="animate-float-2 absolute bottom-1/4 right-[12%] w-56 h-56 rounded-full bg-purple-500/15 blur-3xl" />
      <div
        className="animate-float absolute top-1/3 left-[10%] w-44 h-44 rounded-full bg-blue-500/10 blur-3xl"
        style={{ animationDelay: '2s' }}
      />

      {/* Corazones ascendiendo */}
      {FLOATING_HEARTS.map((h, i) => (
        <Heart
          key={i}
          className="heart-float absolute text-pink-400/25"
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
