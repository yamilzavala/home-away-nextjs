import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RatingInput from '../RatingInput';

// Mock Radix UI / Shadcn Select components
vi.mock('@/components/ui/select', () => ({
  Select: ({ children, defaultValue, name }: any) => (
    <div data-testid="mock-select" data-name={name} data-value={defaultValue}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => (
    <button data-testid="select-trigger">
      {children}
    </button>
  ),
  SelectValue: () => <div data-testid="select-value" />,
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>
      {children}
    </div>
  ),
}));

describe('RatingInput Component', () => {
  it('renders correctly with name and default label', () => {
    render(<RatingInput name="rating" />);
    
    expect(screen.getByText(/rating/i)).toBeInTheDocument();
    const select = screen.getByTestId('mock-select');
    expect(select).toHaveAttribute('data-name', 'rating');
    expect(select).toHaveAttribute('data-value', '5'); // Initial state is reversed [5, 4, 3, 2, 1]
  });

  it('renders with custom labelText when provided', () => {
    render(<RatingInput name="rating" labelText="Score" />);
    expect(screen.getByText(/Score/i)).toBeInTheDocument();
  });

  it('renders all 5 rating options in reverse order', () => {
    render(<RatingInput name="rating" />);
    const items = screen.getAllByTestId('select-item');
    expect(items).toHaveLength(5);
    
    expect(items[0]).toHaveAttribute('data-value', '5');
    expect(items[1]).toHaveAttribute('data-value', '4');
    expect(items[2]).toHaveAttribute('data-value', '3');
    expect(items[3]).toHaveAttribute('data-value', '2');
    expect(items[4]).toHaveAttribute('data-value', '1');
  });
});
