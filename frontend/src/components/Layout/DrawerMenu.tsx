import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { Dashboard as DashIcon, PrecisionManufacturing, ExitToApp } from '@mui/icons-material';

interface DrawerMenuProps {
  currentView: 'home' | 'machines';
  onNavigate: (view: 'home' | 'machines') => void;
  onLogout: () => void;
}

export const DrawerMenu = ({ currentView, onNavigate, onLogout }: DrawerMenuProps) => {
  return (
    <>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          HUB CONTROL
        </Typography>
      </Toolbar>
      <List sx={{ flexGrow: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => onNavigate('home')} selected={currentView === 'home'}>
            <ListItemIcon sx={{ color: 'white' }}><DashIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => onNavigate('machines')} selected={currentView === 'machines'}>
            <ListItemIcon sx={{ color: 'white' }}><PrecisionManufacturing /></ListItemIcon>
            <ListItemText primary="Máquinas" />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={onLogout} sx={{ color: '#f4f6f8' }}>
            <ListItemIcon sx={{ color: '#f4f6f8' }}><ExitToApp /></ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
};
