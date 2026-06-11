import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getHoliday, ownedByUser } from '@/lib/holidays';
import { getItinerary } from '@/lib/kv';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ holidayId: string }> }) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { holidayId } = await params;
  const holiday = await getHoliday(holidayId);
  if (!holiday || !ownedByUser(holiday, user.userId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    const itinerary = await getItinerary(holidayId, holiday);
    return NextResponse.json(itinerary);
  } catch {
    return NextResponse.json({ error: 'Failed to load itinerary' }, { status: 500 });
  }
}
