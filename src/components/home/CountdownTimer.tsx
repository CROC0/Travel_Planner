'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 glass rounded-xl sm:rounded-2xl flex items-center justify-center box-glow-teal">
        <AnimatedNumber
          value={value}
          digits={2}
          className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#00e5cc] neon-glow-teal tabular-nums"
        />
      </div>
      <span className="text-[#8888aa] text-[10px] sm:text-xs md:text-sm font-medium tracking-widest uppercase mt-1.5 sm:mt-2">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <div className="flex flex-col gap-1.5 items-center pb-5 sm:pb-6">
      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#00e5cc] opacity-60" />
      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#00e5cc] opacity-60" />
    </div>
  );
}

export function CountdownTimer() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown();

  if (isExpired) {
    return (
      <div className="text-center">
        <p className="text-3xl font-bold text-[#ffd700] neon-glow-gold">🦁 We&apos;re in Singapore!</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 justify-center">
      <Unit value={days} label="Days" />
      <Separator />
      <Unit value={hours} label="Hours" />
      <Separator />
      <Unit value={minutes} label="Mins" />
      <Separator />
      <Unit value={seconds} label="Secs" />
    </div>
  );
}
