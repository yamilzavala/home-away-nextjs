import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PropertyDetails from '../PropertyDetails';

describe('PropertyDetails Component', () => {
  const mockDetails = {
    bedrooms: 2,
    baths: 1,
    guests: 4,
    beds: 3,
  };

  it('renders property details correctly with plural quantities', () => {
    render(<PropertyDetails details={mockDetails} />);
    
    expect(screen.getByText(/2 bedrooms/i)).toBeInTheDocument();
    expect(screen.getByText(/1 bath/i)).toBeInTheDocument();
    expect(screen.getByText(/4 guests/i)).toBeInTheDocument();
    expect(screen.getByText(/3 beds/i)).toBeInTheDocument();
  });

  it('renders property details correctly with singular quantities', () => {
    const singularDetails = {
      bedrooms: 1,
      baths: 1,
      guests: 1,
      beds: 1,
    };
    render(<PropertyDetails details={singularDetails} />);
    
    expect(screen.getByText(/1 bedroom/i)).toBeInTheDocument();
    expect(screen.getByText(/1 bath/i)).toBeInTheDocument();
    expect(screen.getByText(/1 guest/i)).toBeInTheDocument();
    
    // Using a function to find the exact "1 bed ·" text to avoid ambiguity with "1 bedroom"
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'span' && content.includes('1 bed') && !content.includes('bedroom');
    })).toBeInTheDocument();
  });

  it('has the correct CSS classes', () => {
    const { container } = render(<PropertyDetails details={mockDetails} />);
    const paragraph = container.querySelector('p');
    expect(paragraph).toHaveClass('text-md', 'font-light');
  });
});
