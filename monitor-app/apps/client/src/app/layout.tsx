import { ThemeProvider } from '@mui/material/styles/'
import { CssBaseline } from '@mui/material'
import { theme } from '../theme'
import AuthProvider from '../next-auth/auth-provider'

export const metadata = {
  title: 'monitor-app',
  description: 'Industry 4.0 machine monitoring solution'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
