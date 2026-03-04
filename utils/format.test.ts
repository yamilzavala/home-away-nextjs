import { describe, it, expect } from 'vitest';
import { formatCurrency, formatQuantity, formatDate } from './format';

describe('formatCurrency', () => {
  it('should format currency with $ symbol', () => {
    expect(formatCurrency(100)).toBe('$100');
  });

  it('should treat null as 0', () => {
    expect(formatCurrency(null)).toBe('$0');
  });

  it('should add thousands separator', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
  });
});

describe('formatQuantity', () => {
  it('should return singular form for 1', () => {
    expect(formatQuantity(1, 'guest')).toBe('1 guest');
  });

  it('should return plural form for 2', () => {
    expect(formatQuantity(2, 'guest')).toBe('2 guests');
  });

  it('should return plural form for 0', () => {
    expect(formatQuantity(0, 'guest')).toBe('0 guests');
  });
});

describe('formatDate', () => {
  it('should format date with month, day, and year', () => {
    const date = new Date('2024-03-04');
    const result = formatDate(date);
    expect(result).toContain('March');
    expect(result).toContain('4');
    expect(result).toContain('2024');
  });

  it('should omit day when onlyMonth flag is true', () => {
    const date = new Date('2024-03-15');
    const result = formatDate(date, true);
    expect(result).toContain('March');
    expect(result).toContain('2024');
    expect(result).not.toContain('15');
  });
});
