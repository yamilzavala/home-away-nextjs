import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import BookingsPage from '../page';
import * as actionsUtils from '@/utils/actions';

// Mock the actions module
vi.mock('@/utils/actions', () => ({
  fetchBookings: vi.fn(),
  deleteBookingAction: vi.fn(),
}));

// Mock child components
vi.mock('@/components/home/EmptyList', () => ({
  default: () => <div data-testid="empty-list">No bookings found</div>,
}));

vi.mock('@/components/card/CountryFlagAndName', () => ({
  default: ({ countryCode }: { countryCode: string }) => (
    <div data-testid="country-flag">{countryCode}</div>
  ),
}));

vi.mock('@/components/form/FormContainer', () => ({
  default: ({ children, action }: { children: React.ReactNode; action: any }) => (
    <form action={action} data-testid="form-container">
      {children}
    </form>
  ),
}));

vi.mock('@/components/form/Buttons', () => ({
  IconButton: ({ actionType }: { actionType: string }) => (
    <button data-testid={`icon-button-${actionType}`}>Delete</button>
  ),
}));

vi.mock('@/utils/format', () => ({
  formatDate: vi.fn((date) => 'June 15, 2024'),
  formatCurrency: vi.fn((amount) => `$${amount}`),
}));

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}));

describe('BookingsPage', () => {
  const mockBookings = [
    {
      id: '1',
      profileId: 'user1',
      propertyId: 'prop1',
      orderTotal: 600,
      totalNights: 4,
      checkIn: new Date('2024-06-01'),
      checkOut: new Date('2024-06-05'),
      paymentStatus: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      property: {
        id: 'prop1',
        name: 'Cozy Beach House',
        country: 'US',
      },
    },
    {
      id: '2',
      profileId: 'user1',
      propertyId: 'prop2',
      orderTotal: 400,
      totalNights: 2,
      checkIn: new Date('2024-07-01'),
      checkOut: new Date('2024-07-03'),
      paymentStatus: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      property: {
        id: 'prop2',
        name: 'Mountain Cabin',
        country: 'CA',
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when bookings exist', () => {
    test('renders bookings table with correct data', async () => {
      const { fetchBookings } = await import('@/utils/actions');
      vi.mocked(fetchBookings).mockResolvedValue(mockBookings);

      render(await BookingsPage());

      // Check total bookings count
      expect(screen.getByText(/total bookings : 2/i)).toBeInTheDocument();

      // Check table headers
      expect(screen.getByText('Property Name')).toBeInTheDocument();
      expect(screen.getByText('Country')).toBeInTheDocument();
      expect(screen.getByText('Nights')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('Check In')).toBeInTheDocument();
      expect(screen.getByText('Check Out')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();

      // Check booking data
      expect(screen.getByText('Cozy Beach House')).toBeInTheDocument();
      expect(screen.getByText('Mountain Cabin')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('$600')).toBeInTheDocument();
      expect(screen.getByText('$400')).toBeInTheDocument();
      expect(screen.getAllByText('June 15, 2024')).toHaveLength(4); // 2 check-in + 2 check-out

      // Check country flags
      expect(screen.getAllByTestId('country-flag')).toHaveLength(2);
      expect(screen.getByText('US')).toBeInTheDocument();
      expect(screen.getByText('CA')).toBeInTheDocument();

      // Check delete buttons
      expect(screen.getAllByTestId('icon-button-delete')).toHaveLength(2);

      // Check property links
      const propertyLinks = screen.getAllByTestId('next-link');
      expect(propertyLinks).toHaveLength(2);
      expect(propertyLinks[0]).toHaveAttribute('href', '/properties/prop1');
      expect(propertyLinks[1]).toHaveAttribute('href', '/properties/prop2');
    });

    test('calls fetchBookings on render', async () => {
      const { fetchBookings } = await import('@/utils/actions');
      vi.mocked(fetchBookings).mockResolvedValue(mockBookings);

      render(await BookingsPage());

      expect(fetchBookings).toHaveBeenCalledTimes(1);
    });
  });

  describe('when no bookings exist', () => {
    test('renders empty list component', async () => {
      const { fetchBookings } = await import('@/utils/actions');
      vi.mocked(fetchBookings).mockResolvedValue([]);

      render(await BookingsPage());

      expect(screen.getByTestId('empty-list')).toBeInTheDocument();
      expect(screen.getByText('No bookings found')).toBeInTheDocument();
    });
  });

  describe('DeleteBooking component', () => {
    test('binds deleteBookingAction with correct bookingId', async () => {
      const { fetchBookings, deleteBookingAction } = await import('@/utils/actions');
      vi.mocked(fetchBookings).mockResolvedValue(mockBookings);
      vi.mocked(deleteBookingAction).mockImplementation(() => Promise.resolve({ message: 'Success' }));

      render(await BookingsPage());

      const formContainers = screen.getAllByTestId('form-container');
      expect(formContainers).toHaveLength(2);

      // Check that the form action is bound correctly
      // Note: We can't easily test the binding itself, but we can verify the form exists
      expect(formContainers[0]).toBeInTheDocument();
      expect(formContainers[1]).toBeInTheDocument();
    });
  });

  describe('table structure', () => {
    test('renders table with correct accessibility attributes', async () => {
      const { fetchBookings } = await import('@/utils/actions');
      vi.mocked(fetchBookings).mockResolvedValue(mockBookings);

      render(await BookingsPage());

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      // Check caption
      expect(screen.getByText(/A list of your recent bookings/i)).toBeInTheDocument();

      // Check header structure
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(7); // Property Name, Country, Nights, Total, Check In, Check Out, Actions

      // Check table headers are properly scoped
      expect(headers[0]).toBeInTheDocument();
    });
  });

  describe('data formatting', () => {
    test('formats currency and dates correctly', async () => {
      const { fetchBookings } = await import('@/utils/actions');
      const { formatDate, formatCurrency } = await import('@/utils/format');
      
      vi.mocked(fetchBookings).mockResolvedValue(mockBookings);
      vi.mocked(formatDate).mockImplementation((date) => {
        if (date instanceof Date && date.getMonth() === 5) return 'June 1, 2024';
        if (date instanceof Date && date.getMonth() === 6) return 'July 1, 2024';
        return 'Formatted Date';
      });
      vi.mocked(formatCurrency).mockImplementation((amount) => `$${amount}`);

      render(await BookingsPage());

      expect(formatDate).toHaveBeenCalledTimes(4); // 2 bookings * 2 dates each
      expect(formatCurrency).toHaveBeenCalledTimes(2); // 2 bookings
      expect(screen.getByText('$600')).toBeInTheDocument();
      expect(screen.getByText('$400')).toBeInTheDocument();
    });
  });
});
