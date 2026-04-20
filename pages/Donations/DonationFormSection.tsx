import { DonationForm } from '@/components/DonationForm';

export default function DonationFormSection() {
  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <DonationForm />
      </div>
    </section>
  );
}
