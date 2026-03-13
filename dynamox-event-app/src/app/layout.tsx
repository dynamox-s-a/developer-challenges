'use client'

import { AuthProvider } from '@/context/AuthContext';
import ThemeRegistry from '@/theme/ThemeRegistry';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning >
        <AuthProvider>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  )
}