import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Chart from '../Chart';

// Mock ResizeObserver which is used by Recharts/ResponsiveContainer
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResponsiveContainer to render its children directly
// Recharts components often need a specific height/width or a mock in testing environments
vi.mock('recharts', async (importOriginal) => {
  const original = await importOriginal<any>();
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: '800px', height: '300px' }}>{children}</div>
    ),
  };
});

describe('Chart Component', () => {
  const mockData = [
    { date: 'Jan 2024', count: 5 },
    { date: 'Feb 2024', count: 10 },
  ];

  it('renders the chart title', () => {
    render(<Chart data={mockData} />);
    expect(screen.getByText(/Monthly Bookings/i)).toBeInTheDocument();
  });

  it('renders without crashing with empty data', () => {
    render(<Chart data={[]} />);
    expect(screen.getByText(/Monthly Bookings/i)).toBeInTheDocument();
  });

  it('has the correct section class', () => {
    const { container } = render(<Chart data={mockData} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-24');
  });
});
