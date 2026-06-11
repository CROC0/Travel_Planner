import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/constants';
import { getSecret } from '@/lib/jwt';

// Holiday view paths reachable without login (excludes /holidays/new).
// NOTE: this is only an *optimistic* allow so that public share links resolve
// without a session. The real owner-or-public authorization check is performed
// server-side in the holiday layout and the itinerary API.
const PUBLIC_HOLIDAY_PAGE_RE = /^\/holidays\/(?!new$)[^/]+(\/itinerary(\/\d+)?|\/calendar|\/explore(\/.*)?)?$/;
const PUBLIC_ITINERARY_API_RE = /^\/api\/holidays\/[^/]+\/itinerary$/;

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow unauthenticated access to holiday view pages and the itinerary API.
  if (PUBLIC_HOLIDAY_PAGE_RE.test(pathname) || PUBLIC_ITINERARY_API_RE.test(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (token) {
    try {
      await jwtVerify(token, getSecret(), { algorithms: ['HS256'] });
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
    '/((?!login|register|api/auth|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
