'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plane, Calendar, Map, Compass, Home, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/itinerary', label: 'Itinerary', icon: Map },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/prep', label: 'Prep', icon: ClipboardList },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex fixed top-0 inset-x-0 z-50 h-16 glass border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <Plane className="w-5 h-5 text-[#00e5cc] group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-white">
            <span className="text-[#00e5cc]">SG</span> 2026
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200',
                  active
                    ? 'text-[#00e5cc] bg-[#00e5cc]/10'
                    : 'text-[#8888aa] hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
