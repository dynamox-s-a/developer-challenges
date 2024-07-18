import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';

describe('<Header/>', () => {
  it('should render the header with correct text', () => {
    render(<Header />);
    const headerElement = screen.getByText(/Análise de Dados/i);
    expect(headerElement).toBeInTheDocument();
  });
});
