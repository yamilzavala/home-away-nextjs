import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookingWrapper from '../BookingWrapper';
import { useProperty } from '@/utils/store';

// Mock dependencies with absolute paths
vi.mock('@/utils/store', () => ({
  useProperty: Object.assign(vi.fn(), {
    setState: vi.fn(),
  }),
}));

vi.mock('../BookingCalendar', () => ({
  default: () => <div data-testid="mock-calendar">Calendar</div>,
}));

vi.mock('../BookingContainer', () => ({
  default: () => <div data-testid="mock-container">Container</div>,
}));

describe('BookingWrapper Component', () => {
  const mockProps = {
    propertyId: '123',
    price: 100,
    bookings: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates the property store on mount', () => {
    render(<BookingWrapper {...mockProps} />);
    
    expect(useProperty.setState).toHaveBeenCalledWith({
      propertyId: mockProps.propertyId,
      price: mockProps.price,
      bookings: mockProps.bookings,
    });
  });

  it('renders BookingCalendar and BookingContainer', () => {
    render(<BookingWrapper {...mockProps} />);
    
    expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-container')).toBeInTheDocument();
  });
});
