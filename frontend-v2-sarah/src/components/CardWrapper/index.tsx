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
    <CardWrapperMainContainer>
      <CardWrapperHeader>
        <Typography variant="h6">{title}</Typography>
      </CardWrapperHeader>
      <CardWrapperContent>{children}</CardWrapperContent>
    </CardWrapperMainContainer>
  );
};
