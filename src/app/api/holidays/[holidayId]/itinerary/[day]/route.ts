import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getHoliday, ownedByUser } from '@/lib/holidays';
import { setDay, resetDay, emptyItinerary } from '@/lib/kv';
import type { DayPlan } from '@/types';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ holidayId: string; day: string }> }) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { holidayId, day: dayStr } = await params;
  const holiday = await getHoliday(holidayId);
  if (!holiday || !ownedByUser(holiday, user.userId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const day = parseInt(dayStr, 10);
  const empty = emptyItinerary(holiday);
  if (isNaN(day) || day < 1 || day > empty.length) {
    return NextResponse.json({ error: 'Invalid day' }, { status: 400 });
  }
  try {
    const body: DayPlan = await req.json();
    await setDay(holidayId, holiday, body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ holidayId: string; day: string }> }) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { holidayId, day: dayStr } = await params;
  const holiday = await getHoliday(holidayId);
  if (!holiday || !ownedByUser(holiday, user.userId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const day = parseInt(dayStr, 10);
  const empty = emptyItinerary(holiday);
  if (isNaN(day) || day < 1 || day > empty.length) {
    return NextResponse.json({ error: 'Invalid day' }, { status: 400 });
  }
  try {
    const resetted = await resetDay(holidayId, holiday, day);
    return NextResponse.json(resetted);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
