import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { DonationForm } from '@/components/DonationForm';
import { api } from '@/services/api';

const mockStripe = {
  createPaymentMethod: vi.fn(),
  confirmCardPayment: vi.fn(),
};

const mockElements = {
  getElement: vi.fn(),
};

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
  useStripe: () => mockStripe,
  useElements: () => mockElements,
}));

describe('DonationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockElements.getElement.mockReturnValue({});
  });

  it('submits M-Pesa donations successfully', async () => {
    const user = userEvent.setup();
    const mpesaMock = vi.mocked(api.donations.mpesa);
    mpesaMock.mockResolvedValue({
      message: 'Donation accepted and queued for M-Pesa initiation.',
      donation_id: 1,
      job_id: 2,
      status: 'pending',
    });

    render(<DonationForm />);

    await user.click(screen.getByRole('button', { name: 'KES 1,000' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.type(screen.getByPlaceholderText('Jane Doe'), 'Jane Donor');
    await user.type(screen.getByPlaceholderText('jane@example.com'), 'jane@donor.com');
    await user.type(screen.getByPlaceholderText('7XXXXXXXX'), '700000000');
    await user.click(screen.getByRole('button', { name: /continue to payment/i }));

    await user.click(screen.getByRole('button', { name: /Donate KES 1,000/i }));

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

    expect(await screen.findByText('Thank you!')).toBeInTheDocument();
    expect(await screen.findByText('Donation accepted and queued for M-Pesa initiation.')).toBeInTheDocument();
  });

  it('submits card donations with a Stripe payment method id', async () => {
    const user = userEvent.setup();
    const stripeMock = vi.mocked(mockStripe.createPaymentMethod);
    const confirmMock = vi.mocked(mockStripe.confirmCardPayment);
    const stripeSubmitMock = vi.mocked(api.donations.stripe);

    mockElements.getElement.mockReturnValue({});
    stripeMock.mockResolvedValue({ paymentMethod: { id: 'pm_test_123' } });
    stripeSubmitMock.mockResolvedValue({
      message: 'Payment initiated. Complete the payment in the frontend and wait for webhook confirmation.',
      donation_id: 9,
      payment_intent_id: 'pi_test_123',
      client_secret: 'pi_test_123_secret',
      status: 'requires_payment_method',
    });
    confirmMock.mockResolvedValue({
      paymentIntent: { status: 'succeeded' },
    });

    render(<DonationForm />);

    await user.click(screen.getByRole('button', { name: /card/i }));
    await user.type(screen.getByPlaceholderText('Enter custom amount'), '50');
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.type(screen.getByPlaceholderText('Jane Doe'), 'Card Donor');
    await user.type(screen.getByPlaceholderText('jane@example.com'), 'card@donor.com');
    await user.click(screen.getByRole('button', { name: /continue to payment/i }));

    await user.click(screen.getByRole('button', { name: /Donate USD 50/i }));

    await waitFor(() => {
      expect(stripeSubmitMock).toHaveBeenCalledWith(
        expect.objectContaining({
          donor_name: 'Card Donor',
          donor_email: 'card@donor.com',
          amount: 50,
          payment_method_id: 'pm_test_123',
        })
      );
    });

    expect(stripeMock).toHaveBeenCalled();
    expect(confirmMock).toHaveBeenCalledWith(
      'pi_test_123_secret',
      expect.objectContaining({ payment_method: 'pm_test_123' })
    );
    expect(await screen.findByText('Your card payment was successful. Thank you for your support.')).toBeInTheDocument();
  });

  it('prefills amount when selected from impact cards', async () => {
    render(<DonationForm initialAmount={5000} selectionSignal={1} />);

    expect(screen.getByPlaceholderText('Enter custom amount')).toHaveValue(5000);
  });
});
