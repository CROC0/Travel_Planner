import Link from 'next/link';
import { Star, Utensils, Info } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { getHoliday } from '@/lib/holidays';
import { getUserFromRequest } from '@/lib/auth';
import { notFound } from 'next/navigation';

export default async function ExplorePage({ params }: { params: Promise<{ holidayId: string }> }) {
  const { holidayId } = await params;
  const user = await getUserFromRequest();
  if (!user) notFound();
  const holiday = await getHoliday(holidayId);
  if (!holiday || holiday.userId !== user.userId) notFound();

  const isSingapore = holiday.destination.toLowerCase() === 'singapore';
  const base = `/holidays/${holidayId}/explore`;

  const sections = [
    ...(isSingapore ? [
      { href: `${base}/attractions`, icon: Star, title: 'Attractions', description: '16 curated must-see places across Singapore', count: '16 places', color: '#ff6eb4', gradient: 'from-[#ff6eb4]/20 to-[#ff6eb4]/5' },
      { href: `${base}/food`, icon: Utensils, title: 'Food & Drink', description: 'Hawker classics, Michelin stars, and iconic cocktail bars', count: '15 spots', color: '#ffd700', gradient: 'from-[#ffd700]/20 to-[#ffd700]/5' },
    ] : []),
    { href: `${base}/practical`, icon: Info, title: 'Practical Info', description: 'Transport, currency, connectivity, safety & local tips', count: 'Guides', color: '#00e5cc', gradient: 'from-[#00e5cc]/20 to-[#00e5cc]/5' },
  ];

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
        <SectionHeading
          title={`Explore ${holiday.destination}`}
          subtitle="Curated guides for your trip"
          accent="pink"
          symbol="◆"
        />

        {!isSingapore && (
          <div className="glass rounded-2xl p-4 mb-6 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[#8888aa] text-sm">Destination-specific guides for {holiday.destination} coming soon. Check out practical info below.</p>
          </div>
        )}

        <div className="space-y-3 sm:space-y-4">
          {sections.map(({ href, icon: Icon, title, description, count, color, gradient }) => (
            <Link key={href} href={href} className="group block">
              <div
                className={`glass rounded-2xl p-4 sm:p-6 flex items-center gap-3 sm:gap-5 bg-gradient-to-r ${gradient} hover:scale-[1.01] transition-all duration-200`}
                style={{ border: `1px solid ${color}20` }}
              >
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                  <Icon className="w-5 h-5 sm:w-7 sm:h-7" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-base sm:text-lg group-hover:text-[#00e5cc] transition-colors truncate">{title}</h3>
                  <p className="text-[#8888aa] text-xs sm:text-sm mt-0.5 line-clamp-2">{description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[#8888aa] whitespace-nowrap">{count}</p>
                  <p className="text-[#00e5cc] text-lg sm:text-xl mt-1 group-hover:translate-x-1 transition-transform">→</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
