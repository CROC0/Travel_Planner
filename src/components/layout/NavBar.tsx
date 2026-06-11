'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plane, Calendar, Map, Compass, Home, ClipboardList, FolderOpen, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActiveHoliday } from '@/context/ActiveHolidayContext';

function getHolidayId(pathname: string): string | null {
  const m = pathname.match(/^\/holidays\/([^/]+)/);
  return m ? m[1] : null;
}

export function NavBar() {
  const pathname = usePathname();
  const holidayId = getHolidayId(pathname);
  const { active } = useActiveHoliday();

  const isOwner = active?.isOwner ?? false;

  const navLinks = holidayId ? [
    { href: `/holidays/${holidayId}`, label: 'Home', icon: Home },
    { href: `/holidays/${holidayId}/itinerary`, label: 'Itinerary', icon: Map },
    { href: `/holidays/${holidayId}/calendar`, label: 'Calendar', icon: Calendar },
    { href: `/holidays/${holidayId}/explore`, label: 'Explore', icon: Compass },
    ...(isOwner ? [
      { href: `/holidays/${holidayId}/prep`, label: 'Prep', icon: ClipboardList },
      { href: `/holidays/${holidayId}/documents`, label: 'Documents', icon: FolderOpen },
    ] : []),
  ] : [];

  return (
    <nav className="hidden md:flex fixed top-0 inset-x-0 z-50 h-16 glass border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <Plane className="w-5 h-5 text-[#00e5cc] group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-white">
            <span className="text-[#00e5cc]">Trip</span> Planner
          </span>
        </Link>

        {active && (
          <div className="flex items-center gap-1.5 text-sm">
            <ChevronRight className="w-3.5 h-3.5 text-[#333355]" />
            {active.emoji && <span className="text-base leading-none">{active.emoji}</span>}
            <span className="text-white font-semibold truncate max-w-[180px]">{active.name}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== `/holidays/${holidayId}` && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200',
                  active ? 'text-[#00e5cc] bg-[#00e5cc]/10' : 'text-[#8888aa] hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
          {!holidayId && (
            <Link href="/" className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200', pathname === '/' ? 'text-[#00e5cc] bg-[#00e5cc]/10' : 'text-[#8888aa] hover:text-white hover:bg-white/5')}>
              <Home className="w-4 h-4" />
              My Holidays
            </Link>
          )}
          {holidayId && !isOwner && (
            <Link
              href={`/login?from=${pathname}`}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 text-[#0a0a0f]"
              style={{ background: 'linear-gradient(135deg, #00e5cc, #00b8a6)', boxShadow: '0 0 12px #00e5cc33' }}
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
