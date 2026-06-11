import { NextRequest, NextResponse } from 'next/server';
import { setDay, resetDay } from '@/lib/kv';
import type { DayPlan } from '@/types';

type Params = { params: Promise<{ day: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { day: dayStr } = await params;
  const day = parseInt(dayStr, 10);
  if (isNaN(day) || day < 1 || day > 10) {
    return NextResponse.json({ error: 'Invalid day' }, { status: 400 });
  }
  try {
    const body: DayPlan = await req.json();
    await setDay({ ...body, day });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`PUT /api/itinerary/${day} error:`, err);
    return NextResponse.json({ error: 'Failed to update day' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { day: dayStr } = await params;
  const day = parseInt(dayStr, 10);
  if (isNaN(day) || day < 1 || day > 10) {
    return NextResponse.json({ error: 'Invalid day' }, { status: 400 });
  }
  try {
    const resetted = await resetDay(day);
    return NextResponse.json(resetted);
  } catch (err) {
    console.error(`DELETE /api/itinerary/${day} error:`, err);
    return NextResponse.json({ error: 'Failed to reset day' }, { status: 500 });
  }
}
