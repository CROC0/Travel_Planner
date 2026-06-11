import { notFound } from 'next/navigation';
import { getHoliday } from '@/lib/holidays';
import { getUserFromRequest } from '@/lib/auth';
import { HolidayProvider } from '@/context/HolidayContext';

export default async function HolidayLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ holidayId: string }>;
}) {
  const { holidayId } = await params;
  const user = await getUserFromRequest();
  if (!user) notFound();

  const holiday = await getHoliday(holidayId);
  if (!holiday || holiday.userId !== user.userId) notFound();

  return <HolidayProvider holiday={holiday}>{children}</HolidayProvider>;
}
