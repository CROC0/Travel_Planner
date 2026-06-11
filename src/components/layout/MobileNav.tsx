'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Calendar, Compass, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

function getHolidayId(pathname: string): string | null {
  const m = pathname.match(/^\/holidays\/([^/]+)/);
  return m ? m[1] : null;
}

export function MobileNav() {
  const pathname = usePathname();
  const holidayId = getHolidayId(pathname);

  if (!holidayId) return null;

  const tabs = [
    { href: `/holidays/${holidayId}`, label: 'Home', icon: Home },
    { href: `/holidays/${holidayId}/itinerary`, label: 'Itinerary', icon: Map },
    { href: `/holidays/${holidayId}/calendar`, label: 'Calendar', icon: Calendar },
    { href: `/holidays/${holidayId}/explore`, label: 'Explore', icon: Compass },
    { href: `/holidays/${holidayId}/prep`, label: 'Prep', icon: ClipboardList },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-white/5 pb-safe">
      <div className="flex items-stretch h-16">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== `/holidays/${holidayId}` && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200',
                active ? 'text-[#00e5cc]' : 'text-[#8888aa]'
              )}
            >
              <Icon className={cn('w-5 h-5', active && 'drop-shadow-[0_0_8px_#00e5cc]')} />
              <span className="text-[9px] font-medium">{label}</span>
              {active && <span className="absolute bottom-0 w-8 h-0.5 bg-[#00e5cc] rounded-t-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
