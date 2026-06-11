import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getHoliday, updateHoliday, deleteHoliday, ownedByUser } from '@/lib/holidays';
import type { Holiday } from '@/types';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ holidayId: string }> }) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { holidayId } = await params;
  const holiday = await getHoliday(holidayId);
  if (!holiday || !ownedByUser(holiday, user.userId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(holiday);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ holidayId: string }> }) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { holidayId } = await params;
  const holiday = await getHoliday(holidayId);
  if (!holiday || !ownedByUser(holiday, user.userId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    const body = await req.json();
    // Allowlist updatable fields — never spread raw client JSON over the stored
    // entity (prevents overwriting id/userId/createdAt — mass assignment).
    const patch: Partial<Pick<Holiday, 'name' | 'destination' | 'startDate' | 'endDate' | 'coverEmoji' | 'crew' | 'isPublic'>> = {};
    if (typeof body.name === 'string') patch.name = body.name;
    if (typeof body.destination === 'string') patch.destination = body.destination;
    if (typeof body.startDate === 'string') patch.startDate = body.startDate;
    if (typeof body.endDate === 'string') patch.endDate = body.endDate;
    if (typeof body.coverEmoji === 'string') patch.coverEmoji = body.coverEmoji;
    if (Array.isArray(body.crew)) patch.crew = body.crew;
    if (typeof body.isPublic === 'boolean') patch.isPublic = body.isPublic;
    const updated = await updateHoliday(holidayId, patch);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ holidayId: string }> }) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { holidayId } = await params;
  const holiday = await getHoliday(holidayId);
  if (!holiday || !ownedByUser(holiday, user.userId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await deleteHoliday(holidayId, user.userId);
  return NextResponse.json({ success: true });
}
