'use client';

import { cn } from '@/lib/utils';

interface CategoryFilterProps<T extends string> {
  options: { value: T | 'all'; label: string }[];
  active: T | 'all';
  onChange: (v: T | 'all') => void;
}

export function CategoryFilter<T extends string>({ options, active, onChange }: CategoryFilterProps<T>) {
  return (
    <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
      {options.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            'px-3 sm:px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 min-h-[36px]',
            active === value
              ? 'bg-[#00e5cc] text-[#0a0a0f]'
              : 'glass text-[#8888aa] hover:text-white hover:border-[#00e5cc]/30',
          )}
          style={active !== value ? { border: '1px solid rgba(255,255,255,0.1)' } : {}}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
