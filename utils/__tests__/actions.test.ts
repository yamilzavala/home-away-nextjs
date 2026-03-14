import { describe, test, expect, vi, beforeEach } from 'vitest';
import { 
  fetchProperties, 
  fetchPropertyDetails, 
  fetchBookings,
  fetchFavorites,
  fetchPropertyReviews,
  fetchPropertyRating,
  createReviewAction,
  deleteBookingAction,
  toggleFavoriteAction
} from '../actions';

// Mock the database
vi.mock('../db', () => {
  const mockDb = {
    profile: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    property: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    booking: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      aggregate: vi.fn(),
      deleteMany: vi.fn(),
    },
    review: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      groupBy: vi.fn(),
      findFirst: vi.fn(),
    },
    favorite: {
      findFirst: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
    },
  };
  return {
    __esModule: true,
    db: mockDb,
    default: mockDb,
  };
});

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
  clerkClient: {
    users: {
      updateUserMetadata: vi.fn(),
    },
  },
}));

// Mock other dependencies
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('../supabase', () => ({
  uploadImage: vi.fn(),
}));

vi.mock('../schemas', () => ({
  validateWithZodSchema: vi.fn(),
  profileSchema: {},
  imageSchema: {},
  propertySchema: {},
  createReviewSchema: {},
}));

vi.mock('../calculateTotals', () => ({
  calculateTotals: vi.fn(),
}));

