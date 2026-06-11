'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { DayTimeline } from '@/components/itinerary/DayTimeline';
import { useItinerary } from '@/hooks/useItinerary';

export default function DayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day: dayStr } = use(params);
  const day = parseInt(dayStr, 10);
  const { itinerary, loading, addActivity, updateActivity, removeActivity, resetDay } = useItinerary();

  if (isNaN(day) || day < 1 || day > 10) notFound();

  const dayPlan = itinerary.find((d) => d.day === day);
  const formattedDate = dayPlan
    ? new Date(dayPlan.date + 'T00:00:00').toLocaleDateString('en-AU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
        {/* Back + header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/itinerary"
            className="inline-flex items-center gap-1.5 text-[#8888aa] hover:text-[#00e5cc] text-sm transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to itinerary
          </Link>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#00e5cc]/10 border border-[#00e5cc]/20 flex items-center justify-center">
                  <span className="text-[#00e5cc] font-bold text-sm sm:text-base">{day}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
                  {dayPlan?.label ?? `Day ${day}`}
                </h1>
              </div>
              <p className="text-[#8888aa] text-xs sm:text-sm">{formattedDate}</p>
            </div>

            <button
              onClick={() => resetDay(day)}
              className="flex-shrink-0 flex items-center gap-1.5 text-xs text-[#8888aa] hover:text-red-400 transition-colors glass rounded-lg px-2.5 py-2 sm:px-3"
              title="Reset day"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-[#00e5cc] border-t-transparent animate-spin" />
          </div>
        ) : dayPlan ? (
          <DayTimeline
            dayPlan={dayPlan}
            onAdd={(form) => addActivity(day, form)}
            onUpdate={(id, form) => updateActivity(day, id, form)}
            onDelete={(id) => removeActivity(day, id)}
          />
        ) : null}
      </div>
    </PageWrapper>
  );
}
