import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { ResponsiveDrawer } from './ResponsiveDrawer';

interface DashboardLayoutProps {
  drawerWidth: number;
  drawerContent: ReactNode;
  children: ReactNode;
}

export const DashboardLayout = ({ drawerWidth, drawerContent, children }: DashboardLayoutProps) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <ResponsiveDrawer drawerWidth={drawerWidth}>
        {drawerContent}
      </ResponsiveDrawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
};