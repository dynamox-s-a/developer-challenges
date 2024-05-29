import { render, screen } from '@testing-library/react';
import GridItem from '.';

describe('<GridItem />', () => {
  it('should render the grid item with text', () => {
    render(<GridItem text="Test Text" />);

    const textElement = screen.getByText(/Test Text/i);

    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveTextContent('Test Text');
  });

  it('should render the grid item with icon if provided', () => {
    render(<GridItem text="Test Text" icon={<span data-testid="test-icon">Icon</span>} />);

    const textElement = screen.getByText(/Test Text/i);
    const iconElement = screen.getByTestId('test-icon');

    expect(textElement).toBeInTheDocument();
    expect(iconElement).toBeInTheDocument();
  });

  it('should have the correct styles applied', () => {
    render(<GridItem text="Styled GridItem" />);

    const textElement = screen.getByText(/Styled GridItem/i);

    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveStyle('font-size: 14px');
    expect(textElement).toHaveStyle('font-weight: 400');
  });
});
