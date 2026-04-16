import { render, screen } from '@testing-library/react';
import App from '../../App';

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
