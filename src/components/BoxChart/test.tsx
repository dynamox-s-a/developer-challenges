import { render, screen } from '@testing-library/react';
import BoxChart from '.';

describe('<BoxChart />', () => {
  it('should render the text and children correctly', () => {
    render(
      <BoxChart text="Test Text">
        <div>Child Element</div>
      </BoxChart>,
    );

    const textElement = screen.getByText(/Test Text/i);
    const childElement = screen.getByText(/Child Element/i);

    expect(textElement).toBeInTheDocument();
    expect(childElement).toBeInTheDocument();
  });

  it('should have the correct styles applied', () => {
    render(
      <BoxChart text="Styled Text">
        <div>Styled Child</div>
      </BoxChart>,
    );

    const textElement = screen.getByText(/Styled Text/i);

    expect(textElement).toHaveStyle('font-size: 14px');
    expect(textElement).toHaveStyle('font-weight: 500');
    expect(textElement).toHaveStyle('border-bottom: 1px solid');
    expect(textElement).toHaveStyle('border-color: rgb(223, 227, 232)');
  });
});
