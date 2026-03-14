import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PropertyCard from '../PropertyCard';
import { PropertyCardProps } from '@/utils/types';

// Mock child components
vi.mock('../CountryFlagAndName', () => ({
  default: ({ countryCode }: { countryCode: string }) => <div data-testid="mock-country">{countryCode}</div>,
}));

vi.mock('../PropertyRating', () => ({
  default: ({ propertyId }: { propertyId: string }) => <div data-testid="mock-rating">Rating for {propertyId}</div>,
}));

vi.mock('../FavoriteToggleButton', () => ({
  default: ({ propertyId }: { propertyId: string }) => <button data-testid="mock-favorite">Fav {propertyId}</button>,
}));

// Mock @clerk/nextjs/server to avoid "server-only" module errors in JSDOM
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => ({ userId: null })),
  currentUser: vi.fn(() => null),
}));

describe('PropertyCard Component', () => {
  const mockProperty: PropertyCardProps = {
    id: 'prop-123',
    name: 'Beautiful Beach House',
    tagline: 'A wonderful place to stay by the sea',
    price: 150,
    country: 'US',
    image: 'https://example.com/image.jpg',
  };

  it('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText('Beautiful Beach House')).toBeInTheDocument();
    expect(screen.getByText('A wonderful place to stay by the sea')).toBeInTheDocument();
    expect(screen.getByText('$150')).toBeInTheDocument();
    expect(screen.getByTestId('mock-country')).toHaveTextContent('US');
    expect(screen.getByTestId('mock-rating')).toBeInTheDocument();
    expect(screen.getByTestId('mock-favorite')).toBeInTheDocument();
    
    const img = screen.getByAltText('Beautiful Beach House');
    expect(img).toHaveAttribute('src', mockProperty.image);
  });

  it('truncates long names and taglines', () => {
    const longProperty = {
      ...mockProperty,
      name: 'A very long property name that should definitely be truncated in the heading',
      tagline: 'An extremely long tagline that also needs to be truncated to fit the design properly in the card view',
    };

    render(<PropertyCard property={longProperty} />);

    // substring(0, 30) for name: "A very long property name that"
    expect(screen.getByText('A very long property name that')).toBeInTheDocument();
    // substring(0, 40) for tagline: "An extremely long tagline that also need"
    expect(screen.getByText('An extremely long tagline that also need')).toBeInTheDocument();
  });

  it('contains a link to the property details page', () => {
    render(<PropertyCard property={mockProperty} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/properties/${mockProperty.id}`);
  });
});


