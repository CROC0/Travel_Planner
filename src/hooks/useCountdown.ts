'use client';

import { useEffect, useState } from 'react';
import type { CountdownValues } from '@/types';
import { DEPARTURE_DATE } from '@/data/trip-config';

function calculate(): CountdownValues {
  if (typeof window === 'undefined') {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
  }
  const diff = DEPARTURE_DATE.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, isExpired: false };
}

export function useCountdown(): CountdownValues {
  const [values, setValues] = useState<CountdownValues>({
    days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false,
  });

  useEffect(() => {
    setValues(calculate());
    const timer = setInterval(() => setValues(calculate()), 1000);
    return () => clearInterval(timer);
  }, []);

  return values;
}
