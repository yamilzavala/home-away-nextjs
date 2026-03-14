import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AmenitiesInput from '../AmenitiesInput';

describe('AmenitiesInput', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should render 20 amenity checkboxes by default', () => {
    render(<AmenitiesInput />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(20);
  });

  it('should have all checkboxes unchecked initially', () => {
    render(<AmenitiesInput />);
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it('should mark checkbox as checked when clicking it', async () => {
    render(<AmenitiesInput />);
    const firstCheckbox = screen.getByLabelText(/unlimited cloud storage/i);
    await user.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();
  });

  it('should mark checkbox as unchecked when clicking it again', async () => {
    render(<AmenitiesInput />);
    const checkbox = screen.getByLabelText(/unlimited cloud storage/i);
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('should not affect other amenities when toggling one', async () => {
    render(<AmenitiesInput />);
    const firstCheckbox = screen.getByLabelText(/unlimited cloud storage/i);
    const secondCheckbox = screen.getByLabelText(/VIP parking for squirrels/i);

    await user.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();
    expect(secondCheckbox).not.toBeChecked();
  });

  it('should have hidden input with valid JSON', () => {
    render(<AmenitiesInput />);
    const hiddenInput = document.querySelector('input[name="amenities"]') as HTMLInputElement;
    expect(hiddenInput).toBeInTheDocument();
    const value = JSON.parse(hiddenInput.value);
    expect(Array.isArray(value)).toBe(true);
    expect(value).toHaveLength(20);
  });

  it('should reflect toggled amenity in hidden input JSON', async () => {
    render(<AmenitiesInput />);
    const checkbox = screen.getByLabelText(/unlimited cloud storage/i);
    const hiddenInput = document.querySelector('input[name="amenities"]') as HTMLInputElement;

    await user.click(checkbox);

    const value = JSON.parse(hiddenInput.value);
    const toggledAmenity = value.find((a: any) => a.name === 'unlimited cloud storage');
    expect(toggledAmenity.selected).toBe(true);
  });
});
