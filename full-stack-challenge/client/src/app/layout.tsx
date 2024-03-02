import { AuthProvider } from './login/providers/auth-provider';
import QueryClientProvider from './login/providers/query-client-provider';
import { StoreProvider } from './store/store-provider';

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
          <AuthProvider>
            <StoreProvider>{children}</StoreProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
