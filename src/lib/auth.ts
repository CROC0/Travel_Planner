import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/lib/constants';
import { getSecret } from '@/lib/jwt';

export async function getUserFromRequest(): Promise<{ userId: string; email: string; name: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] });
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
