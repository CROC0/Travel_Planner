import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getHoliday, ownedByUser } from '@/lib/holidays';
import { getTodos, addTodo } from '@/lib/kv';
import type { TodoItem } from '@/types';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ holidayId: string }> }) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { holidayId } = await params;
  const holiday = await getHoliday(holidayId);
  if (!holiday || !ownedByUser(holiday, user.userId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    const todos = await getTodos(holidayId);
    return NextResponse.json(todos);
  } catch {
    return NextResponse.json({ error: 'Failed to load todos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ holidayId: string }> }) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { holidayId } = await params;
  const holiday = await getHoliday(holidayId);
  if (!holiday || !ownedByUser(holiday, user.userId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    const item: TodoItem = await req.json();
    const todos = await addTodo(holidayId, item);
    return NextResponse.json(todos);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
