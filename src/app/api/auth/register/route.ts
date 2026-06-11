import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from '@/lib/constants';
import { getUserByEmail, createUser } from '@/lib/users';
import { createHoliday } from '@/lib/holidays';
import { redis } from '@/lib/kv';
import { getSecret } from '@/lib/jwt';

async function migrateLegacyData(userId: string) {
  const [legacyItinerary, legacyTodos] = await Promise.all([
    redis.get('itinerary:main'),
    redis.get('todos:main'),
  ]);
  if (!legacyItinerary && !legacyTodos) return;

  const holiday = await createHoliday(userId, {
    name: 'Singapore 2026',
    destination: 'Singapore',
    startDate: '2026-09-25',
    endDate: '2026-10-04',
    coverEmoji: '🦁',
    crew: [
      { id: 'matt', name: 'Matt', role: 'The Organiser', color: '#00e5cc', tagline: 'Has a spreadsheet for the spreadsheet' },
      { id: 'simmone', name: 'Simmone', role: 'Passenger Princess', color: '#ff6eb4', tagline: 'Seat reclined, snacks ready, not driving' },
      { id: 'emma', name: 'Emma', role: 'Anxious Thrill Seeker', color: '#ffd700', tagline: 'Nervous at the start, first in line by the end' },
      { id: 'scott', name: 'Scott', role: 'Living His Best Life', color: '#a855f7', tagline: 'Born for holidays, thriving every single day' },
    ],
  });

  if (legacyItinerary) {
    await redis.set(`itinerary:${holiday.id}`, legacyItinerary);
    await redis.del('itinerary:main');
  }
  if (legacyTodos) {
    await redis.set(`todos:${holiday.id}`, legacyTodos);
    await redis.del('todos:main');
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, name, password } = await req.json();
    if (!email || !name || !password) {
      return NextResponse.json({ success: false, message: 'Name, email and password are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ success: false, message: 'An account with that email already exists' }, { status: 409 });
    }

    const user = await createUser(email, name, password);
    await migrateLegacyData(user.id);

    const token = await new SignJWT({ sub: user.id, email: user.email, name: user.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${AUTH_COOKIE_MAX_AGE}s`)
      .sign(getSecret());

    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
