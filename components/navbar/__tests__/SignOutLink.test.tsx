import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignOutLink from '../SignOutLink';
import { useToast } from '../../ui/use-toast';

// Mock @clerk/nextjs
vi.mock('@clerk/nextjs', () => ({
  SignOutButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sign-out-button">{children}</div>
  ),
}));

// Mock useToast
vi.mock('../../ui/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('SignOutLink Component', () => {
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
    } as any);
  });

  it('renders correctly', () => {
    render(<SignOutLink />);
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  it('shows toast when logout button is clicked', async () => {
    const user = userEvent.setup();
    render(<SignOutLink />);
    const button = screen.getByText(/Logout/i);
    await user.click(button);

    expect(mockToast).toHaveBeenCalledWith({
      description: 'You have been signed out.',
    });
  });
});
