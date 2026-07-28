import type { Preview } from '@storybook/react-vite';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import React from 'react';

// Contorno temporário para o bug do focus do Storybook 10.5+
if (typeof window !== 'undefined' && window.HTMLElement) {
  const nativeFocus = HTMLElement.prototype.focus;
  Object.defineProperty(HTMLElement.prototype, 'focus', {
    value: nativeFocus,
    writable: true,
    configurable: true,
  });
}

// Crie ou ajuste o seu tema do MUI conforme o projeto
const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