describe('Server Actions - Properties', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchProperties', () => {
    test('fetches properties without filters', async () => {
      const mockProperties = [
        { id: '1', name: 'Test Property', country: 'US' },
        { id: '2', name: 'Another Property', country: 'CA' },
      ];
      
      const { db } = await import('../db') as any;
      vi.mocked(db.property.findMany).mockResolvedValue(mockProperties);

      const result = await fetchProperties({});

      expect(db.property.findMany).toHaveBeenCalledWith({
        where: {
          category: undefined,
          OR: [
            { name: { contains: '', mode: 'insensitive' } },
            { tagline: { contains: '', mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          tagline: true,
          country: true,
          image: true,
          price: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockProperties);
    });

    test('fetches properties with search filter', async () => {
      const mockProperties = [{ id: '1', name: 'Beach House', country: 'US' }];
      
      const { db } = await import('../db') as any;
      vi.mocked(db.property.findMany).mockResolvedValue(mockProperties);

      const result = await fetchProperties({ search: 'beach', category: 'beach' });

      expect(db.property.findMany).toHaveBeenCalledWith({
        where: {
          category: 'beach',
          OR: [
            { name: { contains: 'beach', mode: 'insensitive' } },
            { tagline: { contains: 'beach', mode: 'insensitive' } },
          ],
        },
        select: expect.any(Object),
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockProperties);
    });
  });

  describe('fetchPropertyDetails', () => {
    test('fetches property details with relations', async () => {
      const mockProperty = {
        id: '1',
        name: 'Test Property',
        profile: { firstName: 'John' },
        bookings: [{ checkIn: new Date(), checkOut: new Date() }],
      };
      
      const { db } = await import('../db');
      vi.mocked(db.property.findUnique).mockResolvedValue(mockProperty);

      const result = await fetchPropertyDetails('1');

      expect(db.property.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          profile: true,
          bookings: {
            select: {
              checkIn: true,
              checkOut: true,
            },
          },
        },
      });
      expect(result).toEqual(mockProperty);
    });
  });
});

describe('Server Actions - Bookings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchBookings', () => {
    test('fetches user bookings with property details', async () => {
      const mockBookings = [
        {
          id: '1',
          orderTotal: 500,
          totalNights: 3,
          property: { id: '1', name: 'Test Property', country: 'US' },
        },
      ];
      
      const { db } = await import('../db') as any;
      const { currentUser } = await import('@clerk/nextjs/server');
      
      vi.mocked(currentUser).mockResolvedValue({ id: 'user_123' } as any);
      vi.mocked(db.booking.findMany).mockResolvedValue(mockBookings);

      const result = await fetchBookings();

      expect(db.booking.findMany).toHaveBeenCalledWith({
        where: {
          profileId: 'user_123',
          paymentStatus: true,
        },
        include: {
          property: {
            select: {
              id: true,
              name: true,
              country: true,
            },
          },
        },
        orderBy: {
          checkIn: 'desc',
        },
      });
      expect(result).toEqual(mockBookings);
    });
  });

  describe('deleteBookingAction', () => {
    test('deletes a booking successfully', async () => {
      const { db } = await import('../db');
      const { currentUser } = await import('@clerk/nextjs/server');
      const { revalidatePath } = await import('next/cache');
      
      vi.mocked(currentUser).mockResolvedValue({ id: 'user_123' });
      vi.mocked(db.booking.delete).mockResolvedValue({ id: '1' });

      const result = await deleteBookingAction({ bookingId: '1' });

      expect(db.booking.delete).toHaveBeenCalledWith({
        where: {
          id: '1',
          profileId: 'user_123',
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith('/bookings');
      expect(result).toEqual({ message: 'Booking deleted successfully' });
    });

    test('returns error when booking deletion fails', async () => {
      const { db } = await import('../db');
      const { currentUser } = await import('@clerk/nextjs/server');
      
      vi.mocked(currentUser).mockResolvedValue({ id: 'user_123' } as any);
      vi.mocked(db.booking.delete).mockRejectedValue(new Error('Booking not found'));

      const result = await deleteBookingAction({ bookingId: '1' });

      expect(result).toEqual({ message: 'Booking not found' });
    });
  });
});

describe('Server Actions - Reviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPropertyReviews', () => {
    test('fetches reviews for a property', async () => {
      const mockReviews = [
        {
          id: '1',
          rating: 5,
          comment: 'Great place!',
          profile: { firstName: 'John', profileImage: 'avatar.jpg' },
        },
      ];
      
      const { db } = await import('../db');
      vi.mocked(db.review.findMany).mockResolvedValue(mockReviews);

      const result = await fetchPropertyReviews('property_1');

      expect(db.review.findMany).toHaveBeenCalledWith({
        where: {
          propertyId: 'property_1',
        },
        select: {
          id: true,
          rating: true,
          comment: true,
          profile: {
            select: {
              firstName: true,
              profileImage: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockReviews);
    });
  });

  describe('fetchPropertyRating', () => {
    test('calculates property rating correctly', async () => {
      const mockRatingData = [
        {
          propertyId: 'property_1',
          _avg: { rating: 4.5 },
          _count: { rating: 10 },
        },
      ];
      
      const { db } = await import('../db');
      vi.mocked(db.review.groupBy).mockResolvedValue(mockRatingData);

      const result = await fetchPropertyRating('property_1');

      expect(db.review.groupBy).toHaveBeenCalledWith({
        by: ['propertyId'],
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
        where: {
          propertyId: 'property_1',
        },
      });
      expect(result).toEqual({ rating: '5', count: 10 });
    });

    test('returns default rating when no reviews exist', async () => {
      const { db } = await import('../db');
      vi.mocked(db.review.groupBy).mockResolvedValue([]);

      const result = await fetchPropertyRating('property_1');

      expect(result).toEqual({ rating: 0, count: 0 });
    });
  });
});

describe('Server Actions - Favorites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('toggleFavoriteAction', () => {
    test('adds property to favorites', async () => {
      const { db } = await import('../db') as any;
      const { currentUser } = await import('@clerk/nextjs/server');
      const { revalidatePath } = await import('next/cache');
      
      vi.mocked(currentUser).mockResolvedValue({ id: 'user_123' } as any);
      vi.mocked(db.favorite.findFirst).mockResolvedValue(null);
      vi.mocked(db.favorite.create).mockResolvedValue({ id: '1' });

      const prevState = {
        propertyId: 'property_1',
        favoriteId: null,
        pathname: '/properties/property_1',
      };

      const result = await toggleFavoriteAction(prevState);

      expect(db.favorite.create).toHaveBeenCalledWith({
        data: {
          propertyId: 'property_1',
          profileId: 'user_123',
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith('/properties/property_1');
      expect(result).toEqual({ message: 'Added to Favorites' });
    });

    test('removes property from favorites', async () => {
      const { db } = await import('../db') as any;
      const { currentUser } = await import('@clerk/nextjs/server');
      const { revalidatePath } = await import('next/cache');
      
      vi.mocked(currentUser).mockResolvedValue({ id: 'user_123' } as any);
      vi.mocked(db.favorite.findFirst).mockResolvedValue({ id: 'fav_1' });
      vi.mocked(db.favorite.delete).mockResolvedValue({ id: 'fav_1' });

      const prevState = {
        propertyId: 'property_1',
        favoriteId: 'fav_1',
        pathname: '/properties/property_1',
      };

      const result = await toggleFavoriteAction(prevState);

      expect(db.favorite.delete).toHaveBeenCalledWith({
        where: {
          id: 'fav_1',
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith('/properties/property_1');
      expect(result).toEqual({ message: 'Removed from Favorites' });
    });
  });

  describe('fetchFavorites', () => {
    test('fetches user favorites with property details', async () => {
      const mockFavorites = [
        {
          property: {
            id: '1',
            name: 'Test Property',
            price: 150,
            country: 'US',
            image: 'image.jpg',
          },
        },
      ];
      
      const { db } = await import('../db') as any;
      const { currentUser } = await import('@clerk/nextjs/server');
      
      vi.mocked(currentUser).mockResolvedValue({ id: 'user_123' } as any);
      vi.mocked(db.favorite.findMany).mockResolvedValue(mockFavorites);

      const result = await fetchFavorites();

      expect(db.favorite.findMany).toHaveBeenCalledWith({
        where: {
          profileId: 'user_123',
        },
        select: {
          property: {
            select: {
              id: true,
              name: true,
              tagline: true,
              price: true,
              country: true,
              image: true,
            },
          },
        },
      });
      expect(result).toEqual([mockFavorites[0].property]);
    });
  });
});
