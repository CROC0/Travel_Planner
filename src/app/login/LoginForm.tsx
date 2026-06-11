'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plane, Lock } from 'lucide-react';

export function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = params.get('from') ?? '/';
      } else {
        const data = await res.json();
        setError(data.message ?? 'Incorrect password');
        setLoading(false);
      }
    } catch {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen aurora-bg flex items-center justify-center p-4 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,229,204,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,204,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / heading */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl glass box-glow-teal mb-5 sm:mb-6">
            <Plane className="w-7 h-7 sm:w-8 sm:h-8 text-[#00e5cc]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            <span className="shimmer-text">SINGAPORE</span>
          </h1>
          <p className="text-[#8888aa] text-sm tracking-widest uppercase">
            25 Sep – 4 Oct 2026
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-6 sm:p-8 box-glow-teal">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-[#00e5cc]" />
            <span className="text-[#8888aa] text-sm">Private trip planner</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#8888aa] focus:outline-none focus:border-[#00e5cc] focus:ring-1 focus:ring-[#00e5cc] transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <span>⚠</span> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl font-semibold text-[#0a0a0f] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? '#00e5cc88'
                  : 'linear-gradient(135deg, #00e5cc, #00b8a6)',
                boxShadow: loading ? 'none' : '0 0 20px #00e5cc44',
              }}
            >
              {loading ? 'Unlocking...' : 'Enter →'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#8888aa] text-xs mt-6">
          🦁 Singapore 2026
        </p>
      </div>
    </main>
  );
}
