import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserInfo from '../UserInfo';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} data-testid="mock-user-image" />
  ),
}));

describe('UserInfo Component', () => {
  const mockProfile = {
    profileImage: 'https://example.com/user.jpg',
    firstName: 'John',
  };

  it('renders user information correctly', () => {
    render(<UserInfo profile={mockProfile} />);

    expect(screen.getByText(/Hosted by/i)).toBeInTheDocument();
    expect(screen.getByText(/John/i)).toBeInTheDocument();
    expect(screen.getByText(/Superhost/i)).toBeInTheDocument();
    
    const img = screen.getByTestId('mock-user-image');
    expect(img).toHaveAttribute('src', mockProfile.profileImage);
    expect(img).toHaveAttribute('alt', mockProfile.firstName);
  });

  it('has the correct layout classes', () => {
    const { container } = render(<UserInfo profile={mockProfile} />);
    const article = container.querySelector('article');
    expect(article).toHaveClass('grid', 'grid-cols-[auto,1fr]', 'gap-4', 'mt-4');
  });
});
