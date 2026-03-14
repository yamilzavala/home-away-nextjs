import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';

// Mock child components
vi.mock('../Logo', () => ({
  default: () => <div data-testid="mock-logo">Logo</div>,
}));

vi.mock('../NavSearch', () => ({
  default: () => <div data-testid="mock-nav-search">NavSearch</div>,
}));

vi.mock('../DarkMode', () => ({
  default: () => <div data-testid="mock-dark-mode">DarkMode</div>,
}));

vi.mock('../LinksDropdown', () => ({
  default: () => <div data-testid="mock-links-dropdown">LinksDropdown</div>,
}));

describe('Navbar Component', () => {
  it('renders correctly with all sub-components', () => {
    render(<Navbar />);
    
    expect(screen.getByTestId('mock-logo')).toBeInTheDocument();
    expect(screen.getByTestId('mock-nav-search')).toBeInTheDocument();
    expect(screen.getByTestId('mock-dark-mode')).toBeInTheDocument();
    expect(screen.getByTestId('mock-links-dropdown')).toBeInTheDocument();
  });

  it('has the correct container classes', () => {
    const { container } = render(<Navbar />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('border-b');
    
    const wrapper = container.querySelector('.container');
    expect(wrapper).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'sm:justify-between');
  });
});
