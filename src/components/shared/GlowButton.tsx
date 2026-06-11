'use client';

import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'teal' | 'gold' | 'pink' | 'ghost';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
}

const styles: Record<Variant, string> = {
  teal: 'bg-[#00e5cc] text-[#0a0a0f] hover:brightness-110 shadow-[0_0_20px_#00e5cc44] hover:shadow-[0_0_30px_#00e5cc66]',
  gold: 'bg-[#ffd700] text-[#0a0a0f] hover:brightness-110 shadow-[0_0_20px_#ffd70044] hover:shadow-[0_0_30px_#ffd70066]',
  pink: 'bg-[#ff6eb4] text-[#0a0a0f] hover:brightness-110 shadow-[0_0_20px_#ff6eb444] hover:shadow-[0_0_30px_#ff6eb466]',
  ghost: 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-[#00e5cc]/40',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

export function GlowButton({ variant = 'teal', size = 'md', className, children, ...props }: GlowButtonProps) {
  return (
    <button
      className={cn(
        'font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed',
        styles[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
