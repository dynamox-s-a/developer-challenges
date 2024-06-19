import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import Home from "../pages/home"
import { BrowserRouter } from "react-router-dom";

describe('Home Component', () => {
    test('renderiza corretamente', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
  
      expect(screen.getByText('Bem-vindo à Home Page')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Ir para Dados' })).toBeInTheDocument();
    });
  
    test('navega para a tela de dados ao clicar no botão', () => {
      const { getByRole } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
  
      fireEvent.click(getByRole('button', { name: 'Ir para Dados' }));
  
      // Verifica se esta navegando para /dados
      expect(window.location.pathname).toBe('/dados');
    });
});