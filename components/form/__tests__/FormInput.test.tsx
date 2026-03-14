import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormInput from '../FormInput';

describe('FormInput Component', () => {
  it('renders correctly with name and type', () => {
    render(<FormInput name="firstName" type="text" />);
    const label = screen.getByLabelText(/firstName/i);
    const input = screen.getByRole('textbox');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'firstName');
    expect(input).toHaveAttribute('id', 'firstName');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders with custom label when provided', () => {
    render(<FormInput name="email" type="email" label="Email Address" />);
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  });

  it('renders with defaultValue and placeholder', () => {
    render(
      <FormInput 
        name="username" 
        type="text" 
        defaultValue="john_doe" 
        placeholder="Enter your username" 
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('john_doe');
    expect(input).toHaveAttribute('placeholder', 'Enter your username');
  });

  it('has the correct wrapper class', () => {
    const { container } = render(<FormInput name="test" type="text" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('mb-2');
  });
});
