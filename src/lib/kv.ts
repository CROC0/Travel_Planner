import { Redis } from '@upstash/redis';
import type { Itinerary, DayPlan, TodoItem } from '@/types';
import { ITINERARY_KV_KEY, TODO_KV_KEY } from '@/lib/constants';
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
    if (!stored) return emptyDay;
    // Always use label/date from config, not stale stored values
    return { ...stored, label: emptyDay.label, date: emptyDay.date };
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

// ─── Todos ────────────────────────────────────────────────────────────────────

export async function getTodos(): Promise<TodoItem[]> {
  const data = await redis.get<TodoItem[]>(TODO_KV_KEY);
  return data ?? [];
}

export async function addTodo(item: TodoItem): Promise<TodoItem[]> {
  const todos = await getTodos();
  const next = [item, ...todos];
  await redis.set(TODO_KV_KEY, next);
  return next;
}

export async function updateTodo(id: string, patch: Partial<Pick<TodoItem, 'text' | 'completed' | 'category'>>): Promise<TodoItem[]> {
  const todos = await getTodos();
  const next = todos.map((t) => (t.id === id ? { ...t, ...patch } : t));
  await redis.set(TODO_KV_KEY, next);
  return next;
}

export async function deleteTodo(id: string): Promise<TodoItem[]> {
  const todos = await getTodos();
  const next = todos.filter((t) => t.id !== id);
  await redis.set(TODO_KV_KEY, next);
  return next;
}
