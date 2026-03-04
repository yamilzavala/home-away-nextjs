import { describe, it, expect } from 'vitest';
import { categories, CategoryLabel } from './categories';

describe('categories', () => {
  it('should have exactly 10 categories', () => {
    expect(categories).toHaveLength(10);
  });

  it('should have label and icon for each category', () => {
    categories.forEach((category) => {
      expect(category).toHaveProperty('label');
      expect(category).toHaveProperty('icon');
    });
  });

  it('should have all CategoryLabel values present exactly once', () => {
    const categoryLabels: CategoryLabel[] = [
      'cabin',
      'tent',
      'airstream',
      'cottage',
      'container',
      'caravan',
      'tiny',
      'magic',
      'warehouse',
      'lodge',
    ];

    const extractedLabels = categories.map((cat) => cat.label);

    categoryLabels.forEach((label) => {
      expect(extractedLabels).toContain(label);
      expect(extractedLabels.filter((l) => l === label)).toHaveLength(1);
    });
  });
});
