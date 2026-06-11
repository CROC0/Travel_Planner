'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface ActiveHoliday {
  name: string;
  emoji?: string;
  isOwner: boolean;
}

interface ActiveHolidayContextValue {
  active: ActiveHoliday | null;
  setActive: (h: ActiveHoliday | null) => void;
}

const ActiveHolidayContext = createContext<ActiveHolidayContextValue>({
  active: null,
  setActive: () => {},
});

export function ActiveHolidayProvider({ children }: { children: React.ReactNode }) {
  const [active, setActiveState] = useState<ActiveHoliday | null>(null);
  const setActive = useCallback((h: ActiveHoliday | null) => setActiveState(h), []);
  return (
    <ActiveHolidayContext.Provider value={{ active, setActive }}>
      {children}
    </ActiveHolidayContext.Provider>
  );
}

export function useActiveHoliday() {
  return useContext(ActiveHolidayContext);
}
