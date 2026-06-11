import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/constants';

export async function POST(req: NextRequest) {
  const loginUrl = new URL('/login', req.nextUrl.origin);
  const res = NextResponse.redirect(loginUrl);
  res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return res;
}
