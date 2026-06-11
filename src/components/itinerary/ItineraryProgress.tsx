'use client';

import type { Itinerary } from '@/types';

interface ItineraryProgressProps {
  itinerary: Itinerary;
}

export function ItineraryProgress({ itinerary }: ItineraryProgressProps) {
  const daysWithActivities = itinerary.filter((d) => d.activities.length > 0).length;
  const totalActivities = itinerary.reduce((s, d) => s + d.activities.length, 0);
  const progress = Math.round((daysWithActivities / itinerary.length) * 100);

  return (
    <div className="glass rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm">Planning progress</p>
          <p className="text-[#8888aa] text-xs leading-relaxed">
            {daysWithActivities} of {itinerary.length} days planned
            {' · '}{totalActivities} {totalActivities === 1 ? 'activity' : 'activities'}
          </p>
        </div>
        <span className="flex-shrink-0 text-[#00e5cc] font-bold text-lg">{progress}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #00e5cc, #ffd700)',
            boxShadow: '0 0 10px #00e5cc44',
          }}
        />
      </div>
      {/* Day dots */}
      <div className="flex justify-between mt-3">
        {itinerary.map((d) => (
          <div
            key={d.day}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: d.activities.length > 0 ? '#00e5cc' : 'rgba(255,255,255,0.15)',
              boxShadow: d.activities.length > 0 ? '0 0 6px #00e5cc' : 'none',
            }}
            title={`Day ${d.day}`}
          />
        ))}
      </div>
    </div>
  );
}
