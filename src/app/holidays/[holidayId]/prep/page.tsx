'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { useTodos } from '@/hooks/useTodos';
import { useHoliday } from '@/context/HolidayContext';
import type { TodoCategory } from '@/types';

const CATEGORIES: { value: TodoCategory; label: string; color: string; emoji: string }[] = [
  { value: 'general',   label: 'General',   color: '#8888aa', emoji: '✅' },
  { value: 'documents', label: 'Docs',      color: '#00e5cc', emoji: '📄' },
  { value: 'packing',   label: 'Packing',   color: '#a855f7', emoji: '🧳' },
  { value: 'bookings',  label: 'Bookings',  color: '#ffd700', emoji: '🎫' },
  { value: 'money',     label: 'Money',     color: '#10b981', emoji: '💳' },
  { value: 'health',    label: 'Health',    color: '#ff6eb4', emoji: '💊' },
];

function catMeta(value: TodoCategory) {
  return CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[0];
}

function TodoRow({ item, onToggle, onDelete, onEdit }: {
  item: { id: string; text: string; completed: boolean; category: TodoCategory };
  onToggle: () => void; onDelete: () => void; onEdit: (text: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.text);
  const inputRef = useRef<HTMLInputElement>(null);
  const meta = catMeta(item.category);

  function commitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== item.text) onEdit(trimmed);
    setEditing(false);
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') { setDraft(item.text); setEditing(false); }
  }

  return (
    <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl glass group transition-all duration-200" style={{ border: `1px solid ${item.completed ? 'rgba(255,255,255,0.04)' : `${meta.color}22`}` }}>
      <button onClick={onToggle} className="flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200" style={{ borderColor: item.completed ? meta.color : `${meta.color}66`, background: item.completed ? meta.color : 'transparent' }}>
        {item.completed && <Check className="w-3 h-3 text-[#0a0a0f]" strokeWidth={3} />}
      </button>
      <span className="text-sm flex-shrink-0" title={meta.label}>{meta.emoji}</span>
      {editing ? (
        <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={handleKey} onBlur={commitEdit} autoFocus className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-[#00e5cc]" />
      ) : (
        <span className="flex-1 text-sm leading-snug transition-colors" style={{ color: item.completed ? '#555577' : '#ddddee', textDecoration: item.completed ? 'line-through' : 'none' }}>{item.text}</span>
      )}
      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {!item.completed && !editing && (
          <button onClick={() => { setDraft(item.text); setEditing(true); }} className="p-1.5 rounded-lg hover:bg-white/10 text-[#8888aa] hover:text-[#ffd700] transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
        )}
        {editing && (
          <button onClick={() => { setDraft(item.text); setEditing(false); }} className="p-1.5 rounded-lg hover:bg-white/10 text-[#8888aa] hover:text-white transition-colors"><X className="w-3.5 h-3.5" /></button>
        )}
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#8888aa] hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}

export default function PrepPage() {
  const holiday = useHoliday();
  const { todos, loading, completed, total, addTodo, toggleTodo, deleteTodo, editTodo } = useTodos(holiday.id);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState<TodoCategory>('general');
  const [filter, setFilter] = useState<TodoCategory | 'all'>('all');

  function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed) return;
    addTodo(trimmed, category);
    setInput('');
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAdd();
  }

  const pending = todos.filter((t) => !t.completed);
  const done = todos.filter((t) => t.completed);
  const visible = (list: typeof todos) => filter === 'all' ? list : list.filter((t) => t.category === filter);
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
        <SectionHeading title="Trip Prep" subtitle="Everything to sort before you fly" accent="gold" symbol="◎" />

        {total > 0 && (
          <div className="glass rounded-2xl p-4 mb-6" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#8888aa] text-xs uppercase tracking-widest">Progress</span>
              <span className="text-white font-bold tabular-nums text-sm">{completed} / {total}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: pct === 100 ? '#10b981' : '#ffd700' }} />
            </div>
            {pct === 100 && <p className="text-[#10b981] text-xs mt-2 text-center font-medium">All done — you&apos;re ready! 🎉</p>}
          </div>
        )}

        <div className="glass rounded-2xl p-3 sm:p-4 mb-4" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex gap-2 mb-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Add a task…" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#8888aa] focus:outline-none focus:border-[#ffd700] transition-colors" />
            <button onClick={handleAdd} disabled={!input.trim()} className="px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 transition-all" style={{ background: 'linear-gradient(135deg, #ffd700, #f59e0b)', color: '#0a0a0f' }}>Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(({ value, label, color, emoji }) => (
              <button key={value} onClick={() => setCategory(value)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                style={category === value ? { background: `${color}25`, color, border: `1px solid ${color}44` } : { color: '#555577', border: '1px solid rgba(255,255,255,0.06)' }}>
                {emoji} {label}
              </button>
            ))}
          </div>
        </div>

        {total > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            <button onClick={() => setFilter('all')} className="px-3 py-1 rounded-lg text-xs font-medium transition-all" style={filter === 'all' ? { background: '#ffffff15', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' } : { color: '#555577', border: '1px solid rgba(255,255,255,0.06)' }}>All</button>
            {CATEGORIES.filter((c) => todos.some((t) => t.category === c.value)).map(({ value, label, color, emoji }) => (
              <button key={value} onClick={() => setFilter(value)} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={filter === value ? { background: `${color}25`, color, border: `1px solid ${color}44` } : { color: '#555577', border: '1px solid rgba(255,255,255,0.06)' }}>
                {emoji} {label}
              </button>
            ))}
          </div>
        )}

        {loading && <div className="flex justify-center py-16"><div className="w-8 h-8 rounded-full border-2 border-[#ffd700] border-t-transparent animate-spin" /></div>}

        {!loading && (
          <div className="space-y-2 mb-6">
            {visible(pending).length === 0 && total === 0 && (
              <div className="text-center py-12"><p className="text-4xl mb-3">📋</p><p className="text-[#8888aa] text-sm">No tasks yet — add something above</p></div>
            )}
            {visible(pending).map((item) => (
              <TodoRow key={item.id} item={item} onToggle={() => toggleTodo(item.id)} onDelete={() => deleteTodo(item.id)} onEdit={(text) => editTodo(item.id, text)} />
            ))}
          </div>
        )}

        {!loading && visible(done).length > 0 && (
          <div>
            <p className="text-[#555577] text-xs uppercase tracking-widest mb-2 px-1">Completed</p>
            <div className="space-y-2">
              {visible(done).map((item) => (
                <TodoRow key={item.id} item={item} onToggle={() => toggleTodo(item.id)} onDelete={() => deleteTodo(item.id)} onEdit={(text) => editTodo(item.id, text)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
