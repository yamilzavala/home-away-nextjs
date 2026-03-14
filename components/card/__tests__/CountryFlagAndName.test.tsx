import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CountryFlagAndName from '../CountryFlagAndName';
import { findCountryByCode } from '@/utils/countries';

vi.mock('@/utils/countries', () => ({
  findCountryByCode: vi.fn(),
}));

describe('CountryFlagAndName Component', () => {
  it('renders country flag and name correctly', () => {
    vi.mocked(findCountryByCode).mockReturnValue({
      name: 'Argentina',
      flag: '🇦🇷',
      code: 'AR',
    } as any);

    render(<CountryFlagAndName countryCode="AR" />);

    expect(screen.getByText(/🇦🇷/)).toBeInTheDocument();
    expect(screen.getByText(/Argentina/)).toBeInTheDocument();
  });

  it('truncates long country names', () => {
    vi.mocked(findCountryByCode).mockReturnValue({
      name: 'Very Long Country Name That Exceeds Twenty Characters',
      flag: '🏳️',
      code: 'LC',
    } as any);

    render(<CountryFlagAndName countryCode="LC" />);

    const truncatedName = 'Very Long Country Na...';
    expect(screen.getByText(new RegExp(truncatedName))).toBeInTheDocument();
  });
});
