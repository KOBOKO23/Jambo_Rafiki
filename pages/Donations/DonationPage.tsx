import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HeroSection } from './HeroSection';
import { ImpactStats } from './ImpactStats';
import { TrustIndicators } from './TrustIndicators';
// import { DonationFormSection } from './DonationFormSection';
function PayPalSection() {
  return (
    <section id="donation-form" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Donate via PayPal</h2>
        <p className="mb-8 text-lg text-gray-700">Support Jambo Rafiki securely using PayPal. Your donation provides food, education, healthcare, and hope to children who need it most.</p>
        <a
          href="https://www.paypal.me//JJRafiki7"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold px-10 py-5 rounded-full text-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        >
          Donate with PayPal
        </a>
      </div>
    </section>
  );
}
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
      <PayPalSection />
      <BankTransferSection />
      <SponsorshipSectionWrapper />
      <FinalCTA />
    </div>
  );
}
