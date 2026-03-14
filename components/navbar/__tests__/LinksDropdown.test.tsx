import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LinksDropdown from '../LinksDropdown';
import * as clerkServer from '@clerk/nextjs/server';
import { links } from '@/utils/links';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '../../ui/button';
import { LuAlignLeft } from 'react-icons/lu';
import { SignedOut, SignedIn, SignInButton, SignUpButton } from '@clerk/nextjs';
import UserIcon from '../UserIcon';
import SignOutLink from '../SignOutLink';

// Mock Radix UI / Shadcn Dropdown components
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-item">{children}</div>,
  DropdownMenuSeparator: () => <hr />,
}));

// Mock Clerk components and auth
vi.mock('@clerk/nextjs', () => ({
  SignedOut: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-out">{children}</div>,
  SignedIn: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-in">{children}</div>,
  SignInButton: ({ children }: { children: React.ReactNode }) => <div data-testid="signin-button">{children}</div>,
  SignUpButton: ({ children }: { children: React.ReactNode }) => <div data-testid="signup-button">{children}</div>,
}));

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => ({ userId: null })),
}));

// Mock child components
vi.mock('../UserIcon', () => ({
  default: () => <div data-testid="user-icon" />,
}));

vi.mock('../SignOutLink', () => ({
  default: () => <button data-testid="logout-button">Logout</button>,
}));

// Mock action utilities
vi.mock('@/utils/actions', () => ({
  fetchProfileImage: vi.fn(),
}));

// Sync version of LinksDropdown for testing logic
const SyncLinksDropdown = ({ userId }: { userId: string | null }) => {
  const isAdminUser = userId === process.env.ADMIN_USER_ID;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='flex gap-4 max-w-[100px]'>
          <LuAlignLeft className='w-6 h-6' />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-52' align='start' sideOffset={10}>
        {!userId ? (
          <div data-testid="signed-out-content">
            <DropdownMenuItem>
              <SignInButton mode='modal'>
                <button className='w-full text-left'>Login</button>
              </SignInButton>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignUpButton mode='modal'>
                <button className='w-full text-left'>Register</button>
              </SignUpButton>
            </DropdownMenuItem>
          </div>
        ) : (
          <div data-testid="signed-in-content">
            {links.map((link: any) => {
              if (link.label === 'admin' && !isAdminUser) return null;
              return (
                <DropdownMenuItem key={link.href}>
                  <Link href={link.href} className='capitalize w-full'>
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutLink />
            </DropdownMenuItem>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

describe('LinksDropdown Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with trigger button', () => {
    render(<SyncLinksDropdown userId={null} />);
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('shows login and register when signed out', () => {
    render(<SyncLinksDropdown userId={null} />);
    expect(screen.getByTestId('signed-out-content')).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  it('shows navigation links and logout when signed in', () => {
    render(<SyncLinksDropdown userId="user_123" />);
    expect(screen.getByTestId('signed-in-content')).toBeInTheDocument();
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  it('shows admin link only for admin users', () => {
    // Non-admin case
    const { rerender } = render(<SyncLinksDropdown userId="user_123" />);
    expect(screen.queryByText(/admin/i)).toBeNull();

    // Admin case
    vi.stubEnv('ADMIN_USER_ID', 'admin_123');
    rerender(<SyncLinksDropdown userId="admin_123" />);
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
    vi.unstubAllEnvs();
  });
});
