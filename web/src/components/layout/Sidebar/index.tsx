"use client"

import { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Analytics,
  Dashboard,
  Menu,
  Person,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Analytics', icon: <Analytics />, path: '/dashboard/analytics' },
    { text: 'Perfil', icon: <Person />, path: '/dashboard/profile' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    closeDrawer();
  };

  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <Toolbar>
        <Typography variant="h6" component="div">
          Sensory Application
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer}
        edge="start"
        sx={{ mr: 2 }}
      >
        <Menu />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={closeDrawer}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;