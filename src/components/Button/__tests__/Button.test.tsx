import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import BtnShowData from '../Button';

describe('<BtnShowData/>', () => {
  it('should should renders the button with correct text', () => {
    render(
      <BrowserRouter>
        <BtnShowData />
      </BrowserRouter>,
    );
    const buttonElement = screen.getByText(/Visualizar Análise de dados/i);
    expect(buttonElement).toBeInTheDocument();
  });
});
