'use client';

import { Calendar, MapPin, Plane, Sun } from 'lucide-react';

const stats = [
  { icon: Calendar, label: '10 Days', sub: '25 Sep – 4 Oct' },
  { icon: MapPin, label: 'Singapore', sub: 'Lion City, SEA' },
  { icon: Plane, label: 'Changi Airport', sub: 'Best airport 🏆' },
  { icon: Sun, label: '~32°C', sub: 'Warm & sunny' },
];

export function TripSummaryCard() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, sub }) => (
        <div
          key={label}
          className="glass rounded-2xl p-4 flex flex-col gap-2 hover:border-[#00e5cc]/30 transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Icon className="w-5 h-5 text-[#00e5cc]" />
          <div>
            <p className="text-white font-semibold text-sm">{label}</p>
            <p className="text-[#8888aa] text-xs">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
