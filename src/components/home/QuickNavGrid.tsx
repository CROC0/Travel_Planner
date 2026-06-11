import Link from 'next/link';
import { Map, Calendar, Compass, Utensils, Info, Star, ClipboardList, FolderOpen } from 'lucide-react';

export function QuickNavGrid({ holidayId, destination, isOwner = true }: { holidayId: string; destination: string; isOwner?: boolean }) {
  const isSingapore = destination.toLowerCase() === 'singapore';
  const base = `/holidays/${holidayId}`;

  const cards = [
    { href: `${base}/itinerary`, icon: Map, title: 'Itinerary', description: 'Day-by-day plan', color: '#00e5cc', glow: '0 0 30px #00e5cc33' },
    { href: `${base}/calendar`, icon: Calendar, title: 'Calendar', description: 'Trip overview', color: '#ffd700', glow: '0 0 30px #ffd70033' },
    ...(isSingapore ? [
      { href: `${base}/explore/attractions`, icon: Star, title: 'Attractions', description: 'Must-see places', color: '#ff6eb4', glow: '0 0 30px #ff6eb433' },
      { href: `${base}/explore/food`, icon: Utensils, title: 'Food', description: 'Hawker & dining', color: '#a855f7', glow: '0 0 30px #a855f733' },
    ] : []),
    { href: `${base}/explore`, icon: Compass, title: 'Explore', description: 'Discover more', color: '#3b82f6', glow: '0 0 30px #3b82f633' },
    { href: `${base}/explore/practical`, icon: Info, title: 'Practical', description: 'Tips & transport', color: '#10b981', glow: '0 0 30px #10b98133' },
    ...(isOwner ? [
      { href: `${base}/prep`, icon: ClipboardList, title: 'Prep', description: 'Trip to-do list', color: '#ffd700', glow: '0 0 30px #ffd70033' },
      { href: `${base}/documents`, icon: FolderOpen, title: 'Documents', description: 'Files & attachments', color: '#00e5cc', glow: '0 0 30px #00e5cc33' },
    ] : []),
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
      {cards.map(({ href, icon: Icon, title, description, color }) => (
        <Link
          key={href}
          href={href}
          className="group glass rounded-2xl p-4 sm:p-5 flex flex-col gap-2 sm:gap-3 hover:scale-[1.02] transition-all duration-200"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ background: `${color}15`, boxShadow: `0 0 0 1px ${color}30` }}
          >
            <Icon className="w-5 h-5 transition-all duration-200" style={{ color }} />
          </div>
          <div>
            <p className="text-white font-semibold text-sm group-hover:text-[#00e5cc] transition-colors">{title}</p>
            <p className="text-[#8888aa] text-xs mt-0.5">{description}</p>
          </div>
          <div className="self-end opacity-0 group-hover:opacity-100 transition-opacity text-sm" style={{ color }}>→</div>
        </Link>
      ))}
    </div>
  );
}
