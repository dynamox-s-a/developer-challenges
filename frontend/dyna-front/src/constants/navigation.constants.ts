
import { MenuItem, SidebarConfig } from '../types/navigation.types';

export const MENU_ITEMS: MenuItem[] = [
  { text: 'Home', path: '/' },
  { text: 'Machine', path: '/about' },
  { text: 'Sensors', path: '/sensors' },
];

export const SIDEBAR_CONFIG: SidebarConfig = {
  drawerWidth: 240,
  backgroundColor: '#1976d2',
  textColor: '#fff',
};

export const DRAWER_STYLES = {
  width: SIDEBAR_CONFIG.drawerWidth,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: {
    width: SIDEBAR_CONFIG.drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: SIDEBAR_CONFIG.backgroundColor,
    color: SIDEBAR_CONFIG.textColor,
    display: 'flex',
    flexDirection: 'column'
  },
};
