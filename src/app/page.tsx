import { HeroSection } from '@/components/home/HeroSection';
import { TripSummaryCard } from '@/components/home/TripSummaryCard';
import { QuickNavGrid } from '@/components/home/QuickNavGrid';
import { FamilyCrew } from '@/components/home/FamilyCrew';
import { SectionHeading } from '@/components/shared/SectionHeading';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10 sm:space-y-16">
        <section>
          <SectionHeading
            title="The Crew"
            subtitle="Four Taylors. One city. Zero chill."
            accent="gold"
            symbol="◈"
          />
          <FamilyCrew />
        </section>

        <section>
          <SectionHeading
            title="Trip at a glance"
            subtitle="Everything you need to know"
            accent="teal"
            symbol="◉"
          />
          <TripSummaryCard />
        </section>

        <section>
          <SectionHeading
            title="Quick navigation"
            subtitle="Jump to what you need"
            accent="gold"
            symbol="⊕"
          />
          <QuickNavGrid />
        </section>
      </div>
    </div>
  );
}
