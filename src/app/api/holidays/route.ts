import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { listHolidays, createHoliday } from '@/lib/holidays';

export async function GET() {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const holidays = await listHolidays(user.userId);
  return NextResponse.json(holidays);
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { name, destination, startDate, endDate, coverEmoji, crew } = body;
    if (!name || !destination || !startDate || !endDate) {
      return NextResponse.json({ error: 'name, destination, startDate, endDate are required' }, { status: 400 });
    }
    const holiday = await createHoliday(user.userId, { name, destination, startDate, endDate, coverEmoji, crew });
    return NextResponse.json(holiday, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
