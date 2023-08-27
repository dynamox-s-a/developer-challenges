import {
  Button as MUIButton,
  ButtonProps,
  CircularProgress,
} from '@mui/material';
import React from 'react';

interface ButtonType extends ButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

const Button = ({ children, isLoading, ...props }: ButtonType) => {
  return (
    <MUIButton {...props}>
      {isLoading ? <CircularProgress color="inherit" size={26} /> : children}
    </MUIButton>
  );
};

export default Button;
