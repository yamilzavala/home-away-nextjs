import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormInput from './FormInput';

describe('FormInput', () => {
  it('should render label with name as fallback', () => {
    render(<FormInput name="email" type="text" />);
    expect(screen.getByLabelText('email')).toBeInTheDocument();
  });

  it('should render label with custom label prop', () => {
    render(<FormInput name="email" type="text" label="Email Address" />);
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  });

  it('should render input with correct type', () => {
    render(<FormInput name="email" type="email" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.type).toBe('email');
  });

  it('should render input with defaultValue', () => {
    render(<FormInput name="email" type="text" defaultValue="test@example.com" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('test@example.com');
  });

  it('should render input with placeholder', () => {
    render(<FormInput name="email" type="text" placeholder="Enter your email" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.placeholder).toBe('Enter your email');
  });

  it('should have label properly associated with input (accessibility)', () => {
    render(<FormInput name="email" type="text" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.id).toBe('email');
    // getByLabelText already verifies the label is associated with the input
    expect(screen.getByLabelText('email')).toBeInTheDocument();
  });
});
