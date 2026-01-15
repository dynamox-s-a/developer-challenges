import { type ReactNode } from 'react';
import { TopBar } from './TopBar';
import { Box } from '@mui/material';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <TopBar />
      <Box component="main">
        {children}
      </Box>
    </Box>
  );
};