import { CssBaseline } from '@mui/material'

export const metadata = {
  title: 'monitor-app',
  description: 'Industry 4.0 machine monitoring solution'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        {children}
      </body>
    </html>
  )
}
