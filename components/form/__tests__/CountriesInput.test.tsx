import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CountriesInput from '../CountriesInput';
import { formattedCountries } from '@/utils/countries';

// Mock Radix UI / Shadcn Select components
vi.mock('@/components/ui/select', () => ({
  Select: ({ children, defaultValue, name }: any) => (
    <div data-testid="mock-select" data-name={name} data-value={defaultValue}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children, id }: any) => (
    <button data-testid="select-trigger" id={id}>
      {children}
    </button>
  ),
  SelectValue: () => <div data-testid="select-value" />,
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>
      {children}
    </div>
  ),
}));

describe('CountriesInput Component', () => {
  it('renders correctly with default values', () => {
    render(<CountriesInput />);
    
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    const select = screen.getByTestId('mock-select');
    expect(select).toHaveAttribute('data-name', 'country');
    expect(select).toHaveAttribute('data-value', formattedCountries[0].code);
  });

  it('renders correctly with provided defaultValue', () => {
    const customValue = formattedCountries[1].code;
    render(<CountriesInput defaultValue={customValue} />);
    
    const select = screen.getByTestId('mock-select');
    expect(select).toHaveAttribute('data-value', customValue);
  });

  it('renders all country items', () => {
    render(<CountriesInput />);
    const items = screen.getAllByTestId('select-item');
    expect(items).toHaveLength(formattedCountries.length);
    
    formattedCountries.forEach((country, index) => {
      expect(items[index]).toHaveAttribute('data-value', country.code);
      // Use string containment because of special characters like parentheses in names
      expect(items[index].textContent).toContain(country.name);
    });
  });
});
