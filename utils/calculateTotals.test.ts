import { describe, it, expect } from 'vitest';
import { calculateTotals } from './calculateTotals';

describe('calculateTotals', () => {
  it('should calculate totals correctly for 3 nights at $100', () => {
    const checkIn = new Date('2024-03-04');
    const checkOut = new Date('2024-03-07');
    const price = 100;

    const result = calculateTotals({ checkIn, checkOut, price });

    expect(result.totalNights).toBe(3);
    expect(result.subTotal).toBe(300);
    expect(result.cleaning).toBe(21);
    expect(result.service).toBe(40);
    expect(result.tax).toBe(30); // 300 * 0.1
    expect(result.orderTotal).toBe(391); // 300 + 21 + 40 + 30
  });

  it('should always include cleaning fee of 21', () => {
    const checkIn = new Date('2024-03-04');
    const checkOut = new Date('2024-03-05');
    const price = 50;

    const result = calculateTotals({ checkIn, checkOut, price });

    expect(result.cleaning).toBe(21);
  });

  it('should always include service fee of 40', () => {
    const checkIn = new Date('2024-03-04');
    const checkOut = new Date('2024-03-05');
    const price = 50;

    const result = calculateTotals({ checkIn, checkOut, price });

    expect(result.service).toBe(40);
  });

  it('should calculate tax as 10% of subtotal', () => {
    const checkIn = new Date('2024-03-04');
    const checkOut = new Date('2024-03-09');
    const price = 200;

    const result = calculateTotals({ checkIn, checkOut, price });

    expect(result.tax).toBe(100); // 1000 * 0.1
  });

  it('should handle 0 nights edge case', () => {
    const checkIn = new Date('2024-03-04');
    const checkOut = new Date('2024-03-04');
    const price = 100;

    const result = calculateTotals({ checkIn, checkOut, price });

    expect(result.totalNights).toBe(0);
    expect(result.subTotal).toBe(0);
    expect(result.tax).toBe(0);
    expect(result.cleaning).toBe(21);
    expect(result.service).toBe(40);
    expect(result.orderTotal).toBe(61);
  });
});
