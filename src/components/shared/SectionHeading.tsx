import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  accent?: 'teal' | 'gold' | 'pink';
  symbol?: string;
  className?: string;
  center?: boolean;
}

const accentColors = {
  teal: '#00e5cc',
  gold: '#ffd700',
  pink: '#ff6eb4',
};

export function SectionHeading({ title, subtitle, accent = 'teal', symbol = '✦', className, center = false }: SectionHeadingProps) {
  const color = accentColors[accent];
  return (
    <div className={cn('mb-8', center && 'text-center', className)}>
      <div className={cn('flex items-center gap-3 mb-2', center && 'justify-center')}>
        <span className="text-lg leading-none select-none" style={{ color, textShadow: `0 0 10px ${color}99` }}>{symbol}</span>
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
      </div>
      {subtitle && <p className="text-[#8888aa] text-sm md:text-base mt-1">{subtitle}</p>}
    </div>
  );
}
