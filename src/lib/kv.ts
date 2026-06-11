import { Redis } from '@upstash/redis';
import type { Itinerary, DayPlan } from '@/types';
import { ITINERARY_KV_KEY } from '@/lib/constants';
import { TRIP_DAYS, TRIP_DAY_DATES, TRIP_DAY_LABELS } from '@/data/trip-config';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function emptyItinerary(): Itinerary {
  return Array.from({ length: TRIP_DAYS }, (_, i) => ({
    day: i + 1,
    date: TRIP_DAY_DATES[i],
    label: TRIP_DAY_LABELS[i],
    activities: [],
    notes: '',
  }));
}

export async function getItinerary(): Promise<Itinerary> {
  const data = await redis.get<Itinerary>(ITINERARY_KV_KEY);
  if (!data) return emptyItinerary();
  // Merge to ensure all 10 days exist (handles partial data)
  const empty = emptyItinerary();
  return empty.map((emptyDay) => {
    const stored = data.find((d) => d.day === emptyDay.day);
    return stored ?? emptyDay;
  });
}

export async function setDay(dayPlan: DayPlan): Promise<void> {
  const itinerary = await getItinerary();
  const idx = itinerary.findIndex((d) => d.day === dayPlan.day);
  if (idx === -1) return;
  itinerary[idx] = dayPlan;
  await redis.set(ITINERARY_KV_KEY, itinerary);
}

export async function resetDay(day: number): Promise<DayPlan> {
  const empty = emptyItinerary();
  const emptyDay = empty.find((d) => d.day === day);
  if (!emptyDay) throw new Error(`Invalid day: ${day}`);
  await setDay(emptyDay);
  return emptyDay;
}
