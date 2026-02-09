import Grid from '@mui/material/Grid';
import Analytics from 'components/sections/dashboard/analytics';
import TotalTelemetryChart from 'components/sections/dashboard/total-telemetry-chart';
import SensorDistributionChart from 'components/sections/dashboard/sensor-distribution-chart';
import PageTitle from 'components/common/PageTitle';
import ComplexTable from 'components/sections/dashboard/complex-table';
import Revenue from 'components/sections/dashboard/revenue';
import Tasks from 'components/sections/dashboard/tasks';

const Dashboard = () => {
  return (
    <>
      <PageTitle title="Dashboard" />
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Analytics />
        </Grid>
        
        <Grid item xs={12} md={7}>
          <TotalTelemetryChart />
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <Revenue />
        </Grid> */}
        {/* <Grid item xs={12} md={6} lg={4}>
          <Tasks />
        </Grid> */}
        <Grid item xs={12} md={5}>
          <SensorDistributionChart />
        </Grid>
        {/* <Grid item xs={12} lg={4}>
          <ComplexTable />
        </Grid> */}
      </Grid>
    </>
  );
};

export default Dashboard;
