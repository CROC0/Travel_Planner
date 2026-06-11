'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Settings, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useHoliday, useIsOwner } from '@/context/HolidayContext';
import type { CrewMember } from '@/types';

const COVER_EMOJIS = ['✈️', '🌏', '🏖️', '🏔️', '🗺️', '🦁', '🌸', '🎌', '🇪🇺', '🗼', '🏝️', '⛰️'];
const CREW_EMOJIS = ['😎', '🤩', '🥳', '😄', '🧑‍💻', '👩‍🎨', '🧳', '🎒', '🏄', '🌴', '🦋', '⭐'];
const CREW_COLORS = ['#00e5cc', '#ffd700', '#ff6b9d', '#a78bfa', '#f97316', '#22d3ee', '#4ade80', '#fb7185'];

const BLANK_MEMBER = { name: '', role: '', emoji: '', color: '#00e5cc', tagline: '' };

export default function EditHolidayPage() {
  const holiday = useHoliday();
  const isOwner = useIsOwner();
  const router = useRouter();

  const [form, setForm] = useState({
    name: holiday.name,
    destination: holiday.destination,
    startDate: holiday.startDate,
    endDate: holiday.endDate,
    coverEmoji: holiday.coverEmoji ?? '✈️',
  });
  const [crew, setCrew] = useState<CrewMember[]>(holiday.crew ?? []);
  const [newMember, setNewMember] = useState(BLANK_MEMBER);
  const [addingMember, setAddingMember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOwner) router.replace(`/login?from=/holidays/${holiday.id}/edit`);
  }, [isOwner, holiday.id, router]);

  if (!isOwner) return null;

  function setField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function removeMember(id: string) {
    setCrew((prev) => prev.filter((m) => m.id !== id));
  }

  function addMember() {
    if (!newMember.name.trim() || !newMember.role.trim()) return;
    setCrew((prev) => [
      ...prev,
      {
        id: nanoid(),
        name: newMember.name.trim(),
        role: newMember.role.trim(),
        emoji: newMember.emoji || undefined,
        color: newMember.color || undefined,
        tagline: newMember.tagline.trim() || undefined,
      },
    ]);
    setNewMember(BLANK_MEMBER);
    setAddingMember(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/holidays/${holiday.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, crew }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Something went wrong');
        setLoading(false);
        return;
      }
      router.push(`/holidays/${holiday.id}`);
    } catch {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-4">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'linear-gradient(rgba(0,229,204,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,204,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />
      <div className="relative z-10 w-full max-w-md">
        <Link href={`/holidays/${holiday.id}`} className="inline-flex items-center gap-1.5 text-[#8888aa] hover:text-[#00e5cc] text-sm transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to holiday
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl glass box-glow-teal mb-5">
            <Settings className="w-7 h-7 text-[#00e5cc]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Edit Holiday</h1>
          <p className="text-[#8888aa] text-sm">{holiday.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Holiday details */}
          <div className="glass rounded-2xl p-6 sm:p-8 box-glow-teal space-y-4">
            <div>
              <label className="text-[#8888aa] text-xs uppercase tracking-wider mb-1.5 block">Holiday name</label>
              <input
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="e.g. Singapore 2026"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#555577] focus:outline-none focus:border-[#00e5cc] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="text-[#8888aa] text-xs uppercase tracking-wider mb-1.5 block">Destination</label>
              <input
                value={form.destination}
                onChange={(e) => setField('destination', e.target.value)}
                placeholder="e.g. Singapore"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#555577] focus:outline-none focus:border-[#00e5cc] transition-colors text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#8888aa] text-xs uppercase tracking-wider mb-1.5 block">Start date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setField('startDate', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00e5cc] transition-colors text-sm [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-[#8888aa] text-xs uppercase tracking-wider mb-1.5 block">End date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setField('endDate', e.target.value)}
                  required
                  min={form.startDate}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00e5cc] transition-colors text-sm [color-scheme:dark]"
                />
              </div>
            </div>
            <div>
              <label className="text-[#8888aa] text-xs uppercase tracking-wider mb-1.5 block">Cover emoji</label>
              <div className="flex flex-wrap gap-2">
                {COVER_EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setField('coverEmoji', e)}
                    className="w-10 h-10 rounded-xl text-xl transition-all"
                    style={form.coverEmoji === e ? { background: '#00e5cc22', border: '1px solid #00e5cc44' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Crew */}
          <div className="glass rounded-2xl p-6 sm:p-8 space-y-4" style={{ border: '1px solid rgba(255,215,0,0.15)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">The Crew</p>
                <p className="text-[#8888aa] text-xs mt-0.5">Who&apos;s coming along</p>
              </div>
              {!addingMember && (
                <button
                  type="button"
                  onClick={() => setAddingMember(true)}
                  className="inline-flex items-center gap-1 text-xs text-[#ffd700] hover:text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add member
                </button>
              )}
            </div>

            {/* Existing members */}
            {crew.length > 0 && (
              <div className="space-y-2">
                {crew.map((member) => {
                  const color = member.color ?? '#00e5cc';
                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                      style={{ background: `${color}0a`, border: `1px solid ${color}22` }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
                        style={{ background: `${color}18`, color }}
                      >
                        {member.emoji ?? member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold leading-tight">{member.name}</p>
                        <p className="text-xs mt-0.5" style={{ color }}>{member.role}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="text-[#555577] hover:text-red-400 transition-colors p-1 flex-shrink-0"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {crew.length === 0 && !addingMember && (
              <p className="text-[#555577] text-sm text-center py-2">No crew yet — add someone above</p>
            )}

            {/* Add member form */}
            {addingMember && (
              <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#8888aa] text-xs uppercase tracking-wider mb-1 block">Name</label>
                    <input
                      value={newMember.name}
                      onChange={(e) => setNewMember((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Matt"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-[#555577] focus:outline-none focus:border-[#ffd700] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[#8888aa] text-xs uppercase tracking-wider mb-1 block">Role</label>
                    <input
                      value={newMember.role}
                      onChange={(e) => setNewMember((p) => ({ ...p, role: e.target.value }))}
                      placeholder="e.g. Navigator"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-[#555577] focus:outline-none focus:border-[#ffd700] transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[#8888aa] text-xs uppercase tracking-wider mb-1 block">Tagline (optional)</label>
                  <input
                    value={newMember.tagline}
                    onChange={(e) => setNewMember((p) => ({ ...p, tagline: e.target.value }))}
                    placeholder="e.g. Always loses the passports"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-[#555577] focus:outline-none focus:border-[#ffd700] transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="text-[#8888aa] text-xs uppercase tracking-wider mb-1 block">Emoji</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CREW_EMOJIS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setNewMember((p) => ({ ...p, emoji: p.emoji === e ? '' : e }))}
                        className="w-9 h-9 rounded-lg text-lg transition-all"
                        style={newMember.emoji === e ? { background: '#ffd70022', border: '1px solid #ffd70044' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[#8888aa] text-xs uppercase tracking-wider mb-1 block">Colour</label>
                  <div className="flex gap-2">
                    {CREW_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewMember((p) => ({ ...p, color: c }))}
                        className="w-7 h-7 rounded-full transition-all"
                        style={{
                          background: c,
                          boxShadow: newMember.color === c ? `0 0 0 2px #0a0a0f, 0 0 0 4px ${c}` : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={addMember}
                    disabled={!newMember.name.trim() || !newMember.role.trim()}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold text-[#0a0a0f] disabled:opacity-40 transition-all"
                    style={{ background: 'linear-gradient(135deg, #ffd700, #f59e0b)' }}
                  >
                    Add to crew
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAddingMember(false); setNewMember(BLANK_MEMBER); }}
                    className="px-4 py-2 rounded-lg text-sm text-[#8888aa] hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-sm flex items-center gap-2"><span>⚠</span> {error}</p>}

          <button
            type="submit"
            disabled={loading || !form.name || !form.destination || !form.startDate || !form.endDate}
            className="w-full py-3 rounded-xl font-semibold text-[#0a0a0f] transition-all duration-200 disabled:opacity-50"
            style={{ background: loading ? '#00e5cc88' : 'linear-gradient(135deg, #00e5cc, #00b8a6)', boxShadow: loading ? 'none' : '0 0 20px #00e5cc44' }}
          >
            {loading ? 'Saving…' : 'Save Changes →'}
          </button>
        </form>
      </div>
    </div>
  );
}
