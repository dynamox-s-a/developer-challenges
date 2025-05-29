
import React from 'react';
import { Alert } from '@mui/material';

interface ErrorAlertProps {
  error: string | null;
  onClose?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <Alert 
      severity="error" 
      sx={{ width: '100%', mb: 2 }}
      onClose={onClose}
    >
      {error}
    </Alert>
  );
};
