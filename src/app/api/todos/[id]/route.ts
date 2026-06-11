import { NextResponse } from 'next/server';
import { updateTodo, deleteTodo } from '@/lib/kv';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const patch = await req.json();
    const todos = await updateTodo(id, patch);
    return NextResponse.json(todos);
  } catch (err) {
    console.error('PATCH /api/todos/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const todos = await deleteTodo(id);
    return NextResponse.json(todos);
  } catch (err) {
    console.error('DELETE /api/todos/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
