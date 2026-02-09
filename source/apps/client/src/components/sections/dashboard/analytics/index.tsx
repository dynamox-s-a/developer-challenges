import Grid from '@mui/material/Grid';
import TotalTelemetry from './TotalTelemetry';
import MachinesStats from './MachinesStats';
import MonitoringPointsStats from './MonitoringPointsStats';
import ActiveSensors from './ActiveSensors';

const Analytics = () => {
  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} md={6} lg={3}>
        <TotalTelemetry />
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <MachinesStats />
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <MonitoringPointsStats />
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <ActiveSensors />
      </Grid>
    </Grid>
  );
};

export default Analytics;
