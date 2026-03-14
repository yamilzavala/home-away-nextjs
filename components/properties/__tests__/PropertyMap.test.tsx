import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PropertyMap from '../PropertyMap';

// Mock react-leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children, center }: any) => (
    <div data-testid="mock-map-container" data-center={JSON.stringify(center)}>
      {children}
    </div>
  ),
  TileLayer: () => <div data-testid="mock-tile-layer" />,
  Marker: ({ position }: any) => (
    <div data-testid="mock-marker" data-position={JSON.stringify(position)} />
  ),
  ZoomControl: () => <div data-testid="mock-zoom-control" />,
}));

// Mock leaflet
vi.mock('leaflet', () => ({
  icon: vi.fn(),
}));

// Mock Title component
vi.mock('../Title', () => ({
  default: ({ text }: { text: string }) => <h3 data-testid="mock-title">{text}</h3>,
}));

// Mock CountryFlagAndName component
vi.mock('../../card/CountryFlagAndName', () => ({
  default: ({ countryCode }: { countryCode: string }) => (
    <div data-testid="mock-country-flag">{countryCode}</div>
  ),
}));

// Mock countries utility
vi.mock('@/utils/countries', () => ({
  findCountryByCode: vi.fn((code) => {
    if (code === 'AR') {
      return { location: [-34, -64] };
    }
    return null;
  }),
}));

describe('PropertyMap Component', () => {
  it('renders correctly with given country code', () => {
    render(<PropertyMap countryCode="AR" />);

    expect(screen.getByTestId('mock-title')).toHaveTextContent(/Where you will be staying/i);
    expect(screen.getByTestId('mock-country-flag')).toHaveTextContent('AR');
    
    const mapContainer = screen.getByTestId('mock-map-container');
    expect(mapContainer).toHaveAttribute('data-center', JSON.stringify([-34, -64]));
    
    expect(screen.getByTestId('mock-marker')).toHaveAttribute('data-position', JSON.stringify([-34, -64]));
  });

  it('uses default location when country code is not found', () => {
    render(<PropertyMap countryCode="XX" />);
    
    const defaultLocation = [51.505, -0.09];
    const mapContainer = screen.getByTestId('mock-map-container');
    expect(mapContainer).toHaveAttribute('data-center', JSON.stringify(defaultLocation));
  });
});
