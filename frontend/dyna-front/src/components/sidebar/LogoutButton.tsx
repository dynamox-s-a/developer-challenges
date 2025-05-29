
import React from 'react';
import { Box, Button } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';
import { SIDEBAR_CONFIG } from '../../constants/navigation.constants';

interface LogoutButtonProps {
  onLogout: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <Box sx={{ p: 2, mt: 'auto' }}>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<LogoutOutlined />}
        onClick={onLogout}
        sx={{
          color: SIDEBAR_CONFIG.textColor,
          borderColor: SIDEBAR_CONFIG.textColor,
          '&:hover': {
            backgroundColor: `${SIDEBAR_CONFIG.textColor}20`,
            borderColor: SIDEBAR_CONFIG.textColor,
          },
        }}
      >
        Sair
      </Button>
    </Box>
  );
};
