import { CountdownTimer } from './CountdownTimer';

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden aurora-bg">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,229,204,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,204,0.8) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Radial glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-[#00e5cc]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-[#ffd700]/08 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-[#ff6eb4]/06 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center px-4 space-y-6 sm:space-y-8">
        {/* Pre-title */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-[#8888aa]">
          <span className="w-2 h-2 rounded-full bg-[#00e5cc] animate-[glow-pulse_2s_ease-in-out_infinite]" />
          Taylor Family · 25 Sep – 4 Oct 2026
        </div>

        {/* Main title */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight">
            <span className="shimmer-text">SINGAPORE</span>
          </h1>
        </div>

        {/* Countdown */}
        <div className="pt-2 sm:pt-4">
          <p className="text-[#8888aa] text-xs tracking-widest uppercase mb-4 sm:mb-6">Departure in</p>
          <CountdownTimer target={new Date('2026-09-25T00:00:00+08:00')} expiredMessage="🦁 We're in Singapore!" />
        </div>

        {/* Scroll cue */}
        <div className="pt-4 sm:pt-8 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[#8888aa] text-xs">scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#8888aa] to-transparent" />
        </div>
      </div>
    </section>
  );
}
