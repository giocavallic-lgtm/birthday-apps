/** Videomarcador LED del estadio: texto amarillo brillante que corre. */
export default function Scoreboard({ text, k }: { text: string; k: number }) {
  const unit = `★ ${text} ★  `
  return (
    <div className="card-enter relative mx-auto flex w-full max-w-[62vw] sm:max-w-md items-center overflow-hidden rounded-lg border-2 border-white/15 bg-black/70 px-3 py-2 shadow-[0_0_28px_rgba(56,189,248,0.18)]">
      {/* scanlines de pantalla */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-30 bg-[repeating-linear-gradient(0deg,transparent_0_2px,rgba(0,0,0,0.85)_2px_3px)]" />
      <span key={k} className="led-scroll whitespace-nowrap font-display text-base sm:text-lg tracking-[0.25em]">
        {unit.repeat(4)}
      </span>
    </div>
  )
}
