import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Filters from '../Filters';
import { dataItems } from '../dataItems';

describe('<Filters />', () => {
  it('should should renders all items with correct text and images', () => {
    render(<Filters />);

    dataItems.forEach((item) => {
      const imgElement = screen.getByAltText(item.text);
      const textElement = screen.getByText(item.text);

      expect(imgElement).toBeInTheDocument();
      expect(imgElement).toHaveAttribute('src', item.icon);
      expect(textElement).toBeInTheDocument();
    });
  });
});
