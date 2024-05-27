import { render, screen } from '@testing-library/react';

import Button from '.';

describe('<Button />', () => {
  it('should render the button with children and className', () => {
    render(<Button className="test-class">Click Me</Button>);

    const buttonElement = screen.getByText(/Click Me/i);

    expect(buttonElement).toBeInTheDocument();

    expect(buttonElement).toHaveClass('test-class');
  });
});
