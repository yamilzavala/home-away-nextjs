import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyList from './EmptyList';

describe('EmptyList', () => {
  it('should render default heading', () => {
    render(<EmptyList />);
    expect(screen.getByRole('heading')).toHaveTextContent(
      'No items in the list.'
    );
  });

  it('should render default message', () => {
    render(<EmptyList />);
    expect(screen.getByText('Keep exploring our properties.')).toBeInTheDocument();
  });

  it('should render default button text', () => {
    render(<EmptyList />);
    expect(screen.getByRole('link', { name: /back home/i })).toBeInTheDocument();
  });

  it('should render custom heading when passed', () => {
    render(<EmptyList heading="Custom heading" />);
    expect(screen.getByRole('heading')).toHaveTextContent('Custom heading');
  });

  it('should render custom message when passed', () => {
    render(<EmptyList message="Custom message" />);
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('should render custom button text when passed', () => {
    render(<EmptyList btnText="Custom button" />);
    expect(screen.getByRole('link', { name: /custom button/i })).toBeInTheDocument();
  });
});
