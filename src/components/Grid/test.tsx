import { render, screen } from '@testing-library/react';
import GridItem from '.';

describe('<GridItem />', () => {
  it('should render text without icon', () => {
    render(<GridItem text="Test Text Without Icon" />);

    const textElement = screen.getByText(/Test Text Without Icon/i);
    const imgElement = screen.queryByRole('img');

    expect(textElement).toBeInTheDocument();
    expect(imgElement).not.toBeInTheDocument();
  });

  it('should render text with icon', () => {
    const iconUrl = 'test-icon.svg';
    render(<GridItem text="Test Text With Icon" icon={iconUrl} />);

    const textElement = screen.getByText(/Test Text With Icon/i);
    const imgElement = screen.getByRole('img');

    expect(textElement).toBeInTheDocument();
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', iconUrl);
  });
});
