import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChartsContainer from '../ChartsContainer';
import * as actions from '@/utils/actions';

// Mock ResizeObserver which is used by Recharts/ResponsiveContainer
global.ResizeObserver = class {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
};

vi.mock('@/utils/actions', () => ({
  fetchChartsData: vi.fn(),
}));

describe('ChartsContainer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Chart when data is present', async () => {
    const mockData = [
      { date: 'Jan 2024', count: 5 },
      { date: 'Feb 2024', count: 10 },
    ];
    vi.mocked(actions.fetchChartsData).mockResolvedValue(mockData);

    render(await ChartsContainer());

    expect(screen.getByText(/Monthly Bookings/i)).toBeInTheDocument();
  });

  it('returns null when no data is present', async () => {
    vi.mocked(actions.fetchChartsData).mockResolvedValue([]);

    const { container } = render(await ChartsContainer());

    expect(container.firstChild).toBeNull();
  });
});
