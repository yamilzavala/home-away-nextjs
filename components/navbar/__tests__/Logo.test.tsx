import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Logo from '../Logo';

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock react-icons
vi.mock('react-icons/lu', () => ({
  LuTent: () => <svg data-testid="logo-icon" />,
}));

describe('Logo Component', () => {
  it('renders a link to the home page', () => {
    render(<Logo />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the logo icon', () => {
    render(<Logo />);
    expect(screen.getByTestId('logo-icon')).toBeInTheDocument();
  });
});
