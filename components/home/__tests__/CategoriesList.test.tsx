import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CategoriesList from '../CategoriesList';
import { categories } from '@/utils/categories';

// Mock ScrollArea components
vi.mock('../ui/scroll-area', () => ({
  ScrollArea: ({ children, className }: any) => <div className={className} data-testid="scroll-area">{children}</div>,
  ScrollBar: ({ orientation }: any) => <div data-testid="scroll-bar" data-orientation={orientation} />,
}));

// Mock icons to avoid SVG issues
vi.mock('react-icons/fa', () => ({
  FaWarehouse: () => <svg data-testid="icon-warehouse" />,
  FaTent: () => <svg data-testid="icon-tent" />,
}));

describe('CategoriesList Component', () => {
  it('renders all categories', () => {
    render(<CategoriesList />);
    
    categories.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('highlights the active category', () => {
    const activeCategory = categories[0].label;
    render(<CategoriesList category={activeCategory} />);
    
    const activeLink = screen.getByText(activeCategory).closest('article');
    expect(activeLink).toHaveClass('text-primary');
    
    const inactiveCategory = categories[1].label;
    const inactiveLink = screen.getByText(inactiveCategory).closest('article');
    expect(inactiveLink).not.toHaveClass('text-primary');
  });

  it('generates correct hrefs with search term', () => {
    const search = 'cabin';
    render(<CategoriesList search={search} />);
    
    const category = categories[0].label;
    const link = screen.getByRole('link', { name: new RegExp(category, 'i') });
    expect(link).toHaveAttribute('href', `/?category=${category}&search=${search}`);
  });

  it('generates correct hrefs without search term', () => {
    render(<CategoriesList />);
    
    const category = categories[0].label;
    const link = screen.getByRole('link', { name: new RegExp(category, 'i') });
    expect(link).toHaveAttribute('href', `/?category=${category}`);
  });
});
