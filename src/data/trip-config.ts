// Singapore timezone UTC+8
export const DEPARTURE_DATE = new Date('2026-09-25T00:00:00+08:00');
export const RETURN_DATE = new Date('2026-10-04T23:59:59+08:00');
export const TRIP_DAYS = 10;

export const TRIP_DAY_DATES: string[] = Array.from({ length: TRIP_DAYS }, (_, i) => {
  const d = new Date('2026-09-25');
  d.setDate(d.getDate() + i);
  return d.toISOString().split('T')[0];
});

export const TRIP_DAY_LABELS: string[] = [
  'Day 1',
  'Day 2',
  'Day 3',
  'Day 4',
  'Day 5',
  'Day 6',
  'Day 7',
  'Day 8',
  'Day 9',
  'Day 10',
];
