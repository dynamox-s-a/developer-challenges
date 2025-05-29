
import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

export const LoginHeader: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
        <LockOutlined />
      </Avatar>
      
      <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
        Sign In
      </Typography>
    </Box>
  );
};
