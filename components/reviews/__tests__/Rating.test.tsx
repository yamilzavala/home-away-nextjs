import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Rating from '../Rating';

// Mock react-icons to simplify testing and avoid SVG rendering complexity
vi.mock('react-icons/fa', () => ({
  FaStar: ({ className }: { className: string }) => <svg data-testid="star-filled" className={className} />,
  FaRegStar: ({ className }: { className: string }) => <svg data-testid="star-empty" className={className} />,
}));

describe('Rating Component', () => {
  it('renders 5 stars in total', () => {
    render(<Rating rating={3} />);
    const filledStars = screen.queryAllByTestId('star-filled');
    const emptyStars = screen.queryAllByTestId('star-empty');
    expect(filledStars.length + emptyStars.length).toBe(5);
  });

  it('renders correct number of filled stars for a given rating', () => {
    const { rerender } = render(<Rating rating={3} />);
    expect(screen.getAllByTestId('star-filled')).toHaveLength(3);
    expect(screen.getAllByTestId('star-empty')).toHaveLength(2);

    rerender(<Rating rating={5} />);
    expect(screen.getAllByTestId('star-filled')).toHaveLength(5);
    expect(screen.queryAllByTestId('star-empty')).toHaveLength(0);

    rerender(<Rating rating={0} />);
    expect(screen.queryAllByTestId('star-filled')).toHaveLength(0);
    expect(screen.getAllByTestId('star-empty')).toHaveLength(5);
  });

  it('applies correct colors to filled and empty stars', () => {
    render(<Rating rating={1} />);
    const filledStar = screen.getByTestId('star-filled');
    const emptyStar = screen.getAllByTestId('star-empty')[0];

    expect(filledStar).toHaveClass('text-primary');
    expect(emptyStar).toHaveClass('text-gray-400');
  });
});

import { screen } from '@testing-library/react';
