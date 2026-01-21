/**
 * Componente de layout que renderiza o drawer lateral do dashboard,
 * contendo o menu de navegação principal, destaque da rota ativa
 * e ação de logout no rodapé.
 */

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
  Divider,
} from '@mui/material';

import Image from 'next/image';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LogoutButton from '@/components/login/logoutButton';

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
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 1,
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

      {/* Menu */}
      <List>
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
            '&:hover': { bgcolor: 'primary.light' },
          }}
        >
          <ListItemIcon>
            <PrecisionManufacturingIcon />
          </ListItemIcon>
          <ListItemText primary="Máquinas" />
        </ListItemButton>

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
            '&:hover': { bgcolor: 'primary.light' },
          }}
        >
          <ListItemIcon>
            <MonitorHeartIcon />
          </ListItemIcon>
          <ListItemText primary="Monitoramento" />
        </ListItemButton>
      </List>

      {/* Logout no rodapé */}
      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ bgcolor: 'primary.light', mx: 2 }} />
        <LogoutButton />
      </Box>
    </Drawer>
  );
}
