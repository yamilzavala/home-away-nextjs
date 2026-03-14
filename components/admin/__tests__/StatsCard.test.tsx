import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsCard from '../StatsCard';

describe('StatsCard Component', () => {
  it('renders the title and value correctly', () => {
    render(<StatsCard title="total users" value={100} />);
    
    expect(screen.getByText(/total users/i)).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders string values correctly', () => {
    render(<StatsCard title="revenue" value="$1,000" />);
    
    expect(screen.getByText(/revenue/i)).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
  });

  it('applies the correct CSS classes', () => {
    const { container } = render(<StatsCard title="test" value={0} />);
    const card = container.firstChild as HTMLElement;
    
    expect(card).toHaveClass('bg-muted');
    const title = screen.getByText(/test/i);
    expect(title).toHaveClass('capitalize', 'text-2xl', 'font-bold');
  });
});
