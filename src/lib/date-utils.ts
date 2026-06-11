import { TRIP_DAY_DATES } from '@/data/trip-config';

export function isTripDate(dateStr: string): boolean {
  return TRIP_DAY_DATES.includes(dateStr);
}

export function getTripDay(dateStr: string): number | null {
  const idx = TRIP_DAY_DATES.indexOf(dateStr);
  return idx === -1 ? null : idx + 1;
}

export function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay(); // 0=Sun
}
