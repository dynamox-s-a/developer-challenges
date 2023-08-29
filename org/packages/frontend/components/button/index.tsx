import {
  Button as MUIButton,
  ButtonProps,
  CircularProgress,
} from '@mui/material';
import React from 'react';

interface ButtonType extends ButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingSize?: number;
}

const Button = ({
  children,
  isLoading,
  loadingSize = 26,
  ...props
}: ButtonType) => {
  return (
    <MUIButton {...props}>
      {isLoading ? (
        <CircularProgress color="inherit" size={loadingSize} />
      ) : (
        children
      )}
    </MUIButton>
  );
};

export default Button;
