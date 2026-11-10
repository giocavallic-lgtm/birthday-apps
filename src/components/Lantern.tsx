import { useEffect } from 'react'

/** Linterna voladora que sube al cielo con un deseo escrito dentro. */
export default function Lantern({ text, onDone }: { text: string; onDone: () => void }) {
  const dur = 12 + Math.random() * 3

  useEffect(() => {
    const t = setTimeout(onDone, dur * 1000 + 300)
    return () => clearTimeout(t)
  }, [dur, onDone])

  return (
    <div
      className="fixed top-full z-[62] pointer-events-none"
      style={{
        left: `${15 + Math.random() * 70}%`,
        animation: `lanternRise ${dur}s linear forwards`,
      }}
      aria-hidden="true"
    >
      <div style={{ animation: `swayX ${3 + Math.random() * 2}s ease-in-out infinite alternate` }}>
        <div className="relative w-20 h-28 rounded-t-2xl rounded-b-xl bg-gradient-to-b from-amber-100 via-amber-300 to-orange-400/90 shadow-[0_0_45px_14px_rgba(251,191,36,0.35)] animate-pulse-soft">
          <div className="absolute inset-x-1 top-1.5 h-2 rounded-full bg-orange-200/60" />
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-yellow-50 blur-[2px] animate-pulse-soft" />
          {text && (
            <p className="absolute inset-x-2 top-6 text-center font-hand text-[11px] leading-tight text-orange-950/70 break-words">
              {text}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
