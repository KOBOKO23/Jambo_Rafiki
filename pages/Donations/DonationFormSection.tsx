// DonationFormSection.tsx
import { DonationForm } from '@/components/DonationForm';

export default function DonationFormSection() {
  return (
    <section id="donation-form" className="bg-white py-10 md:py-16">
      <div className="container mx-auto px-4">
        <DonationForm />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

// SponsorshipSectionWrapper.tsx
// (keep in its own file in practice; shown here for brevity)
import { SponsorshipSection } from '@/components/SponsorshipSection';

export function SponsorshipSectionWrapper() {
  return (
    <section id="sponsor-child" className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SponsorshipSection />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

