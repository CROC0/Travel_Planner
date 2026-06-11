import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageCardProps {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  className?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
  aspectRatio?: string;
}

export function ImageCard({
  src,
  alt,
  title,
  subtitle,
  className,
  overlayClassName,
  children,
  aspectRatio = 'aspect-[4/3]',
}: ImageCardProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl group', aspectRatio, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent',
          overlayClassName
        )}
      />
      {(title || subtitle || children) && (
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          {title && <h3 className="text-white font-bold text-lg leading-tight">{title}</h3>}
          {subtitle && <p className="text-white/70 text-sm mt-1">{subtitle}</p>}
          {children}
        </div>
      )}
    </div>
  );
}
