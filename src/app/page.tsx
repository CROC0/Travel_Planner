import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plane, Plus, Calendar, MapPin } from 'lucide-react';
import { getUserFromRequest } from '@/lib/auth';
import { listHolidays } from '@/lib/holidays';
import type { Holiday } from '@/types';

function HolidayCard({ holiday }: { holiday: Holiday }) {
  const fmt = (d: string) =>
    new Date(d + 'T00:00:00Z').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const start = new Date(holiday.startDate + 'T00:00:00Z');
  const end = new Date(holiday.endDate + 'T00:00:00Z');
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1);
  const daysUntil = Math.ceil((start.getTime() - Date.now()) / 86_400_000);

  return (
    <Link href={`/holidays/${holiday.id}`} className="group block">
      <div className="glass rounded-2xl p-5 sm:p-6 hover:scale-[1.01] transition-all duration-200 h-full flex flex-col gap-4" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 glass" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            {holiday.coverEmoji ?? '✈️'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg group-hover:text-[#00e5cc] transition-colors truncate">{holiday.name}</h3>
            <p className="text-[#8888aa] text-sm flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0" /> {holiday.destination}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#8888aa]">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{fmt(holiday.startDate)} – {fmt(holiday.endDate)}</span>
          </div>
          <span>·</span>
          <span>{days} days</span>
        </div>
        {daysUntil > 0 && (
          <p className="text-xs" style={{ color: '#00e5cc' }}>{daysUntil} day{daysUntil !== 1 ? 's' : ''} until departure</p>
        )}
        {daysUntil <= 0 && daysUntil > -days && (
          <p className="text-xs text-[#ffd700]">Trip in progress!</p>
        )}
        <div className="mt-auto flex items-center justify-between">
          {holiday.crew && holiday.crew.length > 0 && (
            <div className="flex -space-x-2">
              {holiday.crew.slice(0, 4).map((m) => (
                <div key={m.id} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border border-[#0a0a0f]" style={{ background: `${m.color ?? '#00e5cc'}22`, color: m.color ?? '#00e5cc', borderColor: m.color ?? '#00e5cc' }}>
                  {m.emoji ?? m.name.charAt(0)}
                </div>
              ))}
            </div>
          )}
          <span className="ml-auto text-[#00e5cc] group-hover:translate-x-1 transition-transform text-sm">Open →</span>
        </div>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const user = await getUserFromRequest();
  if (!user) redirect('/login');

  const holidays = await listHolidays(user.userId);

  return (
    <div className="min-h-screen aurora-bg">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,229,204,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,204,0.8) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 sm:py-16">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Plane className="w-6 h-6 text-[#00e5cc]" />
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                <span className="text-[#00e5cc]">My</span> Holidays
              </h1>
            </div>
            <p className="text-[#8888aa] text-sm">Welcome back, {user.name}</p>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="text-xs text-[#555577] hover:text-[#8888aa] transition-colors px-3 py-2 glass rounded-lg">
              Sign out
            </button>
          </form>
        </div>

        {holidays.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✈️</div>
            <h2 className="text-white font-bold text-xl mb-2">No holidays yet</h2>
            <p className="text-[#8888aa] text-sm mb-8">Create your first holiday to start planning</p>
            <Link
              href="/holidays/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[#0a0a0f] transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #00e5cc, #00b8a6)', boxShadow: '0 0 20px #00e5cc44' }}
            >
              <Plus className="w-4 h-4" /> Create Holiday
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {holidays.map((h) => (
                <HolidayCard key={h.id} holiday={h} />
              ))}
            </div>
            <div className="flex justify-center">
              <Link
                href="/holidays/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold glass transition-all hover:scale-[1.02] duration-200"
                style={{ border: '1px solid rgba(0,229,204,0.2)', color: '#00e5cc' }}
              >
                <Plus className="w-4 h-4" /> New Holiday
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
