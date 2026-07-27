import type { ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import {
  CardWrapperContent,
  CardWrapperHeader,
  CardWrapperMainContainer,
} from './style';

interface CardWrapperProps {
  title: string;
  children: ReactNode;
}

export const CardWrapper = ({ title, children }: CardWrapperProps) => {
  return (
    <CardWrapperMainContainer data-testid="card-wrapper-main-container">
      <CardWrapperHeader data-testid="card-wrapper-header">
        <Typography variant="h6" data-testid="card-wrapper-title">
          {title}
        </Typography>
      </CardWrapperHeader>
      <CardWrapperContent data-testid="card-wrapper-content">
        {children}
      </CardWrapperContent>
    </CardWrapperMainContainer>
  );
};
