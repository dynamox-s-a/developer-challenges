import { Card } from '@mui/material';
import { ReactNode } from 'react';

interface CardHeaderProps {
  children: ReactNode;
}

function CardHeader({ children }: CardHeaderProps) {
  return (
    <>
      <Card
        component={'header'}
        sx={{
          boxShadow: 0,
          border: 1,
          borderColor: '#DFE3E8',
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '4px',
        }}
      >
        {children}
      </Card>
    </>
  );
}

export default CardHeader;
