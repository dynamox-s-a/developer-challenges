import { Box, Typography } from '@mui/material';

import Chart from './Chart';
import React from 'react';

interface BoxChartProps {
  title: string;
  data: { name: string; data: [number, number][] }[];
  yAxisTitle: string;
}

const BoxChart: React.FC<BoxChartProps> = ({ title, data, yAxisTitle }) => {
  return (
    <Box
      mb={3}
      sx={{
        border: 'solid 0.1em #DCDCDC',
        margin: '10px',
      }}
    >
      <Box
        mb={3}
        sx={{
          alignItems: 'center',
          borderBottom: 'solid 0.1em #DCDCDC',
          display: 'flex',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: '#3A3B3F',
            padding: '1rem',
            textAlign: 'start',
          }}
        >
          {title}
        </Typography>
      </Box>
      <Chart
        data={data}
        yAxisTitle={yAxisTitle}
      />
    </Box>
  );
};

export default BoxChart;
