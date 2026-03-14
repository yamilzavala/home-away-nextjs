import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsContainer from '../StatsContainer';
import * as actions from '@/utils/actions';

vi.mock('@/utils/actions', () => ({
  fetchStats: vi.fn(),
}));

describe('StatsContainer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all stats cards with correct data', async () => {
    const mockStats = {
      usersCount: 10,
      propertiesCount: 20,
      bookingsCount: 30,
    };
    vi.mocked(actions.fetchStats).mockResolvedValue(mockStats);

    render(await StatsContainer());

    expect(screen.getByText('users')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    
    expect(screen.getByText('properties')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    
    expect(screen.getByText('bookings')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('renders with zero values when data is missing', async () => {
    vi.mocked(actions.fetchStats).mockResolvedValue(null as any);

    render(await StatsContainer());

    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(3);
  });
});
