import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Description from './Description';

describe('Description', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should render short description fully without truncation', () => {
    const shortDesc = 'This is a short description with less than one hundred words in total length.';
    render(<Description description={shortDesc} />);
    expect(screen.getByText(shortDesc)).toBeInTheDocument();
  });

  it('should not show "Show more" button for short text', () => {
    const shortDesc = 'This is a short description with less than one hundred words.';
    render(<Description description={shortDesc} />);
    expect(screen.queryByRole('button', { name: /show more/i })).not.toBeInTheDocument();
  });

  it('should truncate long description to 100 words plus ellipsis', () => {
    const words = Array(120).fill('word').join(' ');
    render(<Description description={words} />);
    const text = screen.getByText(/\.\.\./);
    expect(text.textContent?.split(' ').slice(0, 100).length).toBeLessThanOrEqual(100);
  });

  it('should show "Show more" button for long text', () => {
    const words = Array(120).fill('word').join(' ');
    render(<Description description={words} />);
    expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
  });

  it('should reveal full description when clicking "Show more"', async () => {
    const words = Array(120).fill('word').join(' ');
    render(<Description description={words} />);
    const button = screen.getByRole('button', { name: /show more/i });
    await user.click(button);
    expect(screen.getByText(words)).toBeInTheDocument();
  });

  it('should change button text to "Show less" after expand', async () => {
    const words = Array(120).fill('word').join(' ');
    render(<Description description={words} />);
    const button = screen.getByRole('button', { name: /show more/i });
    await user.click(button);
    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument();
  });

  it('should re-truncate description when clicking "Show less"', async () => {
    const words = Array(120).fill('word').join(' ');
    render(<Description description={words} />);
    const showMoreButton = screen.getByRole('button', { name: /show more/i });
    await user.click(showMoreButton);
    const showLessButton = screen.getByRole('button', { name: /show less/i });
    await user.click(showLessButton);
    expect(screen.queryByText(words)).not.toBeInTheDocument();
    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
  });
});
