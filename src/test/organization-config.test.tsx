import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    organization: {
      get: vi.fn(),
    },
  },
}));

describe('Organization config rendering', () => {
  it('renders organization contact and call details from the backend config', async () => {
    vi.mocked(api.organization.get).mockResolvedValue({
      website: {
        domain: 'www.jamborafiki.org',
        url: 'https://www.jamborafiki.org',
      },
      contact: {
        email: 'infodirector@jamborafiki.org',
        call_redirect_number: '+254799616542',
        call_redirect_url: 'tel:+254799616542',
      },
      bank_account: {
        bank_code: '07',
        branch_code: '123',
        swift_code: 'CBAFKENX',
        account_name: 'Benjamin Oyoo Ondoro',
        account_number: '1002622088',
      },
      timestamp: '2026-04-16T00:00:00Z',
    });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('infodirector@jamborafiki.org')).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: '+254799616542' })).toHaveAttribute('href', 'tel:+254799616542');
    await waitFor(() => {
      expect(document.body.textContent).toContain('Benjamin Oyoo Ondoro');
    });

    expect(document.body.textContent).toContain('A/C 1002622088');
  });
});
