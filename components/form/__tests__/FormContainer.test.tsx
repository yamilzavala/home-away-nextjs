import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormContainer from '../FormContainer';
import { useFormState } from 'react-dom';
import { useToast } from '@/components/ui/use-toast';

vi.mock('react-dom', () => ({
  useFormState: vi.fn(),
}));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('FormContainer', () => {
  const mockAction = vi.fn();
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useToast).mockReturnValue({ toast: mockToast } as any);
  });

  it('renders children correctly', () => {
    vi.mocked(useFormState).mockReturnValue([{ message: '' }, vi.fn(), false]);
    
    render(
      <FormContainer action={mockAction}>
        <button type="submit">Submit</button>
      </FormContainer>
    );

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows toast message when state.message changes', () => {
    // Initial render
    vi.mocked(useFormState).mockReturnValue([{ message: '' }, vi.fn(), false]);
    const { rerender } = render(
      <FormContainer action={mockAction}>
        <div>Children</div>
      </FormContainer>
    );

    // Update mock for rerender
    vi.mocked(useFormState).mockReturnValue([{ message: 'Success!' }, vi.fn(), false]);
    
    rerender(
      <FormContainer action={mockAction}>
        <div>Children</div>
      </FormContainer>
    );

    expect(mockToast).toHaveBeenCalledWith({ description: 'Success!' });
  });
});
