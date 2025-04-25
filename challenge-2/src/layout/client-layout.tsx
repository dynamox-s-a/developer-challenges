// app/ClientLayout.tsx
'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { ThemeProvider } from '@mui/material'
import { theme } from '@/theme'
import { AuthProvider } from '@/context/auth-context'
import { Provider } from 'react-redux'
import store from '@/store/store'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </Provider>
  )
}
