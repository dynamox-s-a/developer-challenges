'use client';

import { Box, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h2" fontWeight={700}>
        404
      </Typography>

      <Typography variant="h5">Página não encontrada</Typography>

      <Typography variant="body1" color="text.secondary">
        A página que você tentou acessar não existe ou foi removida.
      </Typography>
    </Box>
  );
}
