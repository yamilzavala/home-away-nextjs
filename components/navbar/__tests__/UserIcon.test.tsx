import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserIcon from '../UserIcon';
import * as actions from '@/utils/actions';

vi.mock('@/utils/actions', () => ({
  fetchProfileImage: vi.fn(),
}));

vi.mock('react-icons/lu', () => ({
  LuUser: () => <svg data-testid="default-user-icon" />,
}));

describe('UserIcon Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the profile image if it exists', async () => {
    const mockImageUrl = 'https://example.com/profile.jpg';
    vi.mocked(actions.fetchProfileImage).mockResolvedValue(mockImageUrl);

    render(await UserIcon());

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockImageUrl);
    expect(img).toHaveClass('rounded-full');
  });

  it('renders the default user icon if profile image does not exist', async () => {
    vi.mocked(actions.fetchProfileImage).mockResolvedValue(null);

    render(await UserIcon());

    expect(screen.getByTestId('default-user-icon')).toBeInTheDocument();
  });
});
