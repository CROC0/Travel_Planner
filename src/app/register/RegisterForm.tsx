'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plane, UserPlus } from 'lucide-react';

export function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        window.location.href = '/';
      } else {
        const data = await res.json();
        setError(data.message ?? 'Registration failed');
        setLoading(false);
      }
    } catch {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen aurora-bg flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(0,229,204,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,204,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl glass box-glow-teal mb-5">
            <Plane className="w-7 h-7 text-[#00e5cc]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="shimmer-text">TRIP PLANNER</span>
          </h1>
          <p className="text-[#8888aa] text-sm">Create your account to start planning</p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8 box-glow-teal">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="w-4 h-4 text-[#00e5cc]" />
            <span className="text-[#8888aa] text-sm">New account</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Your name"
              required
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#8888aa] focus:outline-none focus:border-[#00e5cc] focus:ring-1 focus:ring-[#00e5cc] transition-colors"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="Email address"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#8888aa] focus:outline-none focus:border-[#00e5cc] focus:ring-1 focus:ring-[#00e5cc] transition-colors"
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              placeholder="Password (min 6 characters)"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#8888aa] focus:outline-none focus:border-[#00e5cc] focus:ring-1 focus:ring-[#00e5cc] transition-colors"
            />

            {error && <p className="text-red-400 text-sm flex items-center gap-2"><span>⚠</span> {error}</p>}

            <button
              type="submit"
              disabled={loading || !form.name || !form.email || !form.password}
              className="w-full py-3 rounded-xl font-semibold text-[#0a0a0f] transition-all duration-200 disabled:opacity-50"
              style={{ background: loading ? '#00e5cc88' : 'linear-gradient(135deg, #00e5cc, #00b8a6)', boxShadow: loading ? 'none' : '0 0 20px #00e5cc44' }}
            >
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#8888aa] text-xs mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#00e5cc] hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
