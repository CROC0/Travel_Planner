import Link from 'next/link';
import { Map, Calendar, Compass, Utensils, Info, Star } from 'lucide-react';

const cards = [
  {
    href: '/itinerary',
    icon: Map,
    title: 'Itinerary',
    description: 'Day-by-day plan',
    color: '#00e5cc',
    glow: '0 0 30px #00e5cc33',
  },
  {
    href: '/calendar',
    icon: Calendar,
    title: 'Calendar',
    description: 'Trip overview',
    color: '#ffd700',
    glow: '0 0 30px #ffd70033',
  },
  {
    href: '/explore/attractions',
    icon: Star,
    title: 'Attractions',
    description: 'Must-see places',
    color: '#ff6eb4',
    glow: '0 0 30px #ff6eb433',
  },
  {
    href: '/explore/food',
    icon: Utensils,
    title: 'Food',
    description: 'Hawker & dining',
    color: '#a855f7',
    glow: '0 0 30px #a855f733',
  },
  {
    href: '/explore',
    icon: Compass,
    title: 'Explore',
    description: 'Discover more',
    color: '#3b82f6',
    glow: '0 0 30px #3b82f633',
  },
  {
    href: '/explore/practical',
    icon: Info,
    title: 'Practical',
    description: 'Tips & transport',
    color: '#10b981',
    glow: '0 0 30px #10b98133',
  },
];

export function QuickNavGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
      {cards.map(({ href, icon: Icon, title, description, color, glow }) => (
        <Link
          key={href}
          href={href}
          className="group glass rounded-2xl p-4 sm:p-5 flex flex-col gap-2 sm:gap-3 hover:scale-[1.02] transition-all duration-200"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              background: `${color}15`,
              boxShadow: `0 0 0 1px ${color}30`,
            }}
          >
            <Icon className="w-5 h-5 transition-all duration-200" style={{ color }} />
          </div>
          <div>
            <p className="text-white font-semibold text-sm group-hover:text-[#00e5cc] transition-colors">
              {title}
            </p>
            <p className="text-[#8888aa] text-xs mt-0.5">{description}</p>
          </div>
          <div
            className="self-end opacity-0 group-hover:opacity-100 transition-opacity text-sm"
            style={{ color }}
          >
            →
          </div>
        </Link>
      ))}
    </div>
  );
}
