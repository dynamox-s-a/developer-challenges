'use client'

import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastProvider';
import StoreProvider from '@/redux/StoreProvider';
import ThemeRegistry from '@/theme/ThemeRegistry';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AuthProvider>
            <ThemeRegistry>
              <ToastProvider>
                {children}
              </ToastProvider>
            </ThemeRegistry>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  )
}