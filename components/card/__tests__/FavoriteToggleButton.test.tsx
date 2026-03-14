import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import FavoriteToggleButton from '../FavoriteToggleButton';
import * as clerkServer from '@clerk/nextjs/server';
import * as actions from '@/utils/actions';

// Mock dependencies
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

vi.mock('@clerk/nextjs', () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => <div data-testid="signin-button">{children}</div>,
}));

vi.mock('@/utils/actions', () => ({
  fetchFavoriteId: vi.fn(),
  toggleFavoriteAction: vi.fn(),
}));

// Mock child components to avoid unmocked hook issues (like useFormState in FormContainer)
vi.mock('../form/Buttons', () => ({
  CardSignInButton: () => <button data-testid="signin-button">Sign In</button>,
  CardSubmitButton: ({ isFavorite }: { isFavorite: boolean }) => (
    <button data-testid="submit-button">{isFavorite ? 'Remove' : 'Add'}</button>
  ),
}));

vi.mock('../FavoriteToggleForm', () => ({
  default: ({ favoriteId, propertyId }: any) => (
    <div data-testid="favorite-form">
      Form: {propertyId} - {favoriteId}
    </div>
  ),
}));

describe('FavoriteToggleButton Component', () => {
  const propertyId = 'prop-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders CardSignInButton when user is not authenticated', async () => {
    vi.mocked(clerkServer.auth).mockReturnValue({ userId: null } as any);

    const component = await FavoriteToggleButton({ propertyId });
    render(component);

    expect(screen.getByTestId('signin-button')).toBeInTheDocument();
  });

  it('renders FavoriteToggleForm when user is authenticated', async () => {
    vi.mocked(clerkServer.auth).mockReturnValue({ userId: 'user_123' } as any);
    vi.mocked(actions.fetchFavoriteId).mockResolvedValue('fav-456');

    const component = await FavoriteToggleButton({ propertyId });
    render(component);

    expect(screen.getByTestId('favorite-form')).toBeInTheDocument();
    expect(screen.getByText(/fav-456/)).toBeInTheDocument();
  });
});
