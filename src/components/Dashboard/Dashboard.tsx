import { Box } from '@mui/material';
import ChartContainer from './Charts/ChartContainer';
import AccelerationChart from './Charts/AccelerationChart';
import TemperatureChart from './Charts/TemperatureChart';
import VelocityChart from './Charts/VelocityChart';

const Dashboard = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      justifyContent: 'space-evenly',
      padding: 3,
      bgcolor: '#fff',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '4px',
    }}
    data-testid="dashboard"
  >
    <ChartContainer title="Aceleração RMS">
      <AccelerationChart />
    </ChartContainer>
    <ChartContainer title="Temperatura">
      <TemperatureChart />
    </ChartContainer>
    <ChartContainer title="Velocidade RMS">
      <VelocityChart />
    </ChartContainer>
  </Box>
);

export default Dashboard;
