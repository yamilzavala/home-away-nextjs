import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShareButton from '../ShareButton';

// Mock Radix Popover
vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div data-testid="popover-content">{children}</div>,
}));

// Mock react-share
vi.mock('react-share', () => ({
  TwitterShareButton: ({ children, url }: any) => <div data-testid="twitter-share" data-url={url}>{children}</div>,
  EmailShareButton: ({ children, url }: any) => <div data-testid="email-share" data-url={url}>{children}</div>,
  LinkedinShareButton: ({ children, url }: any) => <div data-testid="linkedin-share" data-url={url}>{children}</div>,
  TwitterIcon: () => <svg data-testid="twitter-icon" />,
  EmailIcon: () => <svg data-testid="email-icon" />,
  LinkedinIcon: () => <svg data-testid="linkedin-icon" />,
}));

describe('ShareButton Component', () => {
  const mockProps = {
    propertyId: '123',
    name: 'Test Villa',
  };

  it('renders the share trigger icon', () => {
    render(<ShareButton {...mockProps} />);
    // LuShare2 is rendered inside the trigger
    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
  });

  it('renders share buttons with correct URLs', () => {
    vi.stubEnv('NEXT_PUBLIC_WEBSITE_URL', 'http://localhost:3000');
    render(<ShareButton {...mockProps} />);
    
    const expectedUrl = 'http://localhost:3000/properties/123';
    
    expect(screen.getByTestId('twitter-share')).toHaveAttribute('data-url', expectedUrl);
    expect(screen.getByTestId('linkedin-share')).toHaveAttribute('data-url', expectedUrl);
    expect(screen.getByTestId('email-share')).toHaveAttribute('data-url', expectedUrl);
    
    vi.unstubAllEnvs();
  });

  it('renders all social icons', () => {
    render(<ShareButton {...mockProps} />);
    expect(screen.getByTestId('twitter-icon')).toBeInTheDocument();
    expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();
    expect(screen.getByTestId('email-icon')).toBeInTheDocument();
  });
});
