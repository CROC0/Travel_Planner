'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import type { Itinerary, DayPlan, Activity, AddActivityFormValues } from '@/types';
import { ITINERARY_CACHE_KEY } from '@/lib/constants';
import { TRIP_DAYS, TRIP_DAY_DATES, TRIP_DAY_LABELS } from '@/data/trip-config';

function emptyItinerary(): Itinerary {
  return Array.from({ length: TRIP_DAYS }, (_, i) => ({
    day: i + 1,
    date: TRIP_DAY_DATES[i],
    label: TRIP_DAY_LABELS[i],
    activities: [],
    notes: '',
  }));
}

function readCache(): Itinerary | null {
  try {
    const raw = localStorage.getItem(ITINERARY_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(ITINERARY_CACHE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(data: Itinerary) {
  try {
    localStorage.setItem(ITINERARY_CACHE_KEY, JSON.stringify(data));
  } catch {}
}

export function useItinerary() {
  const [itinerary, setItinerary] = useState<Itinerary>(emptyItinerary);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  // Load from server, fall back to cache
  useEffect(() => {
    const cached = readCache();
    if (cached) setItinerary(cached);

    fetch('/api/itinerary')
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          setItinerary(data as Itinerary);
          writeCache(data as Itinerary);
        } else {
          // API returned an error object (e.g. Redis not configured)
          if (!cached) setItinerary(emptyItinerary());
        }
      })
      .catch(() => {
        if (!cached) setItinerary(emptyItinerary());
      })
      .finally(() => setLoading(false));
  }, []);

  const persistDay = useCallback((dayPlan: DayPlan) => {
    const existing = debounceRef.current.get(dayPlan.day);
    if (existing) clearTimeout(existing);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/itinerary/${dayPlan.day}`, {
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
  }, []);

  const mutateDay = useCallback((day: number, updater: (d: DayPlan) => DayPlan) => {
    setItinerary((prev) => {
      const next = prev.map((d) => (d.day === day ? updater(d) : d));
      writeCache(next);
      persistDay(next.find((d) => d.day === day)!);
      return next;
    });
  }, [persistDay]);

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
    mutateDay(day, (d) => ({
      ...d,
      activities: d.activities.filter((a) => a.id !== id),
    }));
  }, [mutateDay]);

  const reorderActivities = useCallback((day: number, ordered: Activity[]) => {
    mutateDay(day, (d) => ({ ...d, activities: ordered }));
  }, [mutateDay]);

  const updateNotes = useCallback((day: number, notes: string) => {
    mutateDay(day, (d) => ({ ...d, notes }));
  }, [mutateDay]);

  const resetDay = useCallback(async (day: number) => {
    try {
      const res = await fetch(`/api/itinerary/${day}`, { method: 'DELETE' });
      const resetted: DayPlan = await res.json();
      setItinerary((prev) => {
        const next = prev.map((d) => (d.day === day ? resetted : d));
        writeCache(next);
        return next;
      });
      toast.success(`Day ${day} reset`);
    } catch {
      toast.error('Failed to reset day');
    }
  }, []);

  const totalActivities = itinerary.reduce((sum, d) => sum + d.activities.length, 0);

  return {
    itinerary,
    loading,
    totalActivities,
    addActivity,
    updateActivity,
    removeActivity,
    reorderActivities,
    updateNotes,
    resetDay,
  };
}
