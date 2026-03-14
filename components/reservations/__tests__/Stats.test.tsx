import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Stats from '../Stats';
import * as actions from '@/utils/actions';

vi.mock('@/utils/actions', () => ({
  fetchReservationStats: vi.fn(),
}));

vi.mock('@/components/admin/StatsCard', () => ({
  default: ({ title, value }: { title: string; value: number | string }) => (
    <div data-testid="stats-card">
      <span data-testid="card-title">{title}</span>
      <span data-testid="card-value">{value}</span>
    </div>
  ),
}));

vi.mock('@/utils/format', () => ({
  formatCurrency: (amount: number) => `$${amount}`,
}));

describe('Stats Component (Reservations)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders reservation stats correctly', async () => {
    const mockStats = {
      properties: 5,
      nights: 15,
      amount: 1200,
    };
    vi.mocked(actions.fetchReservationStats).mockResolvedValue(mockStats);

    const Result = await Stats();
    render(Result);

    expect(screen.getByText('properties')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    expect(screen.getByText('nights')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    
    expect(screen.getByText('total')).toBeInTheDocument();
    expect(screen.getByText('$1200')).toBeInTheDocument();
  });
});
