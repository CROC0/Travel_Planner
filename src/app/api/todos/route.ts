import { NextResponse } from 'next/server';
import { getTodos, addTodo } from '@/lib/kv';
import type { TodoItem } from '@/types';

export async function GET() {
  try {
    const todos = await getTodos();
    return NextResponse.json(todos);
  } catch (err) {
    console.error('GET /api/todos error:', err);
    return NextResponse.json({ error: 'Failed to load todos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const item: TodoItem = await req.json();
    const todos = await addTodo(item);
    return NextResponse.json(todos);
  } catch (err) {
    console.error('POST /api/todos error:', err);
    return NextResponse.json({ error: 'Failed to add todo' }, { status: 500 });
  }
}
