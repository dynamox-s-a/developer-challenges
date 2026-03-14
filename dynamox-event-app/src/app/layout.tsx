'use client'

import { AuthProvider } from '@/context/AuthContext';
import StoreProvider from '@/redux/StoreProvider';
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
          <StoreProvider>
            <ThemeRegistry>
              {children}
            </ThemeRegistry>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  )
}