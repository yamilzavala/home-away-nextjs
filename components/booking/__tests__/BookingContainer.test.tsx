import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookingContainer from '../BookingContainer';
import { useProperty } from '@/utils/store';

// Mock dependencies with correct relative paths
vi.mock('../BookingForm', () => ({
  default: () => <div data-testid="mock-booking-form">Booking Form</div>,
}));

vi.mock('../ConfirmBooking', () => ({
  default: () => <div data-testid="mock-confirm-booking">Confirm Booking</div>,
}));

vi.mock('@/utils/store', () => ({
  useProperty: vi.fn(),
}));

// Mock @clerk/nextjs to prevent ClerkProvider errors during tests
vi.mock('@clerk/nextjs', () => ({
  useAuth: vi.fn(() => ({ userId: null })),
  SignInButton: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('BookingContainer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null if range is missing', () => {
    vi.mocked(useProperty).mockReturnValue({ range: undefined } as any);
    const { container } = render(<BookingContainer />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null if range.from or range.to is missing', () => {
    vi.mocked(useProperty).mockReturnValue({ range: { from: new Date() } } as any);
    const { container: container1 } = render(<BookingContainer />);
    expect(container1.firstChild).toBeNull();

    vi.mocked(useProperty).mockReturnValue({ range: { to: new Date() } } as any);
    const { container: container2 } = render(<BookingContainer />);
    expect(container2.firstChild).toBeNull();
  });

  it('returns null if range.from and range.to are the same date', () => {
    const date = new Date(2024, 0, 1);
    vi.mocked(useProperty).mockReturnValue({ range: { from: date, to: date } } as any);
    const { container } = render(<BookingContainer />);
    expect(container.firstChild).toBeNull();
  });

  it('renders BookingForm and ConfirmBooking when a valid range is selected', () => {
    const from = new Date(2024, 0, 1);
    const to = new Date(2024, 0, 5);
    vi.mocked(useProperty).mockReturnValue({ range: { from, to } } as any);
    
    render(<BookingContainer />);
    
    expect(screen.getByTestId('mock-booking-form')).toBeInTheDocument();
    expect(screen.getByTestId('mock-confirm-booking')).toBeInTheDocument();
  });
});
