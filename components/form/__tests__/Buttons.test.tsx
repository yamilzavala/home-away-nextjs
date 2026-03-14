import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubmitButton, IconButton, CardSignInButton, CardSubmitButton } from '../Buttons';
import { useFormStatus } from 'react-dom';

vi.mock('react-dom', () => ({
  useFormStatus: vi.fn(),
}));

vi.mock('@clerk/nextjs', () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => <div data-testid="signin-button">{children}</div>,
}));

vi.mock('@radix-ui/react-icons', () => ({
  ReloadIcon: ({ className }: { className: string }) => <svg data-testid="reload-icon" className={className} />,
}));

vi.mock('react-icons/fa', () => ({
  FaRegHeart: () => <svg data-testid="heart-reg-icon" />,
  FaHeart: () => <svg data-testid="heart-filled-icon" />,
}));

vi.mock('react-icons/lu', () => ({
  LuPen: () => <svg data-testid="pen-icon" />,
  LuTrash2: () => <svg data-testid="trash-icon" />,
}));

describe('Buttons Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SubmitButton', () => {
    it('renders with default text when not pending', () => {
      vi.mocked(useFormStatus).mockReturnValue({ pending: false } as any);
      render(<SubmitButton />);
      expect(screen.getByText('submit')).toBeInTheDocument();
    });

    it('renders with custom text when provided', () => {
      vi.mocked(useFormStatus).mockReturnValue({ pending: false } as any);
      render(<SubmitButton text="save" />);
      expect(screen.getByText('save')).toBeInTheDocument();
    });

    it('renders loading state when pending', () => {
      vi.mocked(useFormStatus).mockReturnValue({ pending: true } as any);
      render(<SubmitButton />);
      expect(screen.getByText(/please wait/i)).toBeInTheDocument();
      expect(screen.getByTestId('reload-icon')).toBeInTheDocument();
    });
  });

  describe('IconButton', () => {
    it('renders edit icon correctly', () => {
      vi.mocked(useFormStatus).mockReturnValue({ pending: false } as any);
      render(<IconButton actionType="edit" />);
      expect(screen.getByTestId('pen-icon')).toBeInTheDocument();
    });

    it('renders delete icon correctly', () => {
      vi.mocked(useFormStatus).mockReturnValue({ pending: false } as any);
      render(<IconButton actionType="delete" />);
      expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
    });

    it('renders loading state when pending', () => {
      vi.mocked(useFormStatus).mockReturnValue({ pending: true } as any);
      render(<IconButton actionType="edit" />);
      expect(screen.getByTestId('reload-icon')).toBeInTheDocument();
    });
  });

  describe('CardSignInButton', () => {
    it('renders correctly wrapped in SignInButton', () => {
      render(<CardSignInButton />);
      expect(screen.getByTestId('signin-button')).toBeInTheDocument();
      expect(screen.getByTestId('heart-reg-icon')).toBeInTheDocument();
    });
  });

  describe('CardSubmitButton', () => {
    it('renders regular heart when not favorite and not pending', () => {
      vi.mocked(useFormStatus).mockReturnValue({ pending: false } as any);
      render(<CardSubmitButton isFavorite={false} />);
      expect(screen.getByTestId('heart-reg-icon')).toBeInTheDocument();
    });

    it('renders filled heart when is favorite and not pending', () => {
      vi.mocked(useFormStatus).mockReturnValue({ pending: false } as any);
      render(<CardSubmitButton isFavorite={true} />);
      expect(screen.getByTestId('heart-filled-icon')).toBeInTheDocument();
    });

    it('renders loading state when pending', () => {
      vi.mocked(useFormStatus).mockReturnValue({ pending: true } as any);
      render(<CardSubmitButton isFavorite={false} />);
      expect(screen.getByTestId('reload-icon')).toBeInTheDocument();
    });
  });
});
