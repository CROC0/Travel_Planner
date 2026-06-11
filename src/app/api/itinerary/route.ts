import { NextResponse } from 'next/server';
import { getItinerary } from '@/lib/kv';

export async function GET() {
  try {
    const itinerary = await getItinerary();
    return NextResponse.json(itinerary);
  } catch (err) {
    console.error('GET /api/itinerary error:', err);
    return NextResponse.json({ error: 'Failed to load itinerary' }, { status: 500 });
  }
}
