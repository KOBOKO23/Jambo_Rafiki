import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TestimonialsSection from '../../pages/Home/TestimonialsSection';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    contacts: {
      submit: vi.fn(),
    },
    testimonials: {
      submit: vi.fn(),
      listApproved: vi.fn().mockResolvedValue({
        count: 0,
        next: null,
        previous: null,
        results: [],
      }),
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

describe('TestimonialsSection', () => {
  it('submits a testimonial and shows success feedback', async () => {
    const user = userEvent.setup();
    const submitMock = vi.mocked(api.testimonials.submit);
    submitMock.mockResolvedValue({
      message: 'ok',
    });

    render(<TestimonialsSection />);

    await user.click(screen.getByRole('button', { name: /share your story/i }));

    await user.type(screen.getByPlaceholderText('Your name'), 'Alex');
    await user.type(screen.getByPlaceholderText('Your email'), 'alex@example.com');
    await user.type(screen.getByPlaceholderText('Your role'), 'Volunteer');
    await user.type(
      screen.getByPlaceholderText('Share your experience with Jambo Rafiki…'),
      'It has been a deeply meaningful experience.'
    );

    await user.click(screen.getByRole('button', { name: /submit testimonial/i }));

    await waitFor(() => {
      expect(submitMock).toHaveBeenCalledWith({
        name: 'Alex',
        email: 'alex@example.com',
        role: 'other',
        role_custom: 'Volunteer',
        text: 'It has been a deeply meaningful experience.',
      });
    });

    expect(await screen.findByText('Thank you!')).toBeInTheDocument();
  });

  it('shows an error state when testimonial submission fails', async () => {
    const user = userEvent.setup();
    const submitMock = vi.mocked(api.testimonials.submit);
    submitMock.mockRejectedValue(new Error('Submission service unavailable'));

    render(<TestimonialsSection />);

    await user.click(screen.getByRole('button', { name: /share your story/i }));

    await user.type(screen.getByPlaceholderText('Your name'), 'Alex');
    await user.type(screen.getByPlaceholderText('Your email'), 'alex@example.com');
    await user.type(screen.getByPlaceholderText('Your role'), 'Volunteer');
    await user.type(
      screen.getByPlaceholderText('Share your experience with Jambo Rafiki…'),
      'It has been a deeply meaningful experience.'
    );

    await user.click(screen.getByRole('button', { name: /submit testimonial/i }));

    expect(await screen.findByText('Submission failed')).toBeInTheDocument();
    expect(await screen.findByText('Submission service unavailable')).toBeInTheDocument();
  });
});
