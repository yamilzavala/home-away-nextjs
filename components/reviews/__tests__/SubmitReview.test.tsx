import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubmitReview from '../SubmitReview';

// Mock child components using absolute path aliases to avoid unmocked hook issues
vi.mock('@/components/form/FormContainer', () => ({
  default: ({ children }: any) => <div data-testid="mock-form-container">{children}</div>,
}));

vi.mock('@/components/form/RatingInput', () => ({
  default: ({ name }: any) => <div data-testid="mock-rating-input">Rating Input: {name}</div>,
}));

vi.mock('@/components/form/TextAreaInput', () => ({
  default: ({ name, labelText, defaultValue }: any) => (
    <div data-testid="mock-textarea-input">
      {labelText}: {defaultValue}
    </div>
  ),
}));

vi.mock('@/components/form/Buttons', () => ({
  SubmitButton: ({ text }: any) => <button type="submit">{text}</button>,
}));

// Mock utils/actions to avoid Prisma dependency
vi.mock('@/utils/actions', () => ({
  createReviewAction: () => Promise.resolve({ message: 'Review created' }),
}));

describe('SubmitReview Component', () => {
  const propertyId = 'prop-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the "Leave a Review" button initially', () => {
    render(<SubmitReview propertyId={propertyId} />);
    expect(screen.getByRole('button', { name: /leave a review/i })).toBeInTheDocument();
    expect(screen.queryByTestId('mock-form-container')).not.toBeInTheDocument();
  });

  it('toggles the review form visibility when button is clicked', async () => {
    const user = userEvent.setup();
    render(<SubmitReview propertyId={propertyId} />);
    
    const toggleButton = screen.getByRole('button', { name: /leave a review/i });
    
    // Open form
    await user.click(toggleButton);
    expect(screen.getByTestId('mock-form-container')).toBeInTheDocument();
    expect(screen.getByTestId('mock-rating-input')).toBeInTheDocument();
    
    // Close form
    await user.click(toggleButton);
    expect(screen.queryByTestId('mock-form-container')).not.toBeInTheDocument();
  });

  it('renders correctly within the form when visible', async () => {
    const user = userEvent.setup();
    render(<SubmitReview propertyId={propertyId} />);
    
    await user.click(screen.getByRole('button', { name: /leave a review/i }));
    
    expect(screen.getByTestId('mock-rating-input')).toHaveTextContent('rating');
    expect(screen.getByTestId('mock-textarea-input')).toHaveTextContent('your thoughts on this property');
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    
    const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hiddenInput.value).toBe(propertyId);
    expect(hiddenInput.name).toBe('propertyId');
  });
});
