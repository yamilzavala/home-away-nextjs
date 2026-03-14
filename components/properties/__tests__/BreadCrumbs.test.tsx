import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BreadCrumbs from '../BreadCrumbs';

// Mock the breadcrumb components to simplify testing
vi.mock('@/components/ui/breadcrumb', () => ({
  Breadcrumb: ({ children }: { children: React.ReactNode }) => <nav aria-label="breadcrumb">{children}</nav>,
  BreadcrumbList: ({ children }: { children: React.ReactNode }) => <ol>{children}</ol>,
  BreadcrumbItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  BreadcrumbLink: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
  BreadcrumbSeparator: () => <span>/</span>,
  BreadcrumbPage: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

describe('BreadCrumbs Component', () => {
  it('renders correctly with the property name', () => {
    const propertyName = 'Beautiful Beach House';
    render(<BreadCrumbs name={propertyName} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
    expect(screen.getByText(propertyName)).toBeInTheDocument();
  });

  it('contains the home link and the property name in order', () => {
    const propertyName = 'Mountain Cabin';
    const { container } = render(<BreadCrumbs name={propertyName} />);
    
    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Home');
    expect(items[1]).toHaveTextContent(propertyName);
  });
});
