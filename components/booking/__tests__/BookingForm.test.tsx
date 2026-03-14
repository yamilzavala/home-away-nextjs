import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookingForm from '../BookingForm';
import { useProperty } from '@/utils/store';
import { calculateTotals } from '@/utils/calculateTotals';

// Mock dependencies
vi.mock('@/utils/store', () => ({
  useProperty: vi.fn(),
}));

vi.mock('@/utils/calculateTotals', () => ({
  calculateTotals: vi.fn(),
}));

vi.mock('@/utils/format', () => ({
  formatCurrency: (amount: number) => `$${amount}`,
}));

describe('BookingForm Component', () => {
  const mockRange = {
    from: new Date(2024, 0, 1),
    to: new Date(2024, 0, 5),
  };

  const mockTotals = {
    totalNights: 4,
    subTotal: 400,
    cleaning: 50,
    service: 30,
    tax: 45,
    orderTotal: 525,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useProperty).mockReturnValue({ price: 100, range: mockRange } as any);
    vi.mocked(calculateTotals).mockReturnValue(mockTotals as any);
  });

  it('renders the summary correctly with calculated totals', () => {
    render(<BookingForm />);

    expect(screen.getByText(/Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/\$100 x 4 nights/i)).toBeInTheDocument();
    expect(screen.getByText(/\$400/i)).toBeInTheDocument();
    expect(screen.getByText(/Cleaning Fee/i)).toBeInTheDocument();
    expect(screen.getByText(/\$50/i)).toBeInTheDocument();
    expect(screen.getByText(/Service Fee/i)).toBeInTheDocument();
    expect(screen.getByText(/\$30/i)).toBeInTheDocument();
    expect(screen.getByText(/Tax/i)).toBeInTheDocument();
    expect(screen.getByText(/\$45/i)).toBeInTheDocument();
    expect(screen.getByText(/Booking Total/i)).toBeInTheDocument();
    expect(screen.getByText(/\$525/i)).toBeInTheDocument();
  });

  it('calls calculateTotals with correct parameters from store', () => {
    render(<BookingForm />);
    expect(calculateTotals).toHaveBeenCalledWith({
      checkIn: mockRange.from,
      checkOut: mockRange.to,
      price: 100,
    });
  });
});
