'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Activity, ActivityCategory, Itinerary } from '@/types';
import { TRIP_DAY_DATES } from '@/data/trip-config';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// ─── Layout constants ──────────────────────────────────────────────────────────
const START_HOUR = 6;
const END_HOUR = 23;
const HOUR_H = 64;          // px per hour
const TOTAL_HOURS = END_HOUR - START_HOUR;
const TOTAL_H = TOTAL_HOURS * HOUR_H;
const TIME_W = 56;          // px — left gutter
const DAY_W = 158;          // px — each day column

// ─── Category palette (mirrors ActivityItem) ──────────────────────────────────
const CAT_COLOR: Record<ActivityCategory, string> = {
  sightseeing:   '#00e5cc',
  food:          '#ffd700',
  transport:     '#8888aa',
  accommodation: '#10b981',
  shopping:      '#ff6eb4',
  nature:        '#22c55e',
  nightlife:     '#a855f7',
  beach:         '#3b82f6',
  culture:       '#f97316',
  free:          '#64748b',
};

const CAT_EMOJI: Record<ActivityCategory, string> = {
  sightseeing:   '👁',
  food:          '🍜',
  transport:     '🚇',
  accommodation: '🏨',
  shopping:      '🛍',
  nature:        '🌿',
  nightlife:     '🌃',
  beach:         '🏖',
  culture:       '🎭',
  free:          '✨',
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function toMins(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function toY(t: string) {
  return ((toMins(t) - START_HOUR * 60) / 60) * HOUR_H;
}
function fmtHour(h: number) {
  if (h === 0 || h === 24) return '12am';
  if (h < 12) return `${h}am`;
  if (h === 12) return '12pm';
  return `${h - 12}pm`;
}

const HOURS = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => START_HOUR + i);
const DAY_NAMES  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MON_NAMES  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── Activity block ────────────────────────────────────────────────────────────
function Block({ a, dayNum }: { a: Activity; dayNum: number }) {
  const [hot, setHot] = useState(false);
  if (!a.startTime) return null;

  const startMins = toMins(a.startTime);
  if (startMins < START_HOUR * 60 || startMins >= END_HOUR * 60) return null;

  const y      = toY(a.startTime);
  const endH   = a.endTime ? Math.max(((toMins(a.endTime) - startMins) / 60) * HOUR_H, 24) : HOUR_H;
  const top    = Math.max(0, Math.min(y, TOTAL_H - 24));
  const height = Math.min(endH, TOTAL_H - top) - 2;
  const color  = CAT_COLOR[a.category];
  const emoji  = a.emoji ?? CAT_EMOJI[a.category];
  const short  = height < 46;

  return (
    <Link
      href={`/itinerary/${dayNum}`}
      className="absolute left-1 right-1 rounded-[6px] overflow-hidden select-none transition-all duration-100"
      style={{
        top: top + 1,
        height,
        background: hot ? `${color}28` : `${color}16`,
        borderLeft: `3px solid ${color}`,
        boxShadow: hot ? `0 2px 16px ${color}44, inset 0 0 0 1px ${color}22` : `inset 0 0 0 1px ${color}14`,
        zIndex: hot ? 20 : 2,
      }}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
    >
      <div className="px-1.5 pt-[3px] pb-1 h-full flex flex-col justify-start overflow-hidden">
        <p className="text-white leading-tight font-medium truncate" style={{ fontSize: 10 }}>
          {emoji} {a.title}
        </p>
        {!short && (
          <p className="truncate mt-0.5 opacity-70 font-mono tabular-nums" style={{ fontSize: 9, color }}>
            {a.startTime}{a.endTime ? `–${a.endTime}` : ''}
          </p>
        )}
        {!short && height > 76 && a.location && (
          <p className="truncate mt-0.5" style={{ fontSize: 9, color: '#8888aa' }}>
            📍 {a.location}
          </p>
        )}
      </div>
    </Link>
  );
}

// ─── Unscheduled pill row (no startTime) ──────────────────────────────────────
function Unscheduled({ activities }: { activities: Activity[] }) {
  const items = activities.filter(a => !a.startTime);
  if (!items.length) return <div className="h-1" />;
  return (
    <div className="p-1 space-y-0.5">
      {items.map(a => {
        const color = CAT_COLOR[a.category];
        return (
          <div key={a.id} className="rounded px-1.5 py-0.5 truncate"
            style={{ background: `${color}20`, borderLeft: `2px solid ${color}`, fontSize: 9, color: '#ddd' }}>
            {a.emoji ?? CAT_EMOJI[a.category]} {a.title}
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared day-builder ────────────────────────────────────────────────────────
function buildDays(itinerary: Itinerary) {
  return TRIP_DAY_DATES.map((date, i) => {
    const d = new Date(date + 'T12:00:00');
    return {
      date,
      dayNum: i + 1,
      name:   DAY_NAMES[d.getDay()],
      num:    d.getDate(),
      mon:    MON_NAMES[d.getMonth()],
      plan:   itinerary[i],
    };
  });
}

// ─── Mobile: single-day timeline with prev/next nav ───────────────────────────
function MobileScheduleView({ itinerary }: { itinerary: Itinerary }) {
  const days = buildDays(itinerary);
  const [idx, setIdx] = useState(0);
  const { date, dayNum, name, num, mon, plan } = days[idx];
  const count = plan?.activities.length ?? 0;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>

      {/* Day navigation */}
      <div className="flex items-center justify-between sticky top-0 z-30 px-3 py-2"
        style={{ background: '#0c0c14', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={() => setIdx(i => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="p-1.5 rounded-lg transition-colors disabled:opacity-20"
          style={{ color: '#00e5cc' }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <Link href={`/itinerary/${dayNum}`} className="text-center group">
          <p style={{ fontSize: 9, letterSpacing: '0.12em' }} className="text-[#555577] uppercase font-medium">{name}</p>
          <p className="text-white font-bold group-hover:text-[#00e5cc] transition-colors" style={{ fontSize: 22, lineHeight: 1 }}>{num}</p>
          <p style={{ fontSize: 9 }} className="text-[#555577]">{mon}</p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="font-mono tabular-nums px-1.5 py-0.5 rounded"
              style={{ fontSize: 9, background: '#00e5cc12', color: '#00e5cc88', border: '1px solid #00e5cc20' }}>
              D{dayNum}
            </span>
            {count > 0 && (
              <span className="font-mono tabular-nums px-1.5 py-0.5 rounded"
                style={{ fontSize: 9, background: '#ffd70012', color: '#ffd70088', border: '1px solid #ffd70020' }}>
                {count} ✦
              </span>
            )}
          </div>
        </Link>

        <button
          onClick={() => setIdx(i => Math.min(days.length - 1, i + 1))}
          disabled={idx === days.length - 1}
          className="p-1.5 rounded-lg transition-colors disabled:opacity-20"
          style={{ color: '#00e5cc' }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day dots indicator */}
      <div className="flex justify-center gap-1 py-2" style={{ background: '#0c0c14', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {days.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="rounded-full transition-all"
            style={{
              width: i === idx ? 16 : 6,
              height: 6,
              background: i === idx ? '#00e5cc' : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>

      <div style={{ overflowY: 'auto', maxHeight: '72vh' }}>

        {/* Unscheduled strip */}
        {plan && plan.activities.some(a => !a.startTime) && (
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0f' }}>
            <div className="flex items-center gap-2 px-3 py-1.5">
              <span className="text-[#333355]" style={{ fontSize: 8, letterSpacing: '0.1em' }}>ALL DAY</span>
              <div className="flex-1">
                <Unscheduled activities={plan.activities} />
              </div>
            </div>
          </div>
        )}

        {/* Time grid — single day */}
        <div className="flex" style={{ background: '#0a0a0f' }}>

          {/* Time gutter */}
          <div className="flex-shrink-0 sticky left-0 z-20"
            style={{ width: TIME_W, background: '#0a0a0f', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            {HOURS.map(h => (
              <div key={h} className="flex items-start justify-end pr-2 pt-0.5"
                style={{ height: h < END_HOUR ? HOUR_H : 0 }}>
                {h < END_HOUR && (
                  <span className="font-mono tabular-nums"
                    style={{ fontSize: 9, color: '#44445a', userSelect: 'none' }}>
                    {fmtHour(h)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Single day column — fills remaining width */}
          <div key={date} className="relative flex-1"
            style={{ height: TOTAL_H }}>

            {HOURS.map(h => (
              <div key={h} className="absolute left-0 right-0 pointer-events-none"
                style={{
                  top: (h - START_HOUR) * HOUR_H,
                  borderTop: h === START_HOUR ? 'none'
                    : `1px solid rgba(255,255,255,${h % 3 === 0 ? '0.055' : '0.022'})`,
                }} />
            ))}

            {Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i).map(h => (
              <div key={h} className="absolute left-0 right-0 pointer-events-none"
                style={{
                  top: (h - START_HOUR) * HOUR_H + HOUR_H / 2,
                  borderTop: '1px dashed rgba(255,255,255,0.012)',
                }} />
            ))}

            {plan?.activities.map(a => (
              <Block key={a.id} a={a} dayNum={dayNum} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Desktop: full 10-column timeline ─────────────────────────────────────────
function DesktopScheduleView({ itinerary }: { itinerary: Itinerary }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const days = buildDays(itinerary);
  const minW = TIME_W + days.length * DAY_W;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
      <div ref={scrollRef} style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '76vh' }}>
        <div style={{ minWidth: minW }}>

          {/* ── Sticky day-header row ───────────────────────────── */}
          <div className="flex sticky top-0 z-30"
            style={{ background: '#0c0c14', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex-shrink-0 sticky left-0 z-40"
              style={{ width: TIME_W, background: '#0c0c14', borderRight: '1px solid rgba(255,255,255,0.07)' }} />

            {days.map(({ date, dayNum, name, num, mon, plan }) => {
              const count = plan?.activities.length ?? 0;
              return (
                <Link key={date} href={`/itinerary/${dayNum}`}
                  className="flex-shrink-0 group/hdr"
                  style={{ width: DAY_W, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="px-3 py-3 text-center">
                    <p style={{ fontSize: 9, letterSpacing: '0.12em' }}
                      className="text-[#555577] uppercase font-medium">{name}</p>
                    <p className="text-white font-bold mt-0.5 group-hover/hdr:text-[#00e5cc] transition-colors"
                      style={{ fontSize: 22, lineHeight: 1 }}>{num}</p>
                    <p style={{ fontSize: 9 }} className="text-[#555577] mt-0.5">{mon}</p>
                    <div className="flex items-center justify-center gap-1.5 mt-1.5">
                      <span className="font-mono tabular-nums px-1.5 py-0.5 rounded"
                        style={{ fontSize: 9, background: '#00e5cc12', color: '#00e5cc88', border: '1px solid #00e5cc20' }}>
                        D{dayNum}
                      </span>
                      {count > 0 && (
                        <span className="font-mono tabular-nums px-1.5 py-0.5 rounded"
                          style={{ fontSize: 9, background: '#ffd70012', color: '#ffd70088', border: '1px solid #ffd70020' }}>
                          {count} ✦
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ── All-day / unscheduled strip ──────────────────────── */}
          <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0f' }}>
            <div className="flex-shrink-0 sticky left-0 z-20 flex items-center justify-center"
              style={{ width: TIME_W, background: '#0a0a0f', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-[#333355]" style={{ fontSize: 8, letterSpacing: '0.1em', writingMode: 'vertical-rl' }}>
                ALL DAY
              </span>
            </div>
            {days.map(({ date, plan }) => (
              <div key={date} className="flex-shrink-0"
                style={{ width: DAY_W, minHeight: 28, borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                {plan && <Unscheduled activities={plan.activities} />}
              </div>
            ))}
          </div>

          {/* ── Time grid ────────────────────────────────────────── */}
          <div className="flex">

            {/* Time gutter — sticky left */}
            <div className="flex-shrink-0 sticky left-0 z-20"
              style={{ width: TIME_W, background: '#0a0a0f', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              {HOURS.map(h => (
                <div key={h} className="flex items-start justify-end pr-2 pt-0.5"
                  style={{ height: h < END_HOUR ? HOUR_H : 0 }}>
                  {h < END_HOUR && (
                    <span className="font-mono tabular-nums"
                      style={{ fontSize: 9, color: '#44445a', userSelect: 'none' }}>
                      {fmtHour(h)}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {days.map(({ date, dayNum, plan }) => (
              <div key={date} className="flex-shrink-0 relative"
                style={{ width: DAY_W, height: TOTAL_H, borderRight: '1px solid rgba(255,255,255,0.04)' }}>

                {HOURS.map(h => (
                  <div key={h} className="absolute left-0 right-0 pointer-events-none"
                    style={{
                      top: (h - START_HOUR) * HOUR_H,
                      borderTop: h === START_HOUR ? 'none'
                        : `1px solid rgba(255,255,255,${h % 3 === 0 ? '0.055' : '0.022'})`,
                    }} />
                ))}

                {Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i).map(h => (
                  <div key={h} className="absolute left-0 right-0 pointer-events-none"
                    style={{
                      top: (h - START_HOUR) * HOUR_H + HOUR_H / 2,
                      borderTop: '1px dashed rgba(255,255,255,0.012)',
                    }} />
                ))}

                {plan?.activities.map(a => (
                  <Block key={a.id} a={a} dayNum={dayNum} />
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────
export function ScheduleView({ itinerary }: { itinerary: Itinerary }) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  return isMobile
    ? <MobileScheduleView itinerary={itinerary} />
    : <DesktopScheduleView itinerary={itinerary} />;
}
