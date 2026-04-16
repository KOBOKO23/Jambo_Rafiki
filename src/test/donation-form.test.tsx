import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { DonationForm } from '@/components/DonationForm';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    contacts: { submit: vi.fn() },
    testimonials: { submit: vi.fn() },
    donations: {
      mpesa: vi.fn(),
      stripe: vi.fn(),
    },
    sponsorships: { submitInterest: vi.fn() },
  },
}));

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue(null),
}));

vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: ReactNode }) => <>{children}</>,
  CardNumberElement: () => <div data-testid="card-number-element" />,
  CardExpiryElement: () => <div data-testid="card-expiry-element" />,
  CardCvcElement: () => <div data-testid="card-cvc-element" />,
  useStripe: () => null,
  useElements: () => null,
}));

describe('DonationForm', () => {
  it('submits M-Pesa donations successfully', async () => {
    const user = userEvent.setup();
    const mpesaMock = vi.mocked(api.donations.mpesa);
    mpesaMock.mockResolvedValue({ message: 'ok', donation_id: 1 });

    render(<DonationForm />);

    await user.click(screen.getByRole('button', { name: '1,000' }));
    await user.type(screen.getByPlaceholderText('Full Name'), 'Jane Donor');
    await user.type(screen.getByPlaceholderText('Email Address'), 'jane@donor.com');
    await user.type(screen.getByPlaceholderText('M-Pesa Phone Number (254XXXXXXXXX)'), '254700000000');

    await user.click(screen.getByRole('button', { name: /donate now/i }));

    await waitFor(() => {
      expect(mpesaMock).toHaveBeenCalledWith(
        expect.objectContaining({
          donor_name: 'Jane Donor',
          donor_email: 'jane@donor.com',
          donor_phone: '254700000000',
          amount: 1000,
        })
      );
    });

    expect(await screen.findByText('Thank You!')).toBeInTheDocument();
  });

  it('shows an error when card method is selected and Stripe is unavailable', async () => {
    const user = userEvent.setup();

    render(<DonationForm />);

    await user.click(screen.getByRole('button', { name: /card/i }));
    await user.type(screen.getByPlaceholderText('Or enter custom amount'), '50');
    await user.type(screen.getByPlaceholderText('Full Name'), 'Card Donor');
    await user.type(screen.getByPlaceholderText('Email Address'), 'card@donor.com');

    await user.click(screen.getByRole('button', { name: /donate now/i }));

    expect(await screen.findByText('Stripe is not ready yet')).toBeInTheDocument();
  });

  it('prefills amount when selected from impact cards', async () => {
    render(<DonationForm initialAmount={5000} selectionSignal={1} />);

    expect(screen.getByPlaceholderText('Or enter custom amount')).toHaveValue(5000);
  });
});
