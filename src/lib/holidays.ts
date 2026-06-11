import { nanoid } from 'nanoid';
import type { Holiday } from '@/types';
import { redis } from '@/lib/kv';

export async function createHoliday(userId: string, data: Omit<Holiday, 'id' | 'userId' | 'createdAt'>): Promise<Holiday> {
  const id = nanoid();
  const holiday: Holiday = { ...data, id, userId, createdAt: Date.now() };
  await redis.set(`holiday:${id}`, holiday);
  const existing = await redis.get<string[]>(`user:${userId}:holidays`) ?? [];
  await redis.set(`user:${userId}:holidays`, [id, ...existing]);
  return holiday;
}

export async function getHoliday(holidayId: string): Promise<Holiday | null> {
  return redis.get<Holiday>(`holiday:${holidayId}`);
}

export async function listHolidays(userId: string): Promise<Holiday[]> {
  const ids = await redis.get<string[]>(`user:${userId}:holidays`) ?? [];
  if (ids.length === 0) return [];
  const holidays = await Promise.all(ids.map((id) => redis.get<Holiday>(`holiday:${id}`)));
  return holidays.filter((h): h is Holiday => h !== null);
}

export async function updateHoliday(holidayId: string, patch: Partial<Omit<Holiday, 'id' | 'userId' | 'createdAt'>>): Promise<Holiday | null> {
  const existing = await getHoliday(holidayId);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  await redis.set(`holiday:${holidayId}`, updated);
  return updated;
}

export async function deleteHoliday(holidayId: string, userId: string): Promise<void> {
  await redis.del(`holiday:${holidayId}`);
  await redis.del(`itinerary:${holidayId}`);
  await redis.del(`todos:${holidayId}`);
  const ids = await redis.get<string[]>(`user:${userId}:holidays`) ?? [];
  await redis.set(`user:${userId}:holidays`, ids.filter((id) => id !== holidayId));
}

export function ownedByUser(holiday: Holiday, userId: string): boolean {
  return holiday.userId === userId;
}
