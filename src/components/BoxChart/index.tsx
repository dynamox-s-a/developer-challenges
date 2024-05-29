import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface BoxChartProps {
  children: ReactNode;
  text: string;
}

function BoxChart({ children, text }: BoxChartProps) {
  return (
    <>
      <Box
        sx={{
          boxShadow: 0,
          border: 1,
          borderColor: '#DFE3E8',
          px: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '4px',
          flexDirection: 'column',
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            borderBottom: 1,
            borderColor: '#DFE3E8',
            width: 1,
            p: 2,
            mb: 4,
            textAlign: 'left',
          }}
        >
          {text}
        </Typography>
        {children}
      </Box>
    </>
  );
}

export default BoxChart;
