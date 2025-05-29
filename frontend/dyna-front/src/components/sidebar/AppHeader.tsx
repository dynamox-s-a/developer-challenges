
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { SIDEBAR_CONFIG } from '../../constants/navigation.constants';

export const AppHeader: React.FC = () => {
  return (
    <AppBar 
      position="fixed" 
      sx={{
        width: `calc(100% - ${SIDEBAR_CONFIG.drawerWidth}px)`,
        ml: `${SIDEBAR_CONFIG.drawerWidth}px`,
        backgroundColor: SIDEBAR_CONFIG.backgroundColor
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Dyna System
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
