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
  const [user, holiday] = await Promise.all([
    getUserFromRequest(),
    getHoliday(holidayId),
  ]);

  if (!holiday) notFound();

  const isOwner = !!user && holiday.userId === user.userId;
  // Private holidays are viewable only by their owner; public ones by anyone with the link.
  if (!isOwner && !holiday.isPublic) notFound();

  return (
    <HolidayProvider holiday={holiday} isOwner={isOwner}>
      {children}
    </HolidayProvider>
  );
}
