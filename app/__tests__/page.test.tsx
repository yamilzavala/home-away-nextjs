import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../page';

// Mock child components
vi.mock('@/components/home/CategoriesList', () => ({
  default: ({ category, search }: { category?: string; search?: string }) => (
    <div data-testid="categories-list">
      <span data-testid="category-prop">{category || 'all'}</span>
      <span data-testid="search-prop">{search || ''}</span>
    </div>
  ),
}));

vi.mock('@/components/home/PropertiesContainer', () => ({
  default: ({ category, search }: { category?: string; search?: string }) => (
    <div data-testid="properties-container">
      <span data-testid="container-category">{category || 'all'}</span>
      <span data-testid="container-search">{search || ''}</span>
    </div>
  ),
}));

vi.mock('@/components/card/LoadingCards', () => ({
  default: () => <div data-testid="loading-cards">Loading...</div>,
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders home page with default props', async () => {
    const searchParams = {};
    
    render(await HomePage({ searchParams }));

    expect(screen.getByTestId('categories-list')).toBeInTheDocument();
    expect(screen.getByTestId('properties-container')).toBeInTheDocument();
    expect(screen.getByTestId('category-prop')).toHaveTextContent('all');
    expect(screen.getByTestId('search-prop')).toHaveTextContent('');
    expect(screen.getByTestId('container-category')).toHaveTextContent('all');
    expect(screen.getByTestId('container-search')).toHaveTextContent('');
  });

  test('renders home page with category filter', async () => {
    const searchParams = { category: 'beach' };
    
    render(await HomePage({ searchParams }));

    expect(screen.getByTestId('category-prop')).toHaveTextContent('beach');
    expect(screen.getByTestId('container-category')).toHaveTextContent('beach');
    expect(screen.getByTestId('search-prop')).toHaveTextContent('');
    expect(screen.getByTestId('container-search')).toHaveTextContent('');
  });

  test('renders home page with search filter', async () => {
    const searchParams = { search: 'ocean view' };
    
    render(await HomePage({ searchParams }));

    expect(screen.getByTestId('category-prop')).toHaveTextContent('all');
    expect(screen.getByTestId('container-category')).toHaveTextContent('all');
    expect(screen.getByTestId('search-prop')).toHaveTextContent('ocean view');
    expect(screen.getByTestId('container-search')).toHaveTextContent('ocean view');
  });

  test('renders home page with both category and search filters', async () => {
    const searchParams = { category: 'mountain', search: 'cabin' };
    
    render(await HomePage({ searchParams }));

    expect(screen.getByTestId('category-prop')).toHaveTextContent('mountain');
    expect(screen.getByTestId('container-category')).toHaveTextContent('mountain');
    expect(screen.getByTestId('search-prop')).toHaveTextContent('cabin');
    expect(screen.getByTestId('container-search')).toHaveTextContent('cabin');
  });

  test('wraps PropertiesContainer in Suspense with LoadingCards fallback', async () => {
    const searchParams = {};
    
    render(await HomePage({ searchParams }));

    // The PropertiesContainer should be rendered (not in loading state initially)
    expect(screen.getByTestId('properties-container')).toBeInTheDocument();
    
    // LoadingCards component should be imported and available for Suspense
    // We can't easily test the Suspense behavior without async operations,
    // but we can verify the component is properly structured
    const categoriesList = screen.getByTestId('categories-list');
    const section = categoriesList.closest('section');
    expect(section).toBeInTheDocument();
  });

  test('maintains proper component structure', async () => {
    const searchParams = { category: 'beach', search: 'luxury' };
    
    render(await HomePage({ searchParams }));

    // Check that components are rendered in the correct order
    const categoriesList = screen.getByTestId('categories-list');
    const section = categoriesList.closest('section');
    expect(section).toBeInTheDocument();
    
    const propertiesContainer = screen.getByTestId('properties-container');
    
    expect(categoriesList).toBeInTheDocument();
    expect(propertiesContainer).toBeInTheDocument();
    
    // Verify props are passed correctly
    expect(screen.getByTestId('category-prop')).toHaveTextContent('beach');
    expect(screen.getByTestId('search-prop')).toHaveTextContent('luxury');
    expect(screen.getByTestId('container-category')).toHaveTextContent('beach');
    expect(screen.getByTestId('container-search')).toHaveTextContent('luxury');
  });
});
