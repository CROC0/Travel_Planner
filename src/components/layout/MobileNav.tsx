'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Calendar, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/itinerary', label: 'Itinerary', icon: Map },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/explore', label: 'Explore', icon: Compass },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-white/5 pb-safe">
      <div className="flex items-stretch h-16">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200',
                active ? 'text-[#00e5cc]' : 'text-[#8888aa]'
              )}
            >
              <Icon className={cn('w-5 h-5', active && 'drop-shadow-[0_0_8px_#00e5cc]')} />
              <span className="text-[10px] font-medium">{label}</span>
              {active && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-[#00e5cc] rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
