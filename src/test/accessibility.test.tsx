import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import GalleryGrid from '../../pages/Gallery/GalleryGrid';

describe('Accessibility interactions', () => {
  it('renders a keyboard-usable skip link in navigation', async () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    const skipLink = await screen.findByRole('link', { name: /skip to content/i });
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('opens and closes gallery lightbox with keyboard escape', async () => {
    render(
      <GalleryGrid
        urls={[
          'https://example-bucket.s3.amazonaws.com/gallery/one.jpg',
          'https://example-bucket.s3.amazonaws.com/gallery/two.jpg',
        ]}
        loading={false}
        loadingMore={false}
        hasMore={false}
        error={null}
        onRetry={() => undefined}
        onLoadMore={() => undefined}
      />
    );

    const firstTile = await screen.findByRole('button', { name: /^open gallery image 1$/i });
    fireEvent.click(firstTile);

    expect(await screen.findByRole('button', { name: /close gallery preview/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByRole('button', { name: /close gallery preview/i })).not.toBeInTheDocument();
  });
});
