import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function BrokenComponent(): ReactElement {
  throw new Error('Render failure');
}

describe('ErrorBoundary', () => {
  it('renders fallback UI when a child throws', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();

    errorSpy.mockRestore();
  });

  it('reloads the page when fallback action is clicked', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const reloadMock = vi.fn();

    render(
      <ErrorBoundary onReload={reloadMock}>
        <BrokenComponent />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /reload page/i }));
    expect(reloadMock).toHaveBeenCalledTimes(1);

    errorSpy.mockRestore();
  });
});
