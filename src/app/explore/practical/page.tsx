import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { PracticalInfoCard } from '@/components/explore/PracticalInfoCard';
import { practicalInfo } from '@/data/practical-info';

export default function PracticalPage() {
  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
        <Link href="/explore" className="inline-flex items-center gap-1.5 text-[#8888aa] hover:text-[#00e5cc] text-sm transition-colors mb-5 sm:mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>
        <SectionHeading
          title="Practical Info"
          subtitle="Everything you need for a smooth trip"
          accent="teal"
          symbol="◎"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {practicalInfo.map((info) => (
            <PracticalInfoCard key={info.id} info={info} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
