import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PriceInput from '../PriceInput';

describe('PriceInput Component', () => {
  it('renders correctly with label and default value', () => {
    render(<PriceInput />);
    const label = screen.getByLabelText(/Price \(\$\)/i);
    const input = screen.getByRole('spinbutton');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'price');
    expect(input).toHaveAttribute('id', 'price');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveValue(100);
    expect(input).toBeRequired();
  });

  it('renders with provided defaultValue', () => {
    render(<PriceInput defaultValue={250} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(250);
  });

  it('has the correct CSS classes', () => {
    const { container } = render(<PriceInput />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('mb-2');
    
    const label = screen.getByText(/Price \(\$\)/i);
    expect(label).toHaveClass('capitalize');
  });
});
