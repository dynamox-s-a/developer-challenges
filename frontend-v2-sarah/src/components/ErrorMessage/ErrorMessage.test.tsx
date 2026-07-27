import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ErrorMessage } from './index';

const theme = createTheme();

describe('ErrorMessage Component', () => {
  it('should render the error message correctly', () => {
    const message = 'Teste de mensagem de erro';

    render(
      <ThemeProvider theme={theme}>
        <ErrorMessage message={message} />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('error-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('error-message-icon')).toBeInTheDocument();

    const messageElement = screen.getByTestId('error-message-text');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveTextContent(message);
  });

  it('should render the empty error message correctly', () => {
    const message = '';

    render(
      <ThemeProvider theme={theme}>
        <ErrorMessage message={message} />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('error-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('error-message-icon')).toBeInTheDocument();

    const messageElement = screen.getByTestId('error-message-text');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveTextContent(message);
  });
});
