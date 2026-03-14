import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextAreaInput from '../TextAreaInput';

describe('TextAreaInput Component', () => {
  it('renders correctly with name and default label', () => {
    render(<TextAreaInput name="description" />);
    const label = screen.getByLabelText(/description/i);
    const textarea = screen.getByRole('textbox');

    expect(label).toBeInTheDocument();
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('name', 'description');
    expect(textarea).toHaveAttribute('id', 'description');
    expect(textarea).toBeRequired();
  });

  it('renders with custom labelText when provided', () => {
    render(<TextAreaInput name="description" labelText="Property Description" />);
    expect(screen.getByLabelText(/Property Description/i)).toBeInTheDocument();
  });

  it('renders with provided defaultValue', () => {
    const customValue = 'Custom description value';
    render(<TextAreaInput name="description" defaultValue={customValue} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(customValue);
  });

  it('renders with tempDefaultDescription when no defaultValue is provided', () => {
    render(<TextAreaInput name="description" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea.innerHTML).toContain('Glamping Tuscan Style');
  });

  it('has the correct CSS classes', () => {
    const { container } = render(<TextAreaInput name="test" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('mb-2');
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('leading-loose');
  });
});
