'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getTripDay, isTripDate, toDateStr } from '@/lib/date-utils';
import type { Itinerary } from '@/types';

interface CalendarDayCellProps {
  year: number;
  month: number;
  day: number | null; // null = empty cell
  itinerary: Itinerary;
  today: string;
  holidayId: string;
}

export function CalendarDayCell({ year, month, day, itinerary, today, holidayId }: CalendarDayCellProps) {
  if (!day) {
    return <div className="aspect-square" />;
  }

  const dateStr = toDateStr(year, month, day);
  const tripDay = getTripDay(dateStr);
  const isTrip = isTripDate(dateStr);
  const isToday = dateStr === today;
  const activities = itinerary.find((d) => d.day === tripDay)?.activities ?? [];
  const hasActivities = activities.length > 0;

  const cell = (
    <div
      className={cn(
        'aspect-square rounded-lg sm:rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 text-xs sm:text-sm font-medium',
        isToday && 'ring-1 ring-white/30',
        isTrip
          ? 'cursor-pointer hover:scale-105'
          : 'text-[#8888aa]',
        !isTrip && !isToday && 'opacity-50',
      )}
      style={
        isTrip
          ? {
              background: hasActivities ? 'rgba(0,229,204,0.15)' : 'rgba(0,229,204,0.06)',
              border: `1px solid ${hasActivities ? 'rgba(0,229,204,0.5)' : 'rgba(0,229,204,0.2)'}`,
              color: '#fff',
            }
          : {
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid transparent',
            }
      }
    >
      <span className={cn(isTrip && 'text-white font-semibold')}>{day}</span>
      {isTrip && (
        <div className="hidden sm:flex gap-0.5 mt-1">
          {Array.from({ length: Math.min(activities.length, 4) }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{
                backgroundColor: hasActivities ? '#00e5cc' : 'rgba(0,229,204,0.4)',
                boxShadow: hasActivities ? '0 0 4px #00e5cc' : 'none',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (isTrip && tripDay) {
    return <Link href={`/holidays/${holidayId}/itinerary/${tripDay}`}>{cell}</Link>;
  }
  return cell;
}
