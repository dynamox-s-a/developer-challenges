import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ErrorMessage } from './index';

const theme = createTheme();

const renderErrorMessage = (message: string) => {
  return render(
    <ThemeProvider theme={theme}>
      <ErrorMessage message={message} />
    </ThemeProvider>,
  );
};

describe('ErrorMessage Component', () => {
  it('should render the error message correctly', () => {
    const message = 'Teste de mensagem de erro';

    renderErrorMessage(message);

    expect(screen.getByTestId('error-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('error-message-icon')).toBeInTheDocument();

    const messageElement = screen.getByTestId('error-message-text');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveTextContent(message);
  });

  it('should render the empty error message correctly', () => {
    const message = '';

    renderErrorMessage(message);

    expect(screen.getByTestId('error-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('error-message-icon')).toBeInTheDocument();

    const messageElement = screen.getByTestId('error-message-text');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveTextContent(message);
  });
});
