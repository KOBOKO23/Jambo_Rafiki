import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../../pages/Contact/ContactForm';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    contacts: {
      submit: vi.fn(),
    },
    testimonials: {
      submit: vi.fn(),
    },
    donations: {
      mpesa: vi.fn(),
      stripe: vi.fn(),
    },
    sponsorships: {
      submitInterest: vi.fn(),
    },
  },
}));

describe('ContactForm', () => {
  it('submits data to the contact API and shows success state', async () => {
    const user = userEvent.setup();
    const submitMock = vi.mocked(api.contacts.submit);
    submitMock.mockResolvedValue({ message: 'ok', data: {} });

    render(<ContactForm />);

    await user.type(screen.getByLabelText('Your Name *'), 'Jane Doe');
    await user.type(screen.getByLabelText('Your Email *'), 'jane@example.com');
    await user.selectOptions(screen.getByLabelText('Subject *'), 'general');
    await user.type(screen.getByLabelText('Your Message *'), 'I would like to learn more.');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(submitMock).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
        subject: 'general',
        message: 'I would like to learn more.',
      });
    });

    expect(await screen.findByText('Message Sent!')).toBeInTheDocument();
  });

  it('shows error state when contact API submission fails', async () => {
    const user = userEvent.setup();
    const submitMock = vi.mocked(api.contacts.submit);
    submitMock.mockRejectedValue(new Error('Network unavailable'));

    render(<ContactForm />);

    await user.type(screen.getByLabelText('Your Name *'), 'Jane Doe');
    await user.type(screen.getByLabelText('Your Email *'), 'jane@example.com');
    await user.selectOptions(screen.getByLabelText('Subject *'), 'general');
    await user.type(screen.getByLabelText('Your Message *'), 'I would like to learn more.');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText('Message Not Sent')).toBeInTheDocument();
    expect(await screen.findByText('Network unavailable')).toBeInTheDocument();
  });
});
