import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/lib/constants';

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.SITE_PASSWORD ?? '');
}

export async function getUserFromRequest(): Promise<{ userId: string; email: string; name: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || !payload.email) return null;
    return {
      userId: payload.sub as string,
      email: payload.email as string,
      name: (payload.name as string) ?? '',
    };
  } catch {
    return null;
  }
}
