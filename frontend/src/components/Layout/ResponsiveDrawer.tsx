import { useState } from 'react';
import { 
  Drawer, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface ResponsiveDrawerProps {
  drawerWidth: number;
  children: React.ReactNode;
}

export const ResponsiveDrawer = ({ 
  drawerWidth, 
  children 
}: ResponsiveDrawerProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {isMobile && (
        <AppBar 
          position="fixed" 
          sx={{ 
            bgcolor: '#692746',
            zIndex: theme.zIndex.drawer + 1
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="abrir menu"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
              HUB CONTROL
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            bgcolor: '#692746',
            color: 'white'
          },
        }}
      >
        {children}
      </Drawer>
    </>
  );
};