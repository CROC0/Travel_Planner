'use client';

import { useHoliday } from '@/context/HolidayContext';
import { CountdownTimer } from '@/components/home/CountdownTimer';
import { CrewSection } from '@/components/home/CrewSection';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { QuickNavGrid } from '@/components/home/QuickNavGrid';
import { Calendar, MapPin, Plane, Sun } from 'lucide-react';

function formatDateRange(start: string, end: string): string {
  const fmt = (d: string) =>
    new Date(d + 'T00:00:00Z').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  return `${fmt(start)} – ${fmt(end)}`;
}

function tripDays(start: string, end: string): number {
  const s = new Date(start + 'T00:00:00Z');
  const e = new Date(end + 'T00:00:00Z');
  return Math.max(1, Math.round((e.getTime() - s.getTime()) / 86_400_000) + 1);
}

export default function HolidayHomePage() {
  const holiday = useHoliday();
  const departureDate = new Date(holiday.startDate + 'T00:00:00Z');
  const dateRange = formatDateRange(holiday.startDate, holiday.endDate);
  const days = tripDays(holiday.startDate, holiday.endDate);

  const summaryStats = [
    { icon: Calendar, label: `${days} Day${days !== 1 ? 's' : ''}`, sub: dateRange },
    { icon: MapPin, label: holiday.destination, sub: holiday.name },
    { icon: Plane, label: 'Departure', sub: new Date(holiday.startDate + 'T00:00:00Z').toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }) },
    { icon: Sun, label: 'Adventure awaits', sub: `${days} days of memories` },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden aurora-bg">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,229,204,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,204,0.8) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-[#00e5cc]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-[#ffd700]/08 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center px-4 space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-[#8888aa]">
            <span className="w-2 h-2 rounded-full bg-[#00e5cc] animate-[glow-pulse_2s_ease-in-out_infinite]" />
            {holiday.coverEmoji && <span>{holiday.coverEmoji}</span>}
            {dateRange}
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight">
              <span className="shimmer-text">{holiday.name.toUpperCase()}</span>
            </h1>
          </div>
          <div className="pt-2 sm:pt-4">
            <p className="text-[#8888aa] text-xs tracking-widest uppercase mb-4 sm:mb-6">Departure in</p>
            <CountdownTimer
              target={departureDate}
              expiredMessage={`${holiday.coverEmoji ?? '✈️'} Trip in progress!`}
            />
          </div>
          <div className="pt-4 sm:pt-8 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-[#8888aa] text-xs">scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-[#8888aa] to-transparent" />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10 sm:space-y-16">
        {holiday.crew && holiday.crew.length > 0 && (
          <section>
            <SectionHeading title="The Crew" subtitle="Who&apos;s coming along" accent="gold" symbol="◈" />
            <CrewSection crew={holiday.crew} />
          </section>
        )}

        <section>
          <SectionHeading title="Trip at a glance" subtitle="Everything you need to know" accent="teal" symbol="◉" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {summaryStats.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="glass rounded-2xl p-3 sm:p-4 flex flex-col gap-2 hover:border-[#00e5cc]/30 transition-colors" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <Icon className="w-5 h-5 text-[#00e5cc]" />
                <div>
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <p className="text-[#8888aa] text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading title="Quick navigation" subtitle="Jump to what you need" accent="gold" symbol="⊕" />
          <QuickNavGrid holidayId={holiday.id} destination={holiday.destination} />
        </section>
      </div>
    </div>
  );
}
