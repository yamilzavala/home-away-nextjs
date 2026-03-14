import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Title from '../Title';

describe('Title Component', () => {
  it('renders the text correctly', () => {
    const testText = 'Property Title';
    render(<Title text={testText} />);
    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  it('renders as an h3 element', () => {
    render(<Title text="Test" />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('has the correct CSS classes', () => {
    render(<Title text="Test" />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-lg', 'font-bold', 'mb-2');
  });
});
