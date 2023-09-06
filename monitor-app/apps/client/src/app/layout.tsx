import dynamic from 'next/dynamic'
// import { ThemeProvider } from '@mui/material/styles/'
import { Container, CssBaseline } from '@mui/material'
import { theme } from 'theme'
import AuthProvider from '../next-auth/auth-provider'
import ReduxProvider from '../redux/provider'

export const metadata = {
  title: 'monitor-app',
  description: 'Industry 4.0 machine monitoring solution'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ThemeProvider = dynamic(() => import('@mui/material/styles/ThemeProvider'), { ssr: false })
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container disableGutters maxWidth="xl">
              <ReduxProvider>{children}</ReduxProvider>
            </Container>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
