'use client';

import { useState } from 'react';
import { LayoutGrid, CalendarDays } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ScheduleView } from '@/components/calendar/ScheduleView';
import { TripCalendar } from '@/components/calendar/TripCalendar';
import { useItinerary } from '@/hooks/useItinerary';
import { useHoliday } from '@/context/HolidayContext';

type View = 'schedule' | 'month';

function formatDateRange(start: string, end: string): string {
  const fmt = (d: string) =>
    new Date(d + 'T00:00:00Z').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function CalendarPage() {
  const holiday = useHoliday();
  const { itinerary, loading, addActivity } = useItinerary(holiday.id, holiday);
  const [view, setView] = useState<View>('schedule');
  const dateRange = formatDateRange(holiday.startDate, holiday.endDate);

  return (
    <PageWrapper>
      <div className="max-w-full px-4 py-5 sm:py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between mb-4 sm:mb-6 gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-lg leading-none select-none" style={{ color: '#ffd700', textShadow: '0 0 10px #ffd70099' }}>⊟</span>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Calendar</h1>
            </div>
            <p className="text-[#8888aa] text-sm">{dateRange} · {holiday.destination}</p>
          </div>
          <div className="glass flex rounded-xl p-1 gap-1" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              onClick={() => setView('schedule')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={view === 'schedule' ? { background: '#00e5cc18', color: '#00e5cc', border: '1px solid #00e5cc33' } : { color: '#8888aa', border: '1px solid transparent' }}
            >
              <CalendarDays className="w-4 h-4" />
              Schedule
            </button>
            <button
              onClick={() => setView('month')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={view === 'month' ? { background: '#ffd70018', color: '#ffd700', border: '1px solid #ffd70033' } : { color: '#8888aa', border: '1px solid transparent' }}
            >
              <LayoutGrid className="w-4 h-4" />
              Month
            </button>
          </div>
        </div>

        {view === 'schedule' && (
          <div className="max-w-5xl mx-auto mb-3 sm:mb-4 flex flex-wrap gap-x-3 gap-y-1.5">
            {[
              ['#00e5cc', 'Sightseeing'], ['#ffd700', 'Food'], ['#10b981', 'Accommodation'],
              ['#ff6eb4', 'Shopping'], ['#22c55e', 'Nature'], ['#a855f7', 'Nightlife'],
              ['#3b82f6', 'Beach'], ['#f97316', 'Culture'], ['#8888aa', 'Transport'],
            ].map(([color, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: color }} />
                <span className="text-[#8888aa] text-xs">{label}</span>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-[#00e5cc] border-t-transparent animate-spin" />
          </div>
        ) : view === 'schedule' ? (
          <ScheduleView itinerary={itinerary} onAdd={addActivity} />
        ) : (
          <div className="max-w-3xl mx-auto">
            <TripCalendar itinerary={itinerary} startDate={holiday.startDate} endDate={holiday.endDate} />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
