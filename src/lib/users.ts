import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import type { User } from '@/types';
import { redis } from '@/lib/kv';

export async function createUser(email: string, name: string, password: string): Promise<Omit<User, 'passwordHash'>> {
  const id = nanoid();
  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = { id, email: email.toLowerCase(), name, passwordHash, createdAt: Date.now() };
  await redis.set(`user:${id}`, user);
  await redis.set(`user:email:${email.toLowerCase()}`, id);
  return { id, email: user.email, name, createdAt: user.createdAt };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const id = await redis.get<string>(`user:email:${email.toLowerCase()}`);
  if (!id) return null;
  return redis.get<User>(`user:${id}`);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
