'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { AttractionCard } from '@/components/explore/AttractionCard';
import { CategoryFilter } from '@/components/explore/CategoryFilter';
import { attractions } from '@/data/attractions';
import { useItinerary } from '@/hooks/useItinerary';
import { useHoliday } from '@/context/HolidayContext';
import { toast } from 'sonner';
import type { Attraction, AttractionCategory } from '@/types';

const categories: { value: AttractionCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'landmark', label: 'Landmarks' },
  { value: 'nature', label: 'Nature' },
  { value: 'museum', label: 'Museums' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'beach', label: 'Beach' },
  { value: 'theme-park', label: 'Theme Parks' },
  { value: 'culture', label: 'Culture' },
  { value: 'nightlife', label: 'Nightlife' },
];

export default function AttractionsPage() {
  const [active, setActive] = useState<AttractionCategory | 'all'>('all');
  const holiday = useHoliday();
  const { itinerary, addActivity } = useItinerary(holiday.id, holiday);
  const filtered = active === 'all' ? attractions : attractions.filter((a) => a.category === active);

  function handleAddToDay(day: number, attraction: Attraction) {
    addActivity(day, {
      title: attraction.name,
      location: attraction.name,
      startTime: '09:00',
      endTime: '',
      category: attraction.category === 'theme-park' || attraction.category === 'viewpoint' ? 'sightseeing' : attraction.category === 'museum' ? 'culture' : 'sightseeing',
      notes: attraction.tipText ?? '',
      emoji: '👁',
      googleMapsUrl: attraction.googleMapsUrl,
    });
    toast.success(`Added "${attraction.name}" to Day ${day}`);
  }

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
        <Link href={`/holidays/${holiday.id}/explore`} className="inline-flex items-center gap-1.5 text-[#8888aa] hover:text-[#00e5cc] text-sm transition-colors mb-5 sm:mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>
        <SectionHeading title="Attractions" subtitle={`${filtered.length} places to discover`} accent="pink" symbol="★" />
        <CategoryFilter options={categories} active={active} onChange={setActive} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <AttractionCard key={a.id} attraction={a} dayCount={itinerary.length} onAddToDay={handleAddToDay} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
