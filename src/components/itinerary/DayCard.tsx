'use client';

import Link from 'next/link';
import { ChevronRight, Clock } from 'lucide-react';
import type { DayPlan } from '@/types';

interface DayCardProps {
  dayPlan: DayPlan;
  holidayId: string;
}

export function DayCard({ dayPlan, holidayId }: DayCardProps) {
  const { day, date, label, activities } = dayPlan;
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const firstActivity = activities[0];
  const lastActivity = activities[activities.length - 1];

  return (
    <Link href={`/holidays/${holidayId}/itinerary/${day}`} className="group block">
      <div className="glass rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:border-[#00e5cc]/30 transition-all duration-200 hover:bg-white/[0.03]"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Day number */}
        <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#00e5cc]/10 border border-[#00e5cc]/20 flex flex-col items-center justify-center">
          <span className="text-[#00e5cc] text-base sm:text-lg font-bold leading-none">{day}</span>
          <span className="text-[#8888aa] text-[9px] uppercase tracking-wider">day</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{label}</p>
          <p className="text-[#8888aa] text-xs mt-0.5">{formattedDate}</p>
          {activities.length > 0 ? (
            <div className="flex items-center gap-1 mt-1.5 min-w-0">
              <Clock className="w-3 h-3 text-[#8888aa] flex-shrink-0" />
              <p className="text-[#8888aa] text-xs truncate">
                {firstActivity.startTime && `${firstActivity.startTime} – `}
                {lastActivity.endTime ?? lastActivity.startTime}&nbsp;·&nbsp;
                {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
              </p>
            </div>
          ) : (
            <p className="text-[#8888aa] text-xs mt-1.5">No activities planned</p>
          )}
        </div>

        {/* Arrow */}
        <ChevronRight className="w-4 h-4 text-[#8888aa] group-hover:text-[#00e5cc] transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}
