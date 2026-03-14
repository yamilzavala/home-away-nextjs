// Import necessary utilities from MSW
import { http, HttpResponse } from 'msw';

// Define mock data types
interface Profile {
  id: string;
  clerkId: string;
  email: string;
  profileImage: string;
  firstName: string;
  lastName: string;
  username: string;
}

interface Property {
  id: string;
  name: string;
  tagline: string;
  country: string;
  image: string;
  price: number;
  category: string;
  description: string;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  amenities: string;
  profileId: string;
  createdAt: Date;
}

interface Booking {
  id: string;
  checkIn: Date;
  checkOut: Date;
  orderTotal: number;
  totalNights: number;
  paymentStatus: boolean;
  profileId: string;
  propertyId: string;
  property: Property;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  propertyId: string;
  profileId: string;
  profile: {
    firstName: string;
    profileImage: string;
  };
}

interface Favorite {
  id: string;
  propertyId: string;
  profileId: string;
}

// Create mock data that will be used as our "database"
export let profiles: Profile[] = [
  {
    id: '1',
    clerkId: 'user_123',
    email: 'john.doe@example.com',
    profileImage: 'https://example.com/avatar1.jpg',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe'
  }
];

export let properties: Property[] = [
  {
    id: '1',
    name: 'Cozy Beach House',
    tagline: 'Perfect getaway by the sea',
    country: 'US',
    image: 'https://example.com/property1.jpg',
    price: 150,
    category: 'beach',
    description: 'A beautiful beach house with stunning ocean views and modern amenities.',
    guests: 4,
    bedrooms: 2,
    beds: 3,
    baths: 2,
    amenities: 'WiFi, Pool, Kitchen, Parking',
    profileId: 'user_123',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Mountain Cabin Retreat',
    tagline: 'Escape to the mountains',
    country: 'CA',
    image: 'https://example.com/property2.jpg',
    price: 200,
    category: 'mountain',
    description: 'A rustic cabin nestled in the mountains with breathtaking views.',
    guests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 2,
    amenities: 'WiFi, Fireplace, Kitchen, Hot Tub',
    profileId: 'user_123',
    createdAt: new Date('2024-01-15')
  }
];

export let bookings: Booking[] = [
  {
    id: '1',
    checkIn: new Date('2024-06-01'),
    checkOut: new Date('2024-06-05'),
    orderTotal: 600,
    totalNights: 4,
    paymentStatus: true,
    profileId: 'user_123',
    propertyId: '1',
    property: properties[0]
  }
];

export let reviews: Review[] = [
  {
    id: '1',
    rating: 5,
    comment: 'Amazing place! Highly recommended.',
    propertyId: '1',
    profileId: 'user_123',
    profile: {
      firstName: 'John',
      profileImage: 'https://example.com/avatar1.jpg'
    }
  }
];

export let favorites: Favorite[] = [
  {
    id: '1',
    propertyId: '1',
    profileId: 'user_123'
  }
];

