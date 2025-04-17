// src/components/Conteudo.tsx
import { Box, Toolbar } from '@mui/material';
import React from 'react';

interface ContentProps {
  children: React.ReactNode;
}

export default function Content({ children }: ContentProps) {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      {children}
    </Box>
  );
}
