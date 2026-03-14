import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyList from '../EmptyList';

describe('EmptyList Component', () => {
  it('renders with default props correctly', () => {
    render(<EmptyList />);
    expect(screen.getByText(/No items in the list/i)).toBeInTheDocument();
    expect(screen.getByText(/Keep exploring our properties/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back home/i })).toBeInTheDocument();
  });

  it('renders with custom props correctly', () => {
    render(
      <EmptyList 
        heading="No bookings found" 
        message="You have no upcoming trips." 
        btnText="browse properties" 
      />
    );
    expect(screen.getByText(/No bookings found/i)).toBeInTheDocument();
    expect(screen.getByText(/You have no upcoming trips/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse properties/i })).toBeInTheDocument();
  });

  it('link points to home page', () => {
    render(<EmptyList />);
    const link = screen.getByRole('link', { name: /back home/i });
    expect(link).toHaveAttribute('href', '/');
  });
});
