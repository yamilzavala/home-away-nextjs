import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Amenities from '../Amenities';

// Mock react-icons
vi.mock('react-icons/lu', () => ({
  LuFolderCheck: () => <svg data-testid="amenity-icon" />,
}));

// Mock Title component
vi.mock('../Title', () => ({
  default: ({ text }: { text: string }) => <h3 data-testid="mock-title">{text}</h3>,
}));

describe('Amenities Component', () => {
  it('renders correctly with selected amenities', () => {
    const amenities = JSON.stringify([
      { name: 'wifi', selected: true },
      { name: 'kitchen', selected: true },
      { name: 'parking', selected: false },
    ]);

    render(<Amenities amenities={amenities} />);

    expect(screen.getByTestId('mock-title')).toHaveTextContent('What this place offers');
    expect(screen.getByText('wifi')).toBeInTheDocument();
    expect(screen.getByText('kitchen')).toBeInTheDocument();
    expect(screen.queryByText('parking')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('amenity-icon')).toHaveLength(2);
  });

  it('returns null when no amenities are selected', () => {
    const amenities = JSON.stringify([
      { name: 'wifi', selected: false },
      { name: 'kitchen', selected: false },
    ]);

    const { container } = render(<Amenities amenities={amenities} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles empty amenities list', () => {
    const amenities = JSON.stringify([]);
    const { container } = render(<Amenities amenities={amenities} />);
    expect(container.firstChild).toBeNull();
  });
});
