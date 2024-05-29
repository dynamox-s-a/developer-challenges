import { Card } from '@mui/material';
import { ReactNode } from 'react';

interface CardChartProps {
  children: ReactNode;
}

function CardChart({ children }: CardChartProps) {
  return (
    <>
      <Card
        component={'section'}
        sx={{
          p: 2,
          pb: 6,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          boxShadow: 0,
          border: 1,
          borderColor: '#DFE3E8',
        }}
      >
        {children}
      </Card>
    </>
  );
}

export default CardChart;
