// pages/Donations/DonationPage.tsx
//
// ✅ Named export — matches the lazy() pattern in App.tsx:
//    lazy(() => import('./pages/Donations').then(m => ({ default: m.DonationPage })))
//
import { HeroSection } from './HeroSection';
import { ImpactStats } from './ImpactStats';
import { TrustIndicators } from './TrustIndicators';
import DonationFormSection from './DonationFormSection';
import { BankTransferSection } from './BankTransferSection';
import { SponsorshipSectionWrapper } from './SponsorshipSectionWrapper';
import { FinalCTA } from './FinalCTA';
import { SEO } from '@/components/SEO';

export function DonationPage() {
  return (
    <div className="w-full">
      <SEO
        title="Donate"
        description="Support Jambo Rafiki by making a donation. Your contribution helps provide food, education, healthcare, and hope to children in need."
        path="/donations"
      />
      <HeroSection />
      <ImpactStats />
      <TrustIndicators />
      <DonationFormSection />
      <BankTransferSection />
      <SponsorshipSectionWrapper />
      <FinalCTA />
    </div>
  );
}