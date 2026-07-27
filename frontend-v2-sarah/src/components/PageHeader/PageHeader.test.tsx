import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PageHeader } from './index';

const theme = createTheme();

describe('PageHeader Component', () => {
  it('Should render the page title correctly', () => {
    const titleText = 'Texto Exemplo';

    render(
      <ThemeProvider theme={theme}>
        <PageHeader pageTitle={titleText} />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('page-header-container')).toBeInTheDocument();

    const titleElement = screen.getByTestId('page-header-title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent(titleText);
    expect(titleElement.tagName).toBe('H1');
  });
});
