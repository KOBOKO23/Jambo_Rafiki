import { render, screen } from '@testing-library/react';
import App from '../../App';

vi.mock('@/services/api', () => ({
  ApiError: class ApiError extends Error {
    status: number;

    constructor(message: string, status = 0) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
    }
  },
  api: {
    auth: {
      csrf: vi.fn().mockResolvedValue({ csrf_token: 'test-csrf' }),
      currentUser: vi.fn().mockRejectedValue(new Error('Unauthorized')),
      login: vi.fn(),
      logout: vi.fn(),
    },
    organization: {
      get: vi.fn().mockResolvedValue({
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
      }),
    },
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
      getChildren: vi.fn().mockResolvedValue([]),
    },
    gallery: {
      listPhotos: vi.fn().mockResolvedValue({ count: 0, next: null, previous: null, results: [] }),
      listCategories: vi.fn().mockResolvedValue([]),
      listFeaturedPhotos: vi.fn().mockResolvedValue([]),
      listRandomPhotos: vi.fn().mockResolvedValue([]),
    },
    volunteers: {
      submit: vi.fn(),
    },
    newsletter: {
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
    },
  },
}));

describe('App routing', () => {
  it('renders the contact page on /contact', async () => {
    window.history.pushState({}, '', '/contact');

    render(<App />);

    expect(await screen.findByText('Send Us a Message')).toBeInTheDocument();
  });

  it('renders the about page on /about', async () => {
    window.history.pushState({}, '', '/about');

    render(<App />);

    expect(await screen.findByText('Executive Director & Founder')).toBeInTheDocument();
  });

  it('renders the donation page on /donations', async () => {
    window.history.pushState({}, '', '/donations');

    render(<App />);

    expect(await screen.findByText('Support Our Mission')).toBeInTheDocument();
  });

  it('renders the get involved page on /get-involved', async () => {
    window.history.pushState({}, '', '/get-involved');

    render(<App />);

    expect(await screen.findByText('Global Community Support')).toBeInTheDocument();
  });
});
