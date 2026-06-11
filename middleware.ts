import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/constants';

function getSecret(): Uint8Array {
  const pw = process.env.SITE_PASSWORD ?? '';
  return new TextEncoder().encode(pw);
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (token) {
    try {
      await jwtVerify(token, getSecret());
      return NextResponse.next();
    } catch {
      // Invalid/expired token — fall through to redirect
    }
  }

  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('from', req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/((?!login|api/auth|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
