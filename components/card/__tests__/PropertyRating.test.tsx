import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PropertyRating from '../PropertyRating';
import * as actions from '@/utils/actions';

// Mock the dependencies
vi.mock('@/utils/actions', () => ({
  fetchPropertyRating: vi.fn(),
}));

vi.mock('react-icons/fa', () => ({
  FaStar: () => <svg data-testid="star-icon" />,
}));

describe('PropertyRating Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with multiple reviews in card view (inPage=false)', async () => {
    vi.mocked(actions.fetchPropertyRating).mockResolvedValue({
      rating: 4.5,
      count: 10,
    });

    const component = await PropertyRating({ propertyId: '123', inPage: false });
    render(component);

    expect(screen.getByText(/4.5/)).toBeInTheDocument();
    expect(screen.getByText(/\(10\)/)).toBeInTheDocument();
    expect(screen.queryByText(/reviews/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
  });

  it('renders correctly with a single review in page view (inPage=true)', async () => {
    vi.mocked(actions.fetchPropertyRating).mockResolvedValue({
      rating: 5,
      count: 1,
    });

    const component = await PropertyRating({ propertyId: '123', inPage: true });
    render(component);

    expect(screen.getByText(/5/)).toBeInTheDocument();
    expect(screen.getByText(/\(1\) review/i)).toBeInTheDocument();
  });

  it('returns null when count is 0', async () => {
    vi.mocked(actions.fetchPropertyRating).mockResolvedValue({
      rating: 0,
      count: 0,
    });

    const component = await PropertyRating({ propertyId: '123', inPage: false });
    const { container } = render(component);

    expect(container.firstChild).toBeNull();
  });
});
