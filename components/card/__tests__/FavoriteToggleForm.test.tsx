import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import FavoriteToggleForm from '../FavoriteToggleForm';
import { usePathname } from 'next/navigation';
import * as actions from '@/utils/actions';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock child components with relative paths
// Using absolute path alias might be more reliable if relatives fail
vi.mock('@/components/form/FormContainer', () => ({
  default: ({ children }: any) => (
    <div data-testid="mock-form-container">
      {children}
    </div>
  ),
}));

vi.mock('@/components/form/Buttons', () => ({
  CardSubmitButton: ({ isFavorite }: { isFavorite: boolean }) => (
    <button data-testid="submit-button">{isFavorite ? 'Remove' : 'Add'}</button>
  ),
}));

// Mock action
vi.mock('@/utils/actions', () => ({
  toggleFavoriteAction: {
    bind: vi.fn().mockImplementation(() => vi.fn()),
  },
}));

describe('FavoriteToggleForm Component', () => {
  const mockProps = {
    propertyId: 'prop-123',
    favoriteId: null as string | null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePathname).mockReturnValue('/properties/123');
  });

  it('renders correctly when not favorite', () => {
    render(<FavoriteToggleForm {...mockProps} />);
    
    expect(screen.getByTestId('mock-form-container')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Add');
  });

  it('renders correctly when is favorite', () => {
    render(<FavoriteToggleForm {...mockProps} favoriteId="fav-456" />);
    
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Remove');
  });

  it('binds the action with correct parameters', () => {
    render(<FavoriteToggleForm {...mockProps} />);
    
    expect(actions.toggleFavoriteAction.bind).toHaveBeenCalledWith(null, {
      propertyId: mockProps.propertyId,
      favoriteId: mockProps.favoriteId,
      pathname: '/properties/123',
    });
  });
});

