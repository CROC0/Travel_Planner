'use client';

import { createContext, useContext } from 'react';
import type { Holiday } from '@/types';

const HolidayContext = createContext<Holiday | null>(null);

export function HolidayProvider({ holiday, children }: { holiday: Holiday; children: React.ReactNode }) {
  return <HolidayContext.Provider value={holiday}>{children}</HolidayContext.Provider>;
}

export function useHoliday(): Holiday {
  const ctx = useContext(HolidayContext);
  if (!ctx) throw new Error('useHoliday must be used inside HolidayProvider');
  return ctx;
}
