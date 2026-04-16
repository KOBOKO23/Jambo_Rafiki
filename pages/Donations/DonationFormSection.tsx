import { DonationForm } from '@/components/DonationForm';

type DonationFormSectionProps = {
  selectedAmount?: number;
  selectionSignal?: number;
  initialPaymentMethod?: 'mpesa' | 'card';
};

export function DonationFormSection({ selectedAmount, selectionSignal, initialPaymentMethod }: DonationFormSectionProps) {
  return (
    <section id="donation-form" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <DonationForm
          initialAmount={selectedAmount}
          selectionSignal={selectionSignal}
          initialPaymentMethod={initialPaymentMethod}
        />
      </div>
    </section>
  );
}
