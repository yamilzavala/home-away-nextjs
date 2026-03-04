import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CounterInput from './CounterInput';

describe('CounterInput', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should render initial count of 0 when no defaultValue', () => {
    render(<CounterInput detail="guests" />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render defaultValue when provided', () => {
    render(<CounterInput detail="guests" defaultValue={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should increment count by 1 when clicking plus button', async () => {
    render(<CounterInput detail="guests" />);
    const plusButton = screen.getAllByRole('button')[1]; // Plus is second button
    await user.click(plusButton);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should decrement count by 1 when clicking minus button', async () => {
    render(<CounterInput detail="guests" defaultValue={2} />);
    const minusButton = screen.getAllByRole('button')[0]; // Minus is first button
    await user.click(minusButton);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should not go below 0', async () => {
    render(<CounterInput detail="guests" />);
    const minusButton = screen.getAllByRole('button')[0];
    await user.click(minusButton);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should have hidden input value matching displayed count', async () => {
    render(<CounterInput detail="guests" />);
    const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hiddenInput.value).toBe('0');

    const plusButton = screen.getAllByRole('button')[1];
    await user.click(plusButton);
    expect(hiddenInput.value).toBe('1');
  });

  it('should render detail label and description', () => {
    render(<CounterInput detail="bedrooms" />);
    expect(screen.getByText('bedrooms')).toBeInTheDocument();
    expect(screen.getByText('Specify the number of bedrooms')).toBeInTheDocument();
  });
});
