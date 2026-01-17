'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';

import Image from 'next/image';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

const drawerWidth = 240;

export function DashboardDrawer() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          bgcolor: 'primary.main',
        },
      }}
    >
      <Box
        sx={{
          p: 1,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Image
          src="/icons/Dynamox-logo-branca.png"
          alt="Logo"
          width={200}
          height={80}
          style={{ objectFit: 'contain' }}
        />
      </Box>

      <List>
        {/* Botão Máquinas */}
        <ListItemButton
          component={Link}
          href="/dashboard/machines"
          selected={pathname === '/dashboard/machines'}
          sx={{
            color: 'white',
            '& .MuiListItemIcon-root': { color: 'white' },
            '&.Mui-selected': {
              bgcolor: 'primary.contrastText',
              color: 'black',
              '& .MuiListItemIcon-root': { color: 'black' },
            },
            '&:hover': {
              bgcolor: 'primary.light',
            },
          }}
        >
          <ListItemIcon>
            <PrecisionManufacturingIcon />
          </ListItemIcon>
          <ListItemText primary="Máquinas" />
        </ListItemButton>

        {/* Botão Monitoramento */}
        <ListItemButton
          component={Link}
          href="/dashboard/monitor"
          selected={pathname === '/dashboard/monitor'}
          sx={{
            color: 'white',
            '& .MuiListItemIcon-root': { color: 'white' },
            '&.Mui-selected': {
              bgcolor: 'primary.contrastText',
              color: 'black',
              '& .MuiListItemIcon-root': { color: 'black' },
            },
            '&:hover': {
              bgcolor: 'primary.light',
            },
          }}
        >
          <ListItemIcon>
            <MonitorHeartIcon />
          </ListItemIcon>
          <ListItemText primary="Monitoramento" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
