import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingCards, { SkeletonCard } from '../LoadingCards';

// Mock the Skeleton component to simplify testing
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

describe('LoadingCards Component', () => {
  it('renders four SkeletonCard components', () => {
    const { container } = render(<LoadingCards />);
    const sections = container.querySelectorAll('section');
    expect(sections).toHaveLength(1);
    expect(sections[0]).toHaveClass('grid', 'mt-4', 'gap-8');
    
    // Each SkeletonCard has 3 skeletons, so 4 * 3 = 12 skeletons
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(12);
  });
});

describe('SkeletonCard Component', () => {
  it('renders three skeletons with correct classes', () => {
    render(<SkeletonCard />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(3);
    
    expect(skeletons[0]).toHaveClass('h-[300px]', 'rounded-md');
    expect(skeletons[1]).toHaveClass('h-4', 'mt-2', 'w-3/4');
    expect(skeletons[2]).toHaveClass('h-4', 'mt-2', 'w-1/2');
  });
});
