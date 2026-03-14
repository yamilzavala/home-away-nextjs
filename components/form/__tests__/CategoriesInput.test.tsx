import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CategoriesInput from '../CategoriesInput';
import { categories } from '@/utils/categories';

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

describe('CategoriesInput Component', () => {
  it('renders correctly with default values', () => {
    render(<CategoriesInput />);
    
    expect(screen.getByLabelText(/Categories/i)).toBeInTheDocument();
    const select = screen.getByTestId('mock-select');
    expect(select).toHaveAttribute('data-name', 'category');
    expect(select).toHaveAttribute('data-value', categories[0].label);
  });

  it('renders correctly with provided defaultValue', () => {
    const customValue = categories[1].label;
    render(<CategoriesInput defaultValue={customValue} />);
    
    const select = screen.getByTestId('mock-select');
    expect(select).toHaveAttribute('data-value', customValue);
  });

  it('renders all category items', () => {
    render(<CategoriesInput />);
    const items = screen.getAllByTestId('select-item');
    expect(items).toHaveLength(categories.length);
    
    categories.forEach((cat, index) => {
      expect(items[index]).toHaveAttribute('data-value', cat.label);
      expect(items[index]).toHaveTextContent(cat.label);
    });
  });
});
