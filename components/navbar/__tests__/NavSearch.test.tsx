import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavSearch from '../NavSearch';
import { useSearchParams, useRouter } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}));

// Mock use-debounce
vi.mock('use-debounce', () => ({
  useDebouncedCallback: (callback: any) => callback,
}));

describe('NavSearch Component', () => {
  const mockReplace = vi.fn();
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      replace: mockReplace,
    } as any);
    vi.mocked(useSearchParams).mockReturnValue({
      get: mockGet,
    } as any);
  });

  it('renders correctly with initial search value from params', () => {
    mockGet.mockReturnValue('cabin');
    render(<NavSearch />);
    
    const input = screen.getByPlaceholderText(/find a property/i) as HTMLInputElement;
    expect(input.value).toBe('cabin');
  });

  it('updates input value on change', async () => {
    const user = userEvent.setup();
    mockGet.mockReturnValue('');
    render(<NavSearch />);
    
    const input = screen.getByPlaceholderText(/find a property/i) as HTMLInputElement;
    await user.type(input, 'beach');
    
    expect(input.value).toBe('beach');
  });

  it('calls router.replace with correct query when input changes', async () => {
    const user = userEvent.setup();
    mockGet.mockReturnValue('');
    render(<NavSearch />);
    
    const input = screen.getByPlaceholderText(/find a property/i);
    await user.type(input, 'mountain');
    
    expect(mockReplace).toHaveBeenCalled();
    expect(mockReplace.mock.calls[mockReplace.mock.calls.length - 1][0]).toContain('search=mountain');
  });

  it('clears search param when input is empty', async () => {
    const user = userEvent.setup();
    mockGet.mockReturnValue('previous');
    render(<NavSearch />);
    
    const input = screen.getByPlaceholderText(/find a property/i);
    await user.clear(input);
    
    expect(mockReplace).toHaveBeenCalled();
    expect(mockReplace.mock.calls[mockReplace.mock.calls.length - 1][0]).not.toContain('search=');
  });
});
