import React from 'react';
import { Box, Typography } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // Importando o ArcElement
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // Registrando o ArcElement
  Title,
  Tooltip,
  Legend
);

const Chart = ({ title }: { title: string }) => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3, 10, 20, 25, 18, 12, 10],
        backgroundColor: 'rgba(63, 81, 181, 0.5)',
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Bar data={data} />
    </Box>
  );
};

export default Chart;
