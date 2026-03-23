'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }

    if (!isLoading && isAuthenticated && pathName.startsWith('/dashboard') && user?.role !== 'admin') {
      router.replace('/events');
    }
  }, [isAuthenticated, router, user, pathName, isLoading]);

  if (isLoading || !isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  return <AppLayout>{children}</AppLayout>;
}