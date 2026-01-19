'use client';

import { ListItemButton, ListItemIcon, Typography } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <ListItemButton
      onClick={() => {
        signOut();
      }}
      sx={{
        width: '100%',
        py: 1.5,
        justifyContent: 'center',
        color: 'primary.main',
        '&:hover': {
          bgcolor: 'primary.light',
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 'unset',
          mr: 1,
          color: 'primary.contrastText',
        }}
      >
        <PowerSettingsNewIcon />
      </ListItemIcon>

      <Typography
        sx={{
          color: 'primary.contrastText',
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        Logout
      </Typography>
    </ListItemButton>
  );
}
