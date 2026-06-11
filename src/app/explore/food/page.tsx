'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { FoodCard } from '@/components/explore/FoodCard';
import { CategoryFilter } from '@/components/explore/CategoryFilter';
import { foodSpots } from '@/data/food';
import { useItinerary } from '@/hooks/useItinerary';
import { toast } from 'sonner';
import type { FoodSpot, FoodCategory } from '@/types';
import { TRIP_DAY_LABELS } from '@/data/trip-config';

const categories: { value: FoodCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'hawker', label: 'Hawker' },
  { value: 'fine-dining', label: 'Fine Dining' },
  { value: 'cafe', label: 'Café' },
  { value: 'bar', label: 'Bar' },
  { value: 'dessert', label: 'Dessert' },
];

export default function FoodPage() {
  const [active, setActive] = useState<FoodCategory | 'all'>('all');
  const { addActivity } = useItinerary();

  const filtered = active === 'all' ? foodSpots : foodSpots.filter((f) => f.category === active);

  function handleAddToDay(day: number, spot: FoodSpot) {
    addActivity(day, {
      title: spot.name,
      location: `${spot.name}, ${spot.location}`,
      startTime: '12:00',
      endTime: '',
      category: 'food',
      notes: spot.mustTry.length > 0 ? `Must try: ${spot.mustTry.join(', ')}` : '',
      emoji: '🍜',
      googleMapsUrl: spot.googleMapsUrl,
    });
    toast.success(`Added "${spot.name}" to Day ${day} (${TRIP_DAY_LABELS[day - 1]})`);
  }

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
        <Link href="/explore" className="inline-flex items-center gap-1.5 text-[#8888aa] hover:text-[#00e5cc] text-sm transition-colors mb-5 sm:mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>
        <SectionHeading
          title="Food & Drink"
          subtitle={`${filtered.length} places to eat`}
          accent="gold"
        />
        <CategoryFilter options={categories} active={active} onChange={setActive} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <FoodCard key={s.id} spot={s} onAddToDay={handleAddToDay} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
