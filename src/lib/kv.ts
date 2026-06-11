import { Redis } from '@upstash/redis';
import type { Itinerary, DayPlan, TodoItem, Holiday } from '@/types';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export { redis };

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().split('T')[0];
}

function tripLength(holiday: Holiday): number {
  const start = new Date(holiday.startDate + 'T00:00:00Z');
  const end = new Date(holiday.endDate + 'T00:00:00Z');
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1);
}

export function emptyItinerary(holiday: Holiday): Itinerary {
  const days = tripLength(holiday);
  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    date: addDays(holiday.startDate, i),
    label: `Day ${i + 1}`,
    activities: [],
    notes: '',
  }));
}

export async function getItinerary(holidayId: string, holiday: Holiday): Promise<Itinerary> {
  const data = await redis.get<Itinerary>(`itinerary:${holidayId}`);
  const empty = emptyItinerary(holiday);
  if (!data) return empty;
  return empty.map((emptyDay) => {
    const stored = data.find((d) => d.day === emptyDay.day);
    if (!stored) return emptyDay;
    return { ...stored, label: emptyDay.label, date: emptyDay.date };
  });
}

export async function setDay(holidayId: string, holiday: Holiday, dayPlan: DayPlan): Promise<void> {
  const itinerary = await getItinerary(holidayId, holiday);
  const idx = itinerary.findIndex((d) => d.day === dayPlan.day);
  if (idx === -1) return;
  itinerary[idx] = dayPlan;
  await redis.set(`itinerary:${holidayId}`, itinerary);
}

export async function resetDay(holidayId: string, holiday: Holiday, day: number): Promise<DayPlan> {
  const empty = emptyItinerary(holiday);
  const emptyDay = empty.find((d) => d.day === day);
  if (!emptyDay) throw new Error(`Invalid day: ${day}`);
  await setDay(holidayId, holiday, emptyDay);
  return emptyDay;
}

// ─── Todos ────────────────────────────────────────────────────────────────────

export async function getTodos(holidayId: string): Promise<TodoItem[]> {
  return (await redis.get<TodoItem[]>(`todos:${holidayId}`)) ?? [];
}

export async function addTodo(holidayId: string, item: TodoItem): Promise<TodoItem[]> {
  const todos = await getTodos(holidayId);
  const next = [item, ...todos];
  await redis.set(`todos:${holidayId}`, next);
  return next;
}

export async function updateTodo(
  holidayId: string,
  id: string,
  patch: Partial<Pick<TodoItem, 'text' | 'completed' | 'category'>>,
): Promise<TodoItem[]> {
  const todos = await getTodos(holidayId);
  const next = todos.map((t) => (t.id === id ? { ...t, ...patch } : t));
  await redis.set(`todos:${holidayId}`, next);
  return next;
}

export async function deleteTodo(holidayId: string, id: string): Promise<TodoItem[]> {
  const todos = await getTodos(holidayId);
  const next = todos.filter((t) => t.id !== id);
  await redis.set(`todos:${holidayId}`, next);
  return next;
}
