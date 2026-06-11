'use client';

import { useEffect, useState } from 'react';
import type { CountdownValues } from '@/types';

function calculate(target: Date): CountdownValues {
  if (typeof window === 'undefined') {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
  }
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, isExpired: false };
}

export function useCountdown(target: Date): CountdownValues {
  const [values, setValues] = useState<CountdownValues>({
    days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false,
  });

  useEffect(() => {
    setValues(calculate(target));
    const timer = setInterval(() => setValues(calculate(target)), 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.getTime()]);

  return values;
}
