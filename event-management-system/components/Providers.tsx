'use client'

import { Provider } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { store } from '@/store'
import { theme } from '@/theme'
import { AppInitializer } from './app/AppInitializer'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppInitializer />
        {children}
      </ThemeProvider>
    </Provider>
  )
}