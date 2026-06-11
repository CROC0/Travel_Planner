'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { DayCard } from '@/components/itinerary/DayCard';
import { ItineraryProgress } from '@/components/itinerary/ItineraryProgress';
import { useItinerary } from '@/hooks/useItinerary';

export default function ItineraryPage() {
  const { itinerary, loading } = useItinerary();

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
        <SectionHeading
          title="Itinerary"
          subtitle="10 days in the Lion City"
          accent="teal"
          symbol="≡"
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-[#00e5cc] border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            <ItineraryProgress itinerary={itinerary} />
            <div className="space-y-3">
              {itinerary.map((day) => (
                <DayCard key={day.day} dayPlan={day} />
              ))}
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
