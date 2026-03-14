import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Comment from '../Comment';

describe('Comment Component', () => {
  const shortComment = 'Short comment';
  const longComment = 'a'.repeat(131);

  it('renders a short comment completely', () => {
    render(<Comment comment={shortComment} />);
    expect(screen.getByText(shortComment)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('truncates a long comment initially', () => {
    render(<Comment comment={longComment} />);
    const expectedTruncated = `${longComment.slice(0, 130)}...`;
    expect(screen.getByText(expectedTruncated)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
  });

  it('expands a long comment when "Show more" is clicked', async () => {
    const user = userEvent.setup();
    render(<Comment comment={longComment} />);
    
    const button = screen.getByRole('button', { name: /show more/i });
    await user.click(button);

    expect(screen.getByText(longComment)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument();
  });

  it('collapses a long comment when "Show less" is clicked', async () => {
    const user = userEvent.setup();
    render(<Comment comment={longComment} />);
    
    const showMoreButton = screen.getByRole('button', { name: /show more/i });
    await user.click(showMoreButton);
    
    const showLessButton = screen.getByRole('button', { name: /show less/i });
    await user.click(showLessButton);

    const expectedTruncated = `${longComment.slice(0, 130)}...`;
    expect(screen.getByText(expectedTruncated)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
  });
});
