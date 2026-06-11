'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import type { Itinerary, DayPlan, Activity, AddActivityFormValues, Holiday } from '@/types';
import { itineraryCacheKey } from '@/lib/constants';

function emptyItinerary(holiday: Holiday): Itinerary {
  const start = new Date(holiday.startDate + 'T00:00:00Z');
  const end = new Date(holiday.endDate + 'T00:00:00Z');
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1);
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    return {
      day: i + 1,
      date: d.toISOString().split('T')[0],
      label: `Day ${i + 1}`,
      activities: [],
      notes: '',
    };
  });
}

function readCache(holidayId: string): Itinerary | null {
  try {
    const raw = localStorage.getItem(itineraryCacheKey(holidayId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(itineraryCacheKey(holidayId));
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(holidayId: string, data: Itinerary) {
  try { localStorage.setItem(itineraryCacheKey(holidayId), JSON.stringify(data)); } catch {}
}

export function useItinerary(holidayId: string, holiday: Holiday) {
  const [itinerary, setItinerary] = useState<Itinerary>(() => emptyItinerary(holiday));
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const cached = readCache(holidayId);
    if (cached) setItinerary(cached);

    fetch(`/api/holidays/${holidayId}/itinerary`)
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          setItinerary(data as Itinerary);
          writeCache(holidayId, data as Itinerary);
        } else {
          if (!cached) setItinerary(emptyItinerary(holiday));
        }
      })
      .catch(() => { if (!cached) setItinerary(emptyItinerary(holiday)); })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holidayId]);

  const persistDay = useCallback((dayPlan: DayPlan) => {
    const existing = debounceRef.current.get(dayPlan.day);
    if (existing) clearTimeout(existing);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/holidays/${holidayId}/itinerary/${dayPlan.day}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dayPlan),
        });
        if (!res.ok) throw new Error('Server error');
      } catch {
        toast.error('Failed to save. Changes may not sync across devices.');
      }
    }, 300);
    debounceRef.current.set(dayPlan.day, t);
  }, [holidayId]);

  const mutateDay = useCallback((day: number, updater: (d: DayPlan) => DayPlan) => {
    setItinerary((prev) => {
      const next = prev.map((d) => (d.day === day ? updater(d) : d));
      writeCache(holidayId, next);
      persistDay(next.find((d) => d.day === day)!);
      return next;
    });
  }, [persistDay, holidayId]);

  const addActivity = useCallback((day: number, form: AddActivityFormValues) => {
    const activity: Activity = {
      id: nanoid(),
      title: form.title,
      location: form.location || undefined,
      startTime: form.startTime,
      endTime: form.endTime || undefined,
      category: form.category,
      notes: form.notes || undefined,
      emoji: form.emoji || undefined,
      googleMapsUrl: form.googleMapsUrl || undefined,
      isUserAdded: true,
    };
    mutateDay(day, (d) => ({
      ...d,
      activities: [...d.activities, activity].sort((a, b) => a.startTime.localeCompare(b.startTime)),
    }));
  }, [mutateDay]);

  const updateActivity = useCallback((day: number, id: string, form: Partial<AddActivityFormValues>) => {
    mutateDay(day, (d) => ({
      ...d,
      activities: d.activities
        .map((a) => (a.id === id ? { ...a, ...form } : a))
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    }));
  }, [mutateDay]);

  const removeActivity = useCallback((day: number, id: string) => {
    mutateDay(day, (d) => ({ ...d, activities: d.activities.filter((a) => a.id !== id) }));
  }, [mutateDay]);

  const reorderActivities = useCallback((day: number, ordered: Activity[]) => {
    mutateDay(day, (d) => ({ ...d, activities: ordered }));
  }, [mutateDay]);

  const updateNotes = useCallback((day: number, notes: string) => {
    mutateDay(day, (d) => ({ ...d, notes }));
  }, [mutateDay]);

  const resetDay = useCallback(async (day: number) => {
    try {
      const res = await fetch(`/api/holidays/${holidayId}/itinerary/${day}`, { method: 'DELETE' });
      const resetted: DayPlan = await res.json();
      setItinerary((prev) => {
        const next = prev.map((d) => (d.day === day ? resetted : d));
        writeCache(holidayId, next);
        return next;
      });
      toast.success(`Day ${day} reset`);
    } catch {
      toast.error('Failed to reset day');
    }
  }, [holidayId]);

  const totalActivities = itinerary.reduce((sum, d) => sum + d.activities.length, 0);

  return { itinerary, loading, totalActivities, addActivity, updateActivity, removeActivity, reorderActivities, updateNotes, resetDay };
}
