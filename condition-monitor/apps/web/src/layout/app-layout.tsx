import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import { ApiStatusChip } from './api-status';
import { NAVIGATION } from './navigation';
import { UserMenu } from './user-menu';

const DRAWER_WIDTH = 240;

/**
 * Shell of every private screen. On wide screens the menu stays open beside the content;
 * on narrow ones it becomes a drawer opened from the app bar.
 */
export function AppLayout() {
  const theme = useTheme();
  const isWide = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = (
    <List component="nav" aria-label="Main navigation">
      {NAVIGATION.map((item) => (
        <ListItemButton
          key={item.path}
          component={NavLink}
          to={item.path}
          end={item.path === '/'}
          onClick={() => setMobileOpen(false)}
          sx={{ '&.active': { bgcolor: 'action.selected' } }}
        >
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {!isWide && (
            <IconButton
              color="inherit"
              edge="start"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="span" noWrap sx={{ flexGrow: 1, minWidth: 0 }}>
            Condition Monitor
          </Typography>
          <ApiStatusChip />
          <UserMenu />
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isWide ? 'permanent' : 'temporary'}
        open={isWide || mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        {menu}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, minWidth: 0 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
