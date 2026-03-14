import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModeToggle from '../DarkMode';
import { useTheme } from 'next-themes';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

// Mock Shadcn Dropdown components using absolute path alias
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <div data-testid="dropdown-item" onClick={onClick}>{children}</div>
  ),
}));

// Mock icons
vi.mock('react-icons/fi', () => ({
  FiSun: () => <svg data-testid="sun-icon" />,
}));
vi.mock('react-icons/pi', () => ({
  PiMoonStarsFill: () => <svg data-testid="moon-icon" />,
}));

describe('DarkMode (ModeToggle) Component', () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTheme).mockReturnValue({
      setTheme: mockSetTheme,
      theme: 'light',
    } as any);
  });

  it('renders the theme toggle button', () => {
    render(<ModeToggle />);
    expect(screen.getByText(/Toggle theme/i)).toBeInTheDocument();
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });

  it('calls setTheme with "light" when light option is clicked', async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);
    
    const lightItem = screen.getByText(/Light/i);
    await user.click(lightItem);
    
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('calls setTheme with "dark" when dark option is clicked', async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);
    
    const darkItem = screen.getByText(/Dark/i);
    await user.click(darkItem);
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('calls setTheme with "system" when system option is clicked', async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);
    
    const systemItem = screen.getByText(/System/i);
    await user.click(systemItem);
    
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });
});
