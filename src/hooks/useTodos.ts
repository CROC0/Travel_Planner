'use client';

import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import type { TodoItem, TodoCategory } from '@/types';
import { todosCacheKey } from '@/lib/constants';

function readCache(holidayId: string): TodoItem[] | null {
  try {
    const raw = localStorage.getItem(todosCacheKey(holidayId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch { return null; }
}

function writeCache(holidayId: string, data: TodoItem[]) {
  try { localStorage.setItem(todosCacheKey(holidayId), JSON.stringify(data)); } catch {}
}

export function useTodos(holidayId: string) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = readCache(holidayId);
    if (cached) setTodos(cached);

    fetch(`/api/holidays/${holidayId}/todos`)
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          setTodos(data as TodoItem[]);
          writeCache(holidayId, data as TodoItem[]);
        } else if (!cached) {
          setTodos([]);
        }
      })
      .catch(() => { if (!cached) setTodos([]); })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holidayId]);

  const addTodo = useCallback(async (text: string, category: TodoCategory) => {
    const item: TodoItem = { id: nanoid(), text, completed: false, category, createdAt: Date.now() };
    setTodos((prev) => { const next = [item, ...prev]; writeCache(holidayId, next); return next; });
    try {
      const res = await fetch(`/api/holidays/${holidayId}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTodos(data); writeCache(holidayId, data);
    } catch {
      toast.error('Failed to save todo');
    }
  }, [holidayId]);

  const toggleTodo = useCallback(async (id: string) => {
    setTodos((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      writeCache(holidayId, next);
      return next;
    });
    try {
      const current = todos.find((t) => t.id === id);
      const res = await fetch(`/api/holidays/${holidayId}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !current?.completed }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error('Failed to update todo');
    }
  }, [holidayId, todos]);

  const deleteTodo = useCallback(async (id: string) => {
    setTodos((prev) => { const next = prev.filter((t) => t.id !== id); writeCache(holidayId, next); return next; });
    try {
      const res = await fetch(`/api/holidays/${holidayId}/todos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
    } catch {
      toast.error('Failed to delete todo');
    }
  }, [holidayId]);

  const editTodo = useCallback(async (id: string, text: string) => {
    setTodos((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, text } : t));
      writeCache(holidayId, next);
      return next;
    });
    try {
      const res = await fetch(`/api/holidays/${holidayId}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error('Failed to update todo');
    }
  }, [holidayId]);

  const completed = todos.filter((t) => t.completed).length;
  return { todos, loading, completed, total: todos.length, addTodo, toggleTodo, deleteTodo, editTodo };
}
