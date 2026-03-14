import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PropertiesList from '../PropertiesList';
import type { PropertyCardProps } from '@/utils/types';

// Mock child components with relative paths
// Ensure we mock EVERY sub-component used by PropertyCard if we didn't mock PropertyCard fully
vi.mock('../../card/PropertyCard', () => ({
  default: ({ property }: { property: PropertyCardProps }) => (
    <div data-testid="mock-property-card">
      {property.name}
    </div>
  ),
}));

describe('PropertiesList Component', () => {
  const mockProperties: PropertyCardProps[] = [
    {
      id: '1',
      name: 'Property 1',
      tagline: 'Tagline 1',
      country: 'US',
      price: 100,
      image: 'image1.jpg',
    },
    {
      id: '2',
      name: 'Property 2',
      tagline: 'Tagline 2',
      country: 'CA',
      price: 200,
      image: 'image2.jpg',
    },
  ];

  it('renders all property cards correctly', () => {
    render(<PropertiesList properties={mockProperties} />);
    
    const propertyCards = screen.getAllByTestId('mock-property-card');
    expect(propertyCards).toHaveLength(mockProperties.length);
    expect(screen.getByText('Property 1')).toBeInTheDocument();
    expect(screen.getByText('Property 2')).toBeInTheDocument();
  });

  it('renders correctly with an empty properties list', () => {
    render(<PropertiesList properties={[]} />);
    const propertyCards = screen.queryAllByTestId('mock-property-card');
    expect(propertyCards).toHaveLength(0);
  });

  it('has the correct grid layout classes', () => {
    const { container } = render(<PropertiesList properties={mockProperties} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-4', 'gap-8', 'grid', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4');
  });
});
