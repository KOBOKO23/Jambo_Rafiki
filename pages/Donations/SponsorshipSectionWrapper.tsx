import { SponsorshipSection } from '@/components/SponsorshipSection';

export function SponsorshipSectionWrapper() {
  return (
    <section id="sponsor-child" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SponsorshipSection />
      </div>
    </section>
  );
}
