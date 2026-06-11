'use client';

import { createContext, useContext, useEffect } from 'react';
import type { Holiday } from '@/types';
import { useActiveHoliday } from './ActiveHolidayContext';

const HolidayContext = createContext<Holiday | null>(null);
const OwnerContext = createContext<boolean>(false);

export function HolidayProvider({
  holiday,
  isOwner,
  children,
}: {
  holiday: Holiday;
  isOwner: boolean;
  children: React.ReactNode;
}) {
  const { setActive } = useActiveHoliday();

  useEffect(() => {
    setActive({ name: holiday.name, emoji: holiday.coverEmoji, isOwner });
    return () => setActive(null);
  }, [holiday.name, holiday.coverEmoji, isOwner, setActive]);

  return (
    <HolidayContext.Provider value={holiday}>
      <OwnerContext.Provider value={isOwner}>
        {children}
      </OwnerContext.Provider>
    </HolidayContext.Provider>
  );
}

export function useHoliday(): Holiday {
  const ctx = useContext(HolidayContext);
  if (!ctx) throw new Error('useHoliday must be used inside HolidayProvider');
  return ctx;
}

export function useIsOwner(): boolean {
  return useContext(OwnerContext);
}
