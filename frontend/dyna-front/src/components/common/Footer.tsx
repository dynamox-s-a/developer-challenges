
import React from 'react';
import { Typography, Link } from '@mui/material';

export const Footer: React.FC = () => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 'auto' }}>
      {'Copyright © '}
      <Link color="inherit" href="#" sx={{ textDecoration: 'none' }}>
        Dyna System
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};
