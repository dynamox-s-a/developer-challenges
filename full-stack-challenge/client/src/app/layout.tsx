import { AuthProvider } from './login/providers/auth-provider';
import QueryClientProvider from './login/providers/query-client-provider';

export const metadata = {
  title: 'DynaPredict',
  description: 'Machine and sensors management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
