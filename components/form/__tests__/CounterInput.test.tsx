import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CounterInput from '../CounterInput';

describe('CounterInput Component', () => {
  it('renders with initial default value', () => {
    render(<CounterInput detail="guests" defaultValue={2} />);
    
    expect(screen.getByText('guests')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    
    const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hiddenInput.value).toBe('2');
    expect(hiddenInput.name).toBe('guests');
  });

  it('renders with 0 when no defaultValue is provided', () => {
    render(<CounterInput detail="bedrooms" />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('increases count when plus button is clicked', async () => {
    const user = userEvent.setup();
    render(<CounterInput detail="beds" defaultValue={1} />);
    
    const plusButton = screen.getAllByRole('button')[1]; // Second button is Plus
    await user.click(plusButton);
    
    expect(screen.getByText('2')).toBeInTheDocument();
    const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hiddenInput.value).toBe('2');
  });

  it('decreases count when minus button is clicked', async () => {
    const user = userEvent.setup();
    render(<CounterInput detail="baths" defaultValue={2} />);
    
    const minusButton = screen.getAllByRole('button')[0]; // First button is Minus
    await user.click(minusButton);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hiddenInput.value).toBe('1');
  });

  it('does not decrease count below 0', async () => {
    const user = userEvent.setup();
    render(<CounterInput detail="guests" defaultValue={0} />);
    
    const minusButton = screen.getAllByRole('button')[0];
    await user.click(minusButton);
    
    expect(screen.getByText('0')).toBeInTheDocument();
    const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hiddenInput.value).toBe('0');
  });
});
