'use client';

import type { Itinerary } from '@/types';
import { getDaysInMonth, getFirstDayOfMonth, toDateStr } from '@/lib/date-utils';
import { CalendarDayCell } from './CalendarDayCell';
import { CalendarLegend } from './CalendarLegend';

const DAYS_OF_WEEK_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function MonthGrid({ year, month, monthName, itinerary, today }: {
  year: number;
  month: number;
  monthName: string;
  itinerary: Itinerary;
  today: string;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete rows
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="glass rounded-2xl p-3 sm:p-5 flex-1" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-center">
        {monthName} <span className="text-[#8888aa]">{year}</span>
      </h3>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_OF_WEEK.map((d, i) => (
          <div key={d} className="text-center text-[#8888aa] text-xs font-medium py-1">
            <span className="hidden sm:inline">{d}</span>
            <span className="sm:hidden">{DAYS_OF_WEEK_SHORT[i]}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => (
          <CalendarDayCell
            key={i}
            year={year}
            month={month}
            day={day}
            itinerary={itinerary}
            today={today}
          />
        ))}
      </div>
    </div>
  );
}

interface TripCalendarProps {
  itinerary: Itinerary;
}

export function TripCalendar({ itinerary }: TripCalendarProps) {
  const today = toDateStr(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4">
        <MonthGrid year={2026} month={9} monthName="September" itinerary={itinerary} today={today} />
        <MonthGrid year={2026} month={10} monthName="October" itinerary={itinerary} today={today} />
      </div>
      <CalendarLegend />
    </div>
  );
}
