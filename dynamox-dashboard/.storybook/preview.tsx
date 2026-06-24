import { CssBaseline, ThemeProvider } from '@mui/material'
import type { Preview } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { theme } from '../src/theme'

const preview: Preview = {
  decorators: [
    (Story: () => ReactNode) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
