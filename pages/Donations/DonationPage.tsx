import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HeroSection } from './HeroSection';
import { ImpactStats } from './ImpactStats';
import { TrustIndicators } from './TrustIndicators';
import { DonationFormSection } from './DonationFormSection';
import { BankTransferSection } from './BankTransferSection';
import { SponsorshipSectionWrapper } from './SponsorshipSectionWrapper';
import { FinalCTA } from './FinalCTA';
import { SEO } from '@/components/SEO';

export function DonationPage() {
  const [searchParams] = useSearchParams();
  const initialMethodParam = searchParams.get('method');
  const initialAmountParam = searchParams.get('amount');

  const initialMethod = initialMethodParam === 'card' ? 'card' : 'mpesa';
  const parsedInitialAmount = initialAmountParam ? Number(initialAmountParam) : undefined;
  const initialAmount = parsedInitialAmount && Number.isFinite(parsedInitialAmount) && parsedInitialAmount > 0
    ? parsedInitialAmount
    : undefined;

  const [selectedAmount, setSelectedAmount] = useState<number | undefined>(initialAmount);
  const [selectionSignal, setSelectionSignal] = useState(0);

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setSelectionSignal((prev) => prev + 1);
    const form = document.getElementById('donation-form');
    form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full">
      <SEO
        title="Donate"
        description="Support Jambo Rafiki through M-Pesa and secure card payments. Your donation helps provide food, education, healthcare, and shelter."
        path="/donations"
      />
      <HeroSection />
      <ImpactStats onSelectAmount={handleSelectAmount} />
      <TrustIndicators />
      <DonationFormSection
        selectedAmount={selectedAmount}
        selectionSignal={selectionSignal}
        initialPaymentMethod={initialMethod}
      />
      <BankTransferSection />
      <SponsorshipSectionWrapper />
      <FinalCTA />
    </div>
  );
}
