import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}