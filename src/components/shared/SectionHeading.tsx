import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  accent?: 'teal' | 'gold' | 'pink';
  className?: string;
  center?: boolean;
}

const accentColors = {
  teal: 'bg-[#00e5cc]',
  gold: 'bg-[#ffd700]',
  pink: 'bg-[#ff6eb4]',
};

export function SectionHeading({ title, subtitle, accent = 'teal', className, center = false }: SectionHeadingProps) {
  return (
    <div className={cn('mb-8', center && 'text-center', className)}>
      <div className={cn('flex items-center gap-3 mb-2', center && 'justify-center')}>
        <div className={cn('h-0.5 w-8 rounded-full', accentColors[accent])} />
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
      </div>
      {subtitle && <p className="text-[#8888aa] text-sm md:text-base mt-1">{subtitle}</p>}
    </div>
  );
}
