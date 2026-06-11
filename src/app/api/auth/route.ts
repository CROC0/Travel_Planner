import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from '@/lib/constants';

export const runtime = 'edge';

function getSecret(): Uint8Array {
  const pw = process.env.SITE_PASSWORD;
  if (!pw) throw new Error('SITE_PASSWORD not set');
  return new TextEncoder().encode(pw);
}

// Constant-time string comparison to prevent timing attacks
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const expected = process.env.SITE_PASSWORD ?? '';

    if (!password || !safeCompare(String(password), expected)) {
      return NextResponse.json({ success: false, message: 'Incorrect password' }, { status: 401 });
    }

    const token = await new SignJWT({ authorized: true })
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
