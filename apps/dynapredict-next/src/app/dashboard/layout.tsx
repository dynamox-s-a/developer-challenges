import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/dashboard/layout/main-nav';
import { SideNav } from '@/components/dashboard/layout/side-nav';

import StoreProvider from './StoreProvider';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <AuthGuard>
      <StoreProvider>
        <GlobalStyles
          styles={{
            body: {
              '--MainNav-height': '56px',
              '--MainNav-zIndex': 1000,
              '--SideNav-width': '280px',
              '--SideNav-zIndex': 1100,
              '--MobileNav-width': '320px',
              '--MobileNav-zIndex': 1100,
            },
          }}
        />
        <Box
          sx={{
            bgcolor: 'var(--mui-palette-background-default)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            minHeight: '100%',
          }}
        >
          <SideNav />
          <Box
            sx={{
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
              position: 'relative',
              pl: { lg: 'var(--SideNav-width)' },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top left',
                backgroundImage: 'url("/new_assets/grafismo.png")',
                opacity: 0.5,
                zIndex: 0,
              },
            }}
          >
            <MainNav />
            <main style={{ position: 'relative', zIndex: 1 }}>
              <Container maxWidth="xl" sx={{ py: '64px' }}>
                {children}
              </Container>
            </main>
          </Box>
        </Box>
      </StoreProvider>
    </AuthGuard>
  );
}
