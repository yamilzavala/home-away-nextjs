import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReviewCard from '../ReviewCard';

// Use actual components but mock icons inside them via vi.mock
vi.mock('react-icons/fa', () => ({
  FaStar: () => <svg data-testid="star-filled" />,
  FaRegStar: () => <svg data-testid="star-empty" />,
}));

describe('ReviewCard Component', () => {
  const mockReviewInfo = {
    name: 'john doe',
    image: 'https://example.com/john.jpg',
    rating: 4,
    comment: 'Great stay!',
  };

  it('renders review information correctly', () => {
    render(<ReviewCard reviewInfo={mockReviewInfo} />);

    const img = screen.getByAltText('profile');
    expect(img).toHaveAttribute('src', mockReviewInfo.image);
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    
    // Verify rating by counting filled stars (since we are using the actual Rating component)
    const filledStars = screen.getAllByTestId('star-filled');
    expect(filledStars).toHaveLength(4);
    
    expect(screen.getByText('Great stay!')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <ReviewCard reviewInfo={mockReviewInfo}>
        <button data-testid="delete-btn">Delete</button>
      </ReviewCard>
    );

    expect(screen.getByTestId('delete-btn')).toBeInTheDocument();
  });
});
