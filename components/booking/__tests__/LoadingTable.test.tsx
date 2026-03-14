import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingTable from '../LoadingTable';

// Mock the Skeleton component using absolute path alias
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

describe('LoadingTable Component', () => {
  it('renders default number of rows (5)', () => {
    render(<LoadingTable />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(5);
  });

  it('renders custom number of rows', () => {
    render(<LoadingTable rows={10} />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(10);
  });

  it('applies correct classes to skeletons', () => {
    render(<LoadingTable rows={1} />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('h-8', 'w-full', 'rounded');
  });
});
