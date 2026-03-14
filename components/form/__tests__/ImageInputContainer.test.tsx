import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageInputContainer from '../ImageInputContainer';

// Mock dependencies
vi.mock('next/image', () => ({
  default: ({ src, alt, className }: any) => <img src={src} alt={alt} className={className} data-testid="mock-image" />,
}));

vi.mock('../FormContainer', () => ({
  default: ({ children, action }: any) => (
    <div data-testid="mock-form-container">
      <div data-mock-action={action}>
        {children}
      </div>
    </div>
  ),
}));

vi.mock('../ImageInput', () => ({
  default: () => <div data-testid="mock-image-input">Image Input</div>,
}));

vi.mock('../Buttons', () => ({
  SubmitButton: ({ text = 'submit' }: any) => <button type="submit">{text}</button>,
}));

vi.mock('react-icons/lu', () => ({
  LuUser: () => <svg data-testid="user-icon" />,
}));

describe('ImageInputContainer Component', () => {
  const mockProps = {
    name: 'test-image',
    action: vi.fn(),
    text: 'Update Image',
    image: 'https://example.com/test.jpg',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the image when provided', () => {
    render(<ImageInputContainer {...mockProps} />);
    const img = screen.getByTestId('mock-image');
    expect(img).toHaveAttribute('src', mockProps.image);
    expect(img).toHaveAttribute('alt', mockProps.name);
  });

  it('renders user icon when image is not provided', () => {
    render(<ImageInputContainer {...mockProps} image="" />);
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-image')).not.toBeInTheDocument();
  });

  it('toggles form visibility when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ImageInputContainer {...mockProps} />);
    
    const button = screen.getByRole('button', { name: mockProps.text });
    expect(screen.queryByTestId('mock-form-container')).not.toBeInTheDocument();
    
    await user.click(button);
    expect(screen.getByTestId('mock-form-container')).toBeInTheDocument();
    expect(screen.getByTestId('mock-image-input')).toBeInTheDocument();
    
    await user.click(button);
    expect(screen.queryByTestId('mock-form-container')).not.toBeInTheDocument();
  });

  it('renders children inside the form when visible', async () => {
    const user = userEvent.setup();
    render(
      <ImageInputContainer {...mockProps}>
        <div data-testid="child-element">Child Element</div>
      </ImageInputContainer>
    );
    
    await user.click(screen.getByRole('button', { name: mockProps.text }));
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
  });
});
