import { DonationForm } from '@/components/DonationForm';

type DonationFormSectionProps = {
  selectedAmount?: number;
  selectionSignal?: number;
  initialPaymentMethod?: 'mpesa' | 'card';
};

// DonationFormSection removed: Only PayPal is supported now.
