import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImageInput from '../ImageInput';

describe('ImageInput Component', () => {
  it('renders correctly with label and file input', () => {
    render(<ImageInput />);
    
    expect(screen.getByLabelText(/image/i)).toBeInTheDocument();
    const input = screen.getByLabelText(/image/i) as HTMLInputElement;
    
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('name', 'image');
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input).toBeRequired();
  });

  it('has the correct CSS classes', () => {
    const { container } = render(<ImageInput />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('mb-2');
    
    const input = screen.getByLabelText(/image/i);
    expect(input).toHaveClass('max-w-xs');
  });
});
