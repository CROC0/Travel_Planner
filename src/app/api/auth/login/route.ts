import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from '@/lib/constants';
import { getUserByEmail, verifyPassword } from '@/lib/users';

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.SITE_PASSWORD ?? '');
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

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
