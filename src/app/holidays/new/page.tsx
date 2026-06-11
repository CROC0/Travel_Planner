'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plane } from 'lucide-react';

export default function NewHolidayPage() {
  const [form, setForm] = useState({ name: '', destination: '', startDate: '', endDate: '', coverEmoji: '✈️' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Something went wrong');
        setLoading(false);
        return;
      }
      const holiday = await res.json();
      window.location.href = `/holidays/${holiday.id}`;
    } catch {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  const EMOJIS = ['✈️', '🌏', '🏖️', '🏔️', '🗺️', '🦁', '🌸', '🎌', '🇪🇺', '🗼', '🏝️', '⛰️'];

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-4">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'linear-gradient(rgba(0,229,204,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,204,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />
      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[#8888aa] hover:text-[#00e5cc] text-sm transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl glass box-glow-teal mb-5">
            <Plane className="w-7 h-7 text-[#00e5cc]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">New Holiday</h1>
          <p className="text-[#8888aa] text-sm">Start planning your next adventure</p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8 box-glow-teal">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[#8888aa] text-xs uppercase tracking-wider mb-1.5 block">Holiday name</label>
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Singapore 2026"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#555577] focus:outline-none focus:border-[#00e5cc] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="text-[#8888aa] text-xs uppercase tracking-wider mb-1.5 block">Destination</label>
              <input
                value={form.destination}
                onChange={(e) => set('destination', e.target.value)}
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
                  onChange={(e) => set('startDate', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00e5cc] transition-colors text-sm [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-[#8888aa] text-xs uppercase tracking-wider mb-1.5 block">End date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => set('endDate', e.target.value)}
                  required
                  min={form.startDate}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00e5cc] transition-colors text-sm [color-scheme:dark]"
                />
              </div>
            </div>
            <div>
              <label className="text-[#8888aa] text-xs uppercase tracking-wider mb-1.5 block">Cover emoji</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => set('coverEmoji', e)}
                    className="w-10 h-10 rounded-xl text-xl transition-all"
                    style={form.coverEmoji === e ? { background: '#00e5cc22', border: '1px solid #00e5cc44' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm flex items-center gap-2"><span>⚠</span> {error}</p>}

            <button
              type="submit"
              disabled={loading || !form.name || !form.destination || !form.startDate || !form.endDate}
              className="w-full py-3 rounded-xl font-semibold text-[#0a0a0f] transition-all duration-200 disabled:opacity-50 mt-2"
              style={{ background: loading ? '#00e5cc88' : 'linear-gradient(135deg, #00e5cc, #00b8a6)', boxShadow: loading ? 'none' : '0 0 20px #00e5cc44' }}
            >
              {loading ? 'Creating…' : 'Create Holiday →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
