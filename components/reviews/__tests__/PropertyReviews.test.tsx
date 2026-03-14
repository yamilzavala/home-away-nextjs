import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PropertyReviews from '../PropertyReviews';
import * as actions from '@/utils/actions';

// Mock dependencies
vi.mock('@/utils/actions', () => ({
  fetchPropertyReviews: vi.fn(),
}));

vi.mock('@/components/properties/Title', () => ({
  default: ({ text }: { text: string }) => <h3 data-testid="mock-title">{text}</h3>,
}));

vi.mock('../ReviewCard', () => ({
  default: ({ reviewInfo }: any) => (
    <div data-testid="mock-review-card">
      {reviewInfo.name}: {reviewInfo.comment}
    </div>
  ),
}));

describe('PropertyReviews Component', () => {
  const propertyId = 'prop-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when reviews exist', async () => {
    const mockReviews = [
      {
        id: 'rev-1',
        comment: 'Great place!',
        rating: 5,
        profile: { firstName: 'John', profileImage: 'john.jpg' },
      },
      {
        id: 'rev-2',
        comment: 'Nice stay',
        rating: 4,
        profile: { firstName: 'Jane', profileImage: 'jane.jpg' },
      },
    ];
    vi.mocked(actions.fetchPropertyReviews).mockResolvedValue(mockReviews);

    const component = await PropertyReviews({ propertyId });
    render(component);

    expect(screen.getByTestId('mock-title')).toHaveTextContent(/Reviews/i);
    const cards = screen.getAllByTestId('mock-review-card');
    expect(cards).toHaveLength(2);
    expect(screen.getByText(/John: Great place!/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane: Nice stay/i)).toBeInTheDocument();
  });

  it('returns null when no reviews exist', async () => {
    vi.mocked(actions.fetchPropertyReviews).mockResolvedValue([]);

    const component = await PropertyReviews({ propertyId });
    const { container } = render(component);

    expect(container.firstChild).toBeNull();
  });
});
