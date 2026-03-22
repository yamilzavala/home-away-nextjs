import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingCalendar from '../BookingCalendar';
import { useProperty } from '@/utils/store';
import { useToast } from '@/components/ui/use-toast';

// Mock the dependencies
vi.mock('@/components/ui/calendar', () => ({
  Calendar: ({ onSelect, selected }: any) => (
    <div data-testid="mock-calendar">
      <button onClick={() => onSelect({ from: new Date(2024, 0, 1), to: new Date(2024, 0, 5) })}>
        Select Range
      </button>
      <div data-testid="selected-range">
        {selected?.from?.toDateString()} - {selected?.to?.toDateString()}
      </div>
    </div>
  ),
}));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: vi.fn(),
}));

vi.mock('@/utils/store', () => ({
  useProperty: vi.fn(),
}));

vi.mock('@/utils/calendar', () => ({
  generateDisabledDates: vi.fn(() => ({})),
  generateDateRange: vi.fn(() => []),
  defaultSelected: undefined,
  generateBlockedPeriods: vi.fn(() => []),
}));

describe('BookingCalendar Component', () => {
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useToast).mockReturnValue({ toast: mockToast } as any);
    vi.mocked(useProperty).mockReturnValue({ bookings: [] } as any);
    // Add setState to the mock as well
    (useProperty as any).setState = vi.fn();
  });

  it('renders the calendar', () => {
    render(<BookingCalendar />);
    expect(screen.getByTestId('mock-calendar-break-test')).toBeInTheDocument();
  });

  it('updates the store when a range is selected', async () => {
    const user = userEvent.setup();
    render(<BookingCalendar />);
    
    const selectButton = screen.getByText(/Select Range/i);
    await user.click(selectButton);

    expect(useProperty.setState).toHaveBeenCalled();
  });
});
