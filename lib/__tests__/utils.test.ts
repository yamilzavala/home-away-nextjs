import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility', () => {
  it('should merge classes correctly', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
  });

  it('should handle conditional classes', () => {
    expect(cn('btn', true && 'btn-active', false && 'btn-disabled')).toBe('btn btn-active');
  });

  it('should merge tailwind classes using twMerge', () => {
    // twMerge should resolve 'px-2 px-4' to 'px-4'
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('should handle undefined and null inputs', () => {
    expect(cn('btn', undefined, null, 'primary')).toBe('btn primary');
  });

  it('should handle arrays of classes', () => {
    expect(cn(['btn', 'btn-primary'], 'custom')).toBe('btn btn-primary custom');
  });
});
