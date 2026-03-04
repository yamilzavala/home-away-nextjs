import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  calculateDaysBetween,
  generateDateRange,
  generateBlockedPeriods,
  generateDisabledDates,
} from './calendar';

describe('calculateDaysBetween', () => {
  it('should calculate days between two dates', () => {
    const from = new Date('2024-01-01');
    const to = new Date('2024-01-04');

    const result = calculateDaysBetween({ checkIn: from, checkOut: to });

    expect(result).toBe(3);
  });

  it('should handle reversed dates using Math.abs', () => {
    const from = new Date('2024-01-04');
    const to = new Date('2024-01-01');

    const result = calculateDaysBetween({ checkIn: from, checkOut: to });

    expect(result).toBe(3);
  });

  it('should return 0 for the same day', () => {
    const date = new Date('2024-01-01');

    const result = calculateDaysBetween({ checkIn: date, checkOut: date });

    expect(result).toBe(0);
  });
});

describe('generateDateRange', () => {
  it('should return empty array when range is undefined', () => {
    const result = generateDateRange(undefined);

    expect(result).toEqual([]);
  });

  it('should return empty array when from is missing', () => {
    const result = generateDateRange({ from: undefined, to: new Date() });

    expect(result).toEqual([]);
  });

  it('should return empty array when to is missing', () => {
    const result = generateDateRange({ from: new Date(), to: undefined });

    expect(result).toEqual([]);
  });

  it('should generate 3-day range as ISO strings', () => {
    const from = new Date('2024-03-04');
    const to = new Date('2024-03-06');

    const result = generateDateRange({ from, to });

    expect(result).toEqual(['2024-03-04', '2024-03-05', '2024-03-06']);
  });
});

describe('generateBlockedPeriods', () => {
  it('should return bookings and past date range', () => {
    const today = new Date('2024-03-10');
    const bookings = [
      { checkIn: new Date('2024-03-15'), checkOut: new Date('2024-03-20') },
    ];

    const result = generateBlockedPeriods({ bookings, today });

    expect(result).toHaveLength(2);
    expect(result[0].from).toEqual(bookings[0].checkIn);
    expect(result[0].to).toEqual(bookings[0].checkOut);
    expect(result[1].from).toEqual(new Date(0));
  });
});

describe('generateDisabledDates', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-10'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return empty object for empty input', () => {
    const result = generateDisabledDates([]);

    expect(result).toEqual({});
  });

  it('should include future dates in range', () => {
    const range = {
      from: new Date('2024-03-15'),
      to: new Date('2024-03-17'),
    };

    const result = generateDisabledDates([range]);

    expect(result['2024-03-15']).toBe(true);
    expect(result['2024-03-16']).toBe(true);
    expect(result['2024-03-17']).toBe(true);
  });

  it('should exclude past dates in range', () => {
    const range = {
      from: new Date('2024-03-05'),
      to: new Date('2024-03-12'),
    };

    const result = generateDisabledDates([range]);

    expect(result['2024-03-05']).toBeUndefined();
    expect(result['2024-03-09']).toBeUndefined();
    expect(result['2024-03-10']).toBe(true);
    expect(result['2024-03-11']).toBe(true);
    expect(result['2024-03-12']).toBe(true);
  });
});
