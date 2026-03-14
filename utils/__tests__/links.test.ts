import { describe, it, expect } from 'vitest';
import { links } from '../links';

describe('links', () => {
  it('should be an array', () => {
    expect(Array.isArray(links)).toBe(true);
  });

  it('should have the correct structure for each link', () => {
    links.forEach((link) => {
      expect(link).toHaveProperty('href');
      expect(link).toHaveProperty('label');
      expect(typeof link.href).toBe('string');
      expect(typeof link.label).toBe('string');
    });
  });

  it('should contain the expected home link', () => {
    const homeLink = links.find((link) => link.label === 'home');
    expect(homeLink).toBeDefined();
    expect(homeLink?.href).toBe('/');
  });

  it('should contain the expected admin link', () => {
    const adminLink = links.find((link) => link.label === 'admin');
    expect(adminLink).toBeDefined();
    expect(adminLink?.href).toBe('/admin');
  });

  it('should have labels in lowercase', () => {
    links.forEach((link) => {
      expect(link.label).toBe(link.label.toLowerCase());
    });
  });
});
