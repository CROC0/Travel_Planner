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
  'Day 1 — Arrival',
  'Day 2 — Explore',
  'Day 3 — Adventure',
  'Day 4 — Culture',
  'Day 5 — Nature',
  'Day 6 — Relax',
  'Day 7 — Discovery',
  'Day 8 — Flavours',
  'Day 9 — Last Nights',
  'Day 10 — Departure',
];
