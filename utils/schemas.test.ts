import { describe, it, expect } from 'vitest';
import {
  validateWithZodSchema,
  profileSchema,
  propertySchema,
  createReviewSchema,
} from './schemas';

describe('validateWithZodSchema', () => {
  it('should return parsed object for valid data', () => {
    const data = { firstName: 'John', lastName: 'Doe', username: 'johndoe' };
    const result = validateWithZodSchema(profileSchema, data);

    expect(result).toEqual(data);
  });

  it('should throw Error with message for validation failure', () => {
    const data = { firstName: 'J', lastName: 'Doe', username: 'johndoe' };

    expect(() => validateWithZodSchema(profileSchema, data)).toThrow(
      'First Name must be at least 2 characters'
    );
  });

  it('should join multiple errors with comma separator', () => {
    const data = { firstName: 'J', lastName: 'D', username: 'j' };

    expect(() => validateWithZodSchema(profileSchema, data)).toThrow();
    const error = (() => {
      try {
        validateWithZodSchema(profileSchema, data);
      } catch (e) {
        return (e as Error).message;
      }
    })();
    expect(error).toContain(', ');
  });
});

describe('propertySchema', () => {
  it('should validate correct property data', () => {
    const data = {
      name: 'Beautiful House',
      tagline: 'A lovely place to stay',
      price: '100',
      category: 'cabin',
      description: 'This is a great property with ten words or more in the description',
      country: 'US',
      guests: '4',
      bedrooms: '2',
      beds: '3',
      baths: '1',
      amenities: '[]',
    };

    const result = validateWithZodSchema(propertySchema, data);
    expect(result.price).toBe(100);
  });

  it('should coerce string price to number', () => {
    const data = {
      name: 'House',
      tagline: 'Place',
      price: '50',
      category: 'cabin',
      description: 'This is a great property with ten words or more in the description',
      country: 'US',
      guests: '4',
      bedrooms: '2',
      beds: '3',
      baths: '1',
      amenities: '[]',
    };

    const result = validateWithZodSchema(propertySchema, data);
    expect(result.price).toBe(50);
    expect(typeof result.price).toBe('number');
  });

  it('should reject description with less than 10 words', () => {
    const data = {
      name: 'House',
      tagline: 'Place',
      price: '50',
      category: 'cabin',
      description: 'Only nine words in this short description here',
      country: 'US',
      guests: '4',
      bedrooms: '2',
      beds: '3',
      baths: '1',
      amenities: '[]',
    };

    expect(() => validateWithZodSchema(propertySchema, data)).toThrow();
  });

  it('should accept description with exactly 10 words', () => {
    const data = {
      name: 'House',
      tagline: 'Place',
      price: '50',
      category: 'cabin',
      description: 'This is a great property with ten words or more in the description',
      country: 'US',
      guests: '4',
      bedrooms: '2',
      beds: '3',
      baths: '1',
      amenities: '[]',
    };

    const result = validateWithZodSchema(propertySchema, data);
    expect(result).toBeDefined();
  });

  it('should accept description with 1000 words', () => {
    const words = Array(1000).fill('word').join(' ');
    const data = {
      name: 'House',
      tagline: 'Place',
      price: '50',
      category: 'cabin',
      description: words,
      country: 'US',
      guests: '4',
      bedrooms: '2',
      beds: '3',
      baths: '1',
      amenities: '[]',
    };

    const result = validateWithZodSchema(propertySchema, data);
    expect(result).toBeDefined();
  });

  it('should reject description with 1001 words', () => {
    const words = Array(1001).fill('word').join(' ');
    const data = {
      name: 'House',
      tagline: 'Place',
      price: '50',
      category: 'cabin',
      description: words,
      country: 'US',
      guests: '4',
      bedrooms: '2',
      beds: '3',
      baths: '1',
      amenities: '[]',
    };

    expect(() => validateWithZodSchema(propertySchema, data)).toThrow();
  });
});

describe('createReviewSchema', () => {
  it('should reject rating below 1', () => {
    const data = {
      propertyId: '1',
      rating: '0',
      comment: 'This is a comment with at least ten characters',
    };

    expect(() => validateWithZodSchema(createReviewSchema, data)).toThrow();
  });

  it('should accept rating of 1', () => {
    const data = {
      propertyId: '1',
      rating: '1',
      comment: 'This is a comment with at least ten characters',
    };

    const result = validateWithZodSchema(createReviewSchema, data);
    expect(result.rating).toBe(1);
  });

  it('should accept rating of 5', () => {
    const data = {
      propertyId: '1',
      rating: '5',
      comment: 'This is a comment with at least ten characters',
    };

    const result = validateWithZodSchema(createReviewSchema, data);
    expect(result.rating).toBe(5);
  });

  it('should reject rating above 5', () => {
    const data = {
      propertyId: '1',
      rating: '6',
      comment: 'This is a comment with at least ten characters',
    };

    expect(() => validateWithZodSchema(createReviewSchema, data)).toThrow();
  });

  it('should reject comment less than 10 characters', () => {
    const data = {
      propertyId: '1',
      rating: '5',
      comment: 'Short',
    };

    expect(() => validateWithZodSchema(createReviewSchema, data)).toThrow();
  });

  it('should reject comment more than 150 characters', () => {
    const data = {
      propertyId: '1',
      rating: '5',
      comment: 'a'.repeat(151),
    };

    expect(() => validateWithZodSchema(createReviewSchema, data)).toThrow();
  });
});
