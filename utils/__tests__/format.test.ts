import { describe, test, expect } from 'vitest';
import { formatCurrency, formatQuantity, formatDate } from '../format';

describe('formatCurrency', () => {
  test('formats positive numbers correctly', () => {
    expect(formatCurrency(100)).toBe('$100');
    expect(formatCurrency(150.99)).toBe('$151');
    expect(formatCurrency(1000)).toBe('$1,000');
  });

  test('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  test('handles null values', () => {
    expect(formatCurrency(null)).toBe('$0');
  });

  test('formats large numbers correctly', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000');
  });
});

describe('formatQuantity', () => {
  test('formats singular quantity correctly', () => {
    expect(formatQuantity(1, 'guest')).toBe('1 guest');
    expect(formatQuantity(1, 'bedroom')).toBe('1 bedroom');
  });

  test('formats plural quantity correctly', () => {
    expect(formatQuantity(2, 'guest')).toBe('2 guests');
    expect(formatQuantity(5, 'bedroom')).toBe('5 bedrooms');
    expect(formatQuantity(0, 'guest')).toBe('0 guests');
  });
});

describe('formatDate', () => {
  const testDate = new Date(2024, 5, 15);

  test('formats full date correctly', () => {
    expect(formatDate(testDate)).toBe('June 15, 2024');
  });

  test('formats month and year only', () => {
    expect(formatDate(testDate, true)).toBe('June 2024');
  });

  test('handles different dates', () => {
    const januaryDate = new Date(2024, 0, 1);
    expect(formatDate(januaryDate)).toBe('January 1, 2024');
    
    const decemberDate = new Date(2024, 11, 31);
    expect(formatDate(decemberDate)).toBe('December 31, 2024');
  });
});
