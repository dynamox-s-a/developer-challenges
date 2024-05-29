import { render, screen } from '@testing-library/react';
import BoxChart from '.';

describe('<BoxChart />', () => {
  it('should render the text prop', () => {
    render(<BoxChart text="Test Text">Test Content</BoxChart>);

    const textElement = screen.getByText(/Test Text/i);
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveTextContent('Test Text');
  });

  it('should render the children prop', () => {
    render(
      <BoxChart text="Test Text">
        <div data-testid="child">Child Content</div>
      </BoxChart>,
    );

    const childElement = screen.getByTestId('child');
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent('Child Content');
  });

  it('should have the correct styles applied', () => {
    render(<BoxChart text="Styled BoxChart">Test Content</BoxChart>);

    const textElement = screen.getByText(/Styled BoxChart/i);
    expect(textElement).toHaveStyle('font-size: 14px');
    expect(textElement).toHaveStyle('font-weight: 500');
    expect(textElement).toHaveStyle('border-bottom: 1px solid #DFE3E8');
  });
});
