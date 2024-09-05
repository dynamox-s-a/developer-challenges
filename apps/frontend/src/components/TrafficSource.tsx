import React from 'react';
import { Box, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';

interface TrafficSourceProps {
  title: string;
}

const TrafficSource: React.FC<TrafficSourceProps> = ({ title }) => {
  const data = {
    labels: ['Desktop', 'Tablet', 'Phone'],
    datasets: [
      {
        data: [63, 15, 22], // Exemplos de dados
        backgroundColor: ['#3F51B5', '#FF9800', '#4CAF50'],
        hoverBackgroundColor: ['#303F9F', '#F57C00', '#388E3C'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <Box sx={{ padding: 2, borderRadius: 1, boxShadow: 3, backgroundColor: 'white' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height: 300, position: 'relative' }}>
        <Doughnut data={data} options={options} />
      </Box>
    </Box>
  );
};

export default TrafficSource;
