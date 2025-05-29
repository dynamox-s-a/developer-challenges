
import React from 'react';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { MenuItem } from '../../types/navigation.types';

interface NavigationMenuProps {
  menuItems: MenuItem[];
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ menuItems }) => {
  return (
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.text} disablePadding>
          <ListItemButton component={RouterLink} to={item.path}>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
