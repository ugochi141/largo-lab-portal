/**
 * LoadingSpinner Component Tests
 */

import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('img', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    let spinner = screen.getByRole('img', { hidden: true });
    expect(spinner).toHaveClass('w-4', 'h-4');

    rerender(<LoadingSpinner size="lg" />);
    spinner = screen.getByRole('img', { hidden: true });
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  it('applies correct color classes', () => {
    const { rerender } = render(<LoadingSpinner variant="primary" />);
    let spinner = screen.getByRole('img', { hidden: true });
    expect(spinner).toHaveClass('text-primary-600');

    rerender(<LoadingSpinner variant="white" />);
    spinner = screen.getByRole('img', { hidden: true });
    expect(spinner).toHaveClass('text-white');
  });

  it('renders with message', () => {
    render(<LoadingSpinner message="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders in fullscreen mode', () => {
    render(<LoadingSpinner fullScreen />);
    const container = screen.getByRole('img', { hidden: true }).closest('div');
    expect(container).toHaveClass('fixed', 'inset-0');
  });

  it('does not render fullscreen overlay by default', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('img', { hidden: true });
    const container = spinner.closest('div');
    expect(container).not.toHaveClass('fixed');
  });
});
