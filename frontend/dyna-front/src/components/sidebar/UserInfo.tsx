
import React from 'react';
import { Box, Typography } from '@mui/material';
import { User } from '../../types/auth.types';
import { SIDEBAR_CONFIG } from '../../constants/navigation.constants';

interface UserInfoProps {
  user: User | null;
}

export const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <Box sx={{ 
      p: 2, 
      borderBottom: `1px solid ${SIDEBAR_CONFIG.textColor}30` 
    }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        Bem-vindo!
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        {user?.name || 'Usuário'}
      </Typography>
    </Box>
  );
};
