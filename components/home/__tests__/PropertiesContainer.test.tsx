import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PropertiesContainer from '../PropertiesContainer';
import * as actions from '@/utils/actions';

// Mock dependencies with absolute paths
vi.mock('@/utils/actions', () => ({
  fetchProperties: vi.fn(),
}));

vi.mock('../PropertiesList', () => ({
  default: ({ properties }: any) => (
    <div data-testid="mock-properties-list">
      {properties.map((p: any) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  ),
}));

vi.mock('../EmptyList', () => ({
  default: ({ heading, message, btnText }: any) => (
    <div data-testid="mock-empty-list">
      <h2>{heading}</h2>
      <p>{message}</p>
      <button>{btnText}</button>
    </div>
  ),
}));

describe('PropertiesContainer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders PropertiesList when properties are found', async () => {
    const mockProperties = [
      { id: '1', name: 'Property 1' },
      { id: '2', name: 'Property 2' },
    ];
    vi.mocked(actions.fetchProperties).mockResolvedValue(mockProperties as any);

    const Result = await PropertiesContainer({ category: 'beach' });
    render(Result);

    expect(screen.getByTestId('mock-properties-list')).toBeInTheDocument();
    expect(screen.getByText('Property 1')).toBeInTheDocument();
    expect(screen.getByText('Property 2')).toBeInTheDocument();
    expect(actions.fetchProperties).toHaveBeenCalledWith({ category: 'beach', search: undefined });
  });

  it('renders EmptyList when no properties are found', async () => {
    vi.mocked(actions.fetchProperties).mockResolvedValue([]);

    const Result = await PropertiesContainer({ search: 'mountain' });
    render(Result);

    expect(screen.getByTestId('mock-empty-list')).toBeInTheDocument();
    expect(screen.getByText(/No results/i)).toBeInTheDocument();
    expect(screen.getByText(/Try changing or removing some of your filters/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear Filters/i })).toBeInTheDocument();
    expect(actions.fetchProperties).toHaveBeenCalledWith({ category: undefined, search: 'mountain' });
  });
});
