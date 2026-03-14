import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsLoadingContainer, ChartsLoadingContainer } from '../Loading';

// Mock the Skeleton component using absolute path alias
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

// Mock the Card components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="card-header">{children}</div>,
}));

describe('Admin Loading Components', () => {
  describe('StatsLoadingContainer', () => {
    it('renders three LoadingCard components', () => {
      render(<StatsLoadingContainer />);
      
      const cards = screen.getAllByTestId('card');
      expect(cards).toHaveLength(3);
      
      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons).toHaveLength(3);
      
      skeletons.forEach(skeleton => {
        expect(skeleton).toHaveClass('w-full', 'h-20', 'rounded');
      });
    });

    it('has the correct grid layout classes', () => {
      const { container } = render(<StatsLoadingContainer />);
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveClass('mt-8', 'grid', 'md:grid-cols-2', 'gap-4', 'lg:grid-cols-3');
    });
  });

  describe('ChartsLoadingContainer', () => {
    it('renders a large skeleton', () => {
      render(<ChartsLoadingContainer />);
      
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('mt-16', 'w-full', 'h-[300px]', 'rounded');
    });
  });
});
