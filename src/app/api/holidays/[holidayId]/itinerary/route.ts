import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getHoliday, ownedByUser } from '@/lib/holidays';
import { getItinerary } from '@/lib/kv';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ holidayId: string }> }) {
  const { holidayId } = await params;
  const holiday = await getHoliday(holidayId);
  if (!holiday) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Private holidays are readable only by their owner; public holidays by anyone.
  if (!holiday.isPublic) {
    const user = await getUserFromRequest();
    if (!user || !ownedByUser(holiday, user.userId)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  }

  try {
    const itinerary = await getItinerary(holidayId, holiday);
    return NextResponse.json(itinerary);
  } catch {
    return NextResponse.json({ error: 'Failed to load itinerary' }, { status: 500 });
  }
}
