
import React from 'react';
import { Box, Link } from '@mui/material';

export const LoginActions: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
      <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
        Forgot password?
      </Link>
      <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
        Don't have an account? Sign Up
      </Link>
    </Box>
  );
};
