import type { ReactNode } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { ResponsiveDrawer } from './ResponsiveDrawer';

interface DashboardLayoutProps {
  drawerWidth: number;
  drawerContent: ReactNode;
  children: ReactNode;
}

export const DashboardLayout = ({ drawerWidth, drawerContent, children }: DashboardLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex' }}>
      <ResponsiveDrawer drawerWidth={drawerWidth}>
        {drawerContent}
      </ResponsiveDrawer>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          bgcolor: '#f4f6f8', 
          minHeight: '100vh',
          marginTop: isMobile ? '64px' : 0,
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`
        }}
      >
        {children}
      </Box>
    </Box>
  );
};