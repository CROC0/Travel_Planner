'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  digits?: number;
  className?: string;
}

export function AnimatedNumber({ value, digits = 2, className }: AnimatedNumberProps) {
  const padded = String(value).padStart(digits, '0');
  const prevRef = useRef(padded);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (prevRef.current !== padded) {
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 300);
      prevRef.current = padded;
      return () => clearTimeout(t);
    }
  }, [padded]);

  return (
    <span
      className={cn(
        'inline-block tabular-nums transition-all duration-200',
        animating && 'animate-[digit-flip_0.3s_ease-in-out]',
        className
      )}
    >
      {padded}
    </span>
  );
}
