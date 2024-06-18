import { Box, Container, Typography } from '@mui/material';

import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          padding: '0.5rem',
          textAlign: 'start'
        }}
      >
        Análise de dados
      </Typography>

      <Container
        component="main"
        sx={{
          backgroundColor: '#f8f9fa',
          border: 'solid 0.1em #DCDCDC',
          flex: 1,
          padding: '1rem',
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
