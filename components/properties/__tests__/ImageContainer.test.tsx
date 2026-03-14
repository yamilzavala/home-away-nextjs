import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImageContainer from '../ImageContainer';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, fill, priority, sizes, className }: any) => (
    <img
      src={src}
      alt={alt}
      className={className}
      data-fill={fill?.toString()}
      data-priority={priority?.toString()}
      data-sizes={sizes}
      data-testid="mock-image"
    />
  ),
}));

describe('ImageContainer Component', () => {
  const mockProps = {
    mainImage: 'https://example.com/property.jpg',
    name: 'Beautiful Villa',
  };

  it('renders the image with correct props', () => {
    render(<ImageContainer {...mockProps} />);
    
    const img = screen.getByTestId('mock-image');
    expect(img).toHaveAttribute('src', mockProps.mainImage);
    expect(img).toHaveAttribute('alt', mockProps.name);
    expect(img).toHaveAttribute('data-fill', 'true');
    expect(img).toHaveAttribute('data-priority', 'true');
    expect(img).toHaveAttribute('data-sizes', '100vw');
    expect(img).toHaveClass('object-cover', 'rounded-md');
  });

  it('has the correct section classes', () => {
    const { container } = render(<ImageContainer {...mockProps} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('h-[300px]', 'md:h-[500px]', 'relative', 'mt-8');
  });
});
