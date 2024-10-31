'use client';

import React from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';

export default function MobileHeader() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  if (!isMobile) return null;

  return (
    <Box sx={{ py: 2 }}>
      <Stack
        sx={{
          p: 3,
          width: 'auto',
          display: 'inline-flex',
          backgroundColor: '#e5e5e5',
          borderEndEndRadius: '6px',
          borderStartEndRadius: '6px',
        }}
        spacing={1}
      >
        <Typography variant="h5" component="h1" fontWeight={700}>
          Welcome to Dynapredict
        </Typography>
        <Typography variant="body1" component="h1">
          A professional machine manager by Dynamox
        </Typography>
      </Stack>
    </Box>
  );
}
