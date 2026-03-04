import { describe, it, expect } from 'vitest';
import { formattedCountries, findCountryByCode } from './countries';

describe('formattedCountries', () => {
  it('should not be empty', () => {
    expect(formattedCountries.length).toBeGreaterThan(0);
  });

  it('should have required properties for each country', () => {
    formattedCountries.forEach((country) => {
      expect(country).toHaveProperty('code');
      expect(country).toHaveProperty('name');
      expect(country).toHaveProperty('flag');
      expect(country).toHaveProperty('location');
      expect(country).toHaveProperty('region');
    });
  });

  it('should have non-empty code, name and region for each country', () => {
    formattedCountries.forEach((country) => {
      expect(country.code).toBeTruthy();
      expect(country.name).toBeTruthy();
      expect(country.region).toBeTruthy();
    });
  });
});

describe('findCountryByCode', () => {
  it('should return country for known code', () => {
    const country = findCountryByCode('US');

    expect(country).toBeDefined();
    expect(country?.code).toBe('US');
  });

  it('should return undefined for unknown code', () => {
    const country = findCountryByCode('XX');

    expect(country).toBeUndefined();
  });
});
