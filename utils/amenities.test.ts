import { describe, it, expect } from 'vitest';
import { amenities, conservativeAmenities } from './amenities';

describe('amenities', () => {
  it('should have exactly 20 amenities', () => {
    expect(amenities).toHaveLength(20);
  });

  it('should have all amenities starting with selected: false', () => {
    amenities.forEach((amenity) => {
      expect(amenity.selected).toBe(false);
    });
  });

  it('should have required properties for each amenity', () => {
    amenities.forEach((amenity) => {
      expect(amenity).toHaveProperty('name');
      expect(amenity).toHaveProperty('icon');
      expect(amenity).toHaveProperty('selected');
    });
  });

  it('should have non-empty name for each amenity', () => {
    amenities.forEach((amenity) => {
      expect(amenity.name).toBeTruthy();
      expect(amenity.name.length).toBeGreaterThan(0);
    });
  });
});

describe('conservativeAmenities', () => {
  it('should have exactly 20 amenities', () => {
    expect(conservativeAmenities).toHaveLength(20);
  });

  it('should have all amenities starting with selected: false', () => {
    conservativeAmenities.forEach((amenity) => {
      expect(amenity.selected).toBe(false);
    });
  });

  it('should have non-empty name for each amenity', () => {
    conservativeAmenities.forEach((amenity) => {
      expect(amenity.name).toBeTruthy();
      expect(amenity.name.length).toBeGreaterThan(0);
    });
  });
});
