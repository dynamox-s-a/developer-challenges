import { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import { authClient } from '../../lib/auth/client';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  async function handleLogout() {
    const logout = await authClient.signOut();
    if (logout) {
      navigate('/login', { replace: true });
      window.location.reload();
    }
  }
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <List>
          <ListItem component={Link} to="/dashboard/overview">
            <DashboardIcon />
            <ListItemText primary="Overview" />
          </ListItem>
          <ListItem component={Link} to="/dashboard/create-machine">
            <AddIcon />
            <ListItemText primary="Criar Máquinas" />
          </ListItem>
          <ListItem component={Link} to="/dashboard/create-monitoring-point">
            <AddIcon />
            <ListItemText primary="Criar ponto de monitoramento" />
          </ListItem>
          <ListItem component={Link} to="/dashboard/create-sensor">
            <AddIcon />
            <ListItemText primary="Adicionar sensor" />
          </ListItem>
          <ListItem component={Link} to="/dashboard/settings-user">
            <SettingsIcon />
            <ListItemText primary="Account" />
          </ListItem>
        </List>
      </Drawer>

      {children}
    </Box>
  )
}