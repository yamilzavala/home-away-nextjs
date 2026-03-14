import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ConfirmBooking from '../ConfirmBooking';
import { useAuth } from '@clerk/nextjs';
import { useProperty } from '@/utils/store';

// Mock Clerk
vi.mock('@clerk/nextjs', () => ({
  useAuth: vi.fn(),
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="signin-button">{children}</div>
  ),
}));

// Mock useProperty store
vi.mock('@/utils/store', () => ({
  useProperty: vi.fn(),
}));

// Mock child components
vi.mock('@/components/form/FormContainer', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-container">{children}</div>
  ),
}));

vi.mock('@/components/form/Buttons', () => ({
  SubmitButton: ({ text }: { text: string }) => <button>{text}</button>,
}));

// Mock utils/actions to avoid Prisma dependency
vi.mock('@/utils/actions', () => ({
  createBookingAction: () => Promise.resolve({ message: 'Booking created' }),
}));

describe('ConfirmBooking Component', () => {
  const mockRange = {
    from: new Date(2024, 0, 1),
    to: new Date(2024, 0, 5),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Sign In button when user is not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ userId: null } as any);
    vi.mocked(useProperty).mockReturnValue({ range: mockRange, propertyId: '123' } as any);

    render(<ConfirmBooking />);

    expect(screen.getByText(/Sign In to Complete Booking/i)).toBeInTheDocument();
    expect(screen.getByTestId('signin-button')).toBeInTheDocument();
  });

  it('renders Reserve button when user is authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ userId: 'user_123' } as any);
    vi.mocked(useProperty).mockReturnValue({ range: mockRange, propertyId: '123' } as any);

    render(<ConfirmBooking />);

    expect(screen.getByText(/Reserve/i)).toBeInTheDocument();
    expect(screen.getByTestId('form-container')).toBeInTheDocument();
  });
});
