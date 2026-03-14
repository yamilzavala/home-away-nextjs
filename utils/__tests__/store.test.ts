import { describe, it, expect } from 'vitest';
import { useProperty } from '../store';
import { act } from 'react-dom/test-utils';

describe('useProperty store', () => {
  it('should have initial state', () => {
    const state = useProperty.getState();
    expect(state.propertyId).toBe('');
    expect(state.price).toBe(0);
    expect(state.bookings).toEqual([]);
    expect(state.range).toBeUndefined();
  });

  it('should allow updating state', () => {
    act(() => {
      useProperty.setState({
        propertyId: '123',
        price: 100,
        bookings: [],
        range: { from: new Date(), to: new Date() },
      });
    });

    const state = useProperty.getState();
    expect(state.propertyId).toBe('123');
    expect(state.price).toBe(100);
    expect(state.range).toBeDefined();
  });
});