// Define request handlers for MSW
export const handlers = [
  // Profile endpoints
  http.get('/api/profile', async () => {
    return HttpResponse.json(profiles[0]);
  }),
  
  http.post('/api/profile', async ({ request }) => {
    const newProfile = await request.json() as Profile;
    newProfile.id = Date.now().toString();
    profiles.push(newProfile);
    return HttpResponse.json(newProfile, { status: 201 });
  }),

  http.put('/api/profile', async ({ request }) => {
    const updatedProfile = await request.json() as Profile;
    const index = profiles.findIndex(p => p.clerkId === updatedProfile.clerkId);
    if (index !== -1) {
      profiles[index] = updatedProfile;
      return HttpResponse.json(updatedProfile);
    }
    return HttpResponse.json({ message: 'Profile not found' }, { status: 404 });
  }),

  // Property endpoints
  http.get('/api/properties', async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    
    let filteredProperties = properties;
    
    if (search) {
      filteredProperties = filteredProperties.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tagline.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category) {
      filteredProperties = filteredProperties.filter(p => p.category === category);
    }
    
    return HttpResponse.json(filteredProperties);
  }),

  http.get('/api/properties/:id', async ({ params }) => {
    const { id } = params;
    const property = properties.find(p => p.id === id);
    if (property) {
      return HttpResponse.json(property);
    }
    return HttpResponse.json({ message: 'Property not found' }, { status: 404 });
  }),

  http.post('/api/properties', async ({ request }) => {
    const newProperty = await request.json() as Property;
    newProperty.id = Date.now().toString();
    newProperty.createdAt = new Date();
    properties.push(newProperty);
    return HttpResponse.json(newProperty, { status: 201 });
  }),

  http.put('/api/properties/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedProperty = await request.json() as Property;
    const index = properties.findIndex(p => p.id === id);
    if (index !== -1) {
      properties[index] = updatedProperty;
      return HttpResponse.json(updatedProperty);
    }
    return HttpResponse.json({ message: 'Property not found' }, { status: 404 });
  }),

  http.delete('/api/properties/:id', async ({ params }) => {
    const { id } = params;
    properties = properties.filter(p => p.id !== id);
    return HttpResponse.json(null, { status: 200 });
  }),

  // Booking endpoints
  http.get('/api/bookings', async () => {
    return HttpResponse.json(bookings);
  }),

  http.post('/api/bookings', async ({ request }) => {
    const newBooking = await request.json() as Booking;
    newBooking.id = Date.now().toString();
    bookings.push(newBooking);
    return HttpResponse.json(newBooking, { status: 201 });
  }),

  http.delete('/api/bookings/:id', async ({ params }) => {
    const { id } = params;
    bookings = bookings.filter(b => b.id !== id);
    return HttpResponse.json(null, { status: 200 });
  }),

  // Review endpoints
  http.get('/api/reviews', async ({ request }) => {
    const url = new URL(request.url);
    const propertyId = url.searchParams.get('propertyId');
    
    if (propertyId) {
      const propertyReviews = reviews.filter(r => r.propertyId === propertyId);
      return HttpResponse.json(propertyReviews);
    }
    
    return HttpResponse.json(reviews);
  }),

  http.post('/api/reviews', async ({ request }) => {
    const newReview = await request.json() as Review;
    newReview.id = Date.now().toString();
    reviews.push(newReview);
    return HttpResponse.json(newReview, { status: 201 });
  }),

  http.delete('/api/reviews/:id', async ({ params }) => {
    const { id } = params;
    reviews = reviews.filter(r => r.id !== id);
    return HttpResponse.json(null, { status: 200 });
  }),

  // Favorite endpoints
  http.get('/api/favorites', async () => {
    return HttpResponse.json(favorites);
  }),

  http.post('/api/favorites', async ({ request }) => {
    const newFavorite = await request.json() as Favorite;
    newFavorite.id = Date.now().toString();
    favorites.push(newFavorite);
    return HttpResponse.json(newFavorite, { status: 201 });
  }),

  http.delete('/api/favorites/:id', async ({ params }) => {
    const { id } = params;
    favorites = favorites.filter(f => f.id !== id);
    return HttpResponse.json(null, { status: 200 });
  }),
];

// Error handlers for testing error scenarios
export const profileErrorHandler = [
  http.get('/api/profile', () => {
    return HttpResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }),
];

export const propertyErrorHandler = [
  http.get('/api/properties', () => {
    return HttpResponse.json(
      { message: 'Failed to fetch properties' },
      { status: 500 }
    );
  }),
];

export const bookingErrorHandler = [
  http.get('/api/bookings', () => {
    return HttpResponse.json(
      { message: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }),
];

export const reviewErrorHandler = [
  http.post('/api/reviews', () => {
    return HttpResponse.json(
      { message: 'Failed to create review' },
      { status: 400 }
    );
  }),
];

export const favoriteErrorHandler = [
  http.post('/api/favorites', () => {
    return HttpResponse.json(
      { message: 'Failed to toggle favorite' },
      { status: 400 }
    );
  }),
];
