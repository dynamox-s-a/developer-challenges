import { render, screen } from '@testing-library/react';
import Header from '.';

describe('<Header />', () => {
  it('should render the header with the given title', () => {
    render(<Header title="Test Title" />);

    const headerElement = screen.getByText(/Test Title/i);

    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveTextContent('Test Title');
  });

  it('should have the correct styles applied', () => {
    render(<Header title="Styled Header" />);

    const headerElement = screen.getByText(/Styled Header/i);

    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveStyle('font-size: 20px');
    expect(headerElement).toHaveStyle('font-weight: 500');
    expect(headerElement).toHaveStyle('color: #3A3B3F');
  });
});
