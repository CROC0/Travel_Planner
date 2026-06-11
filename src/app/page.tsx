import { HeroSection } from '@/components/home/HeroSection';
import { TripSummaryCard } from '@/components/home/TripSummaryCard';
import { QuickNavGrid } from '@/components/home/QuickNavGrid';
import { SectionHeading } from '@/components/shared/SectionHeading';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        <section>
          <SectionHeading
            title="Trip at a glance"
            subtitle="Everything you need to know"
            accent="teal"
          />
          <TripSummaryCard />
        </section>

        <section>
          <SectionHeading
            title="Quick navigation"
            subtitle="Jump to what you need"
            accent="gold"
          />
          <QuickNavGrid />
        </section>
      </div>
    </div>
  );
}
