import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getHoliday, ownedByUser } from '@/lib/holidays';
import { updateTodo, deleteTodo } from '@/lib/kv';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ holidayId: string; id: string }> }) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { holidayId, id } = await params;
  const holiday = await getHoliday(holidayId);
  if (!holiday || !ownedByUser(holiday, user.userId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    const patch = await req.json();
    const todos = await updateTodo(holidayId, id, patch);
    return NextResponse.json(todos);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ holidayId: string; id: string }> }) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { holidayId, id } = await params;
  const holiday = await getHoliday(holidayId);
  if (!holiday || !ownedByUser(holiday, user.userId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    const todos = await deleteTodo(holidayId, id);
    return NextResponse.json(todos);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
