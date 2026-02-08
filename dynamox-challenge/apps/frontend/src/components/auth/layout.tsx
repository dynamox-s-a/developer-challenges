import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import logo from '@/assets/logo.png';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { dynamoxPurple } from '@/styles/theme/colors';

import { paths } from '@/paths';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100%',
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Box sx={{ p: 3 }}>
          <Box component={RouterLink} to={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
            <Box component="img" src={logo} alt="Dynamox" sx={{ height: 80, width: 'auto' }} />
          </Box>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          bgcolor: dynamoxPurple[900],
          color: 'var(--mui-palette-common-white)',
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'flex-start',
          p: 3,
          pt: 8,
        }}
      >
        <Stack spacing={3} sx={{ height: '100%' }}>
          <Typography color="inherit" sx={{ fontSize: '24px', lineHeight: '32px', textAlign: 'center' }} variant="h1">
            Your partner in monitoring the health and performance of assets
          </Typography>
          <Box sx={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box component="img" src={logo} alt="Dynamox" sx={{ height: 120, width: 'auto' }} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
