import Grid from '@mui/material/Grid';
import Analytics from 'components/sections/dashboard/analytics';
import TotalSpent from 'components/sections/dashboard/total-spent';
import ComplexTable from 'components/sections/dashboard/complex-table';
import PiChart from 'components/sections/dashboard/your-pi-chart';
import Revenue from 'components/sections/dashboard/revenue';
import Tasks from 'components/sections/dashboard/tasks';
import PageTitle from 'components/common/PageTitle';

const Dashboard = () => {
  return (
    <>
      <PageTitle title="Dashboard" />
      <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <Analytics />
      </Grid>
      <Grid item xs={12} md={6}>
        <TotalSpent />
      </Grid>
      <Grid item xs={12} md={6}>
        <Revenue />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Tasks />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <PiChart />
      </Grid>
      <Grid item xs={12} lg={4}>
        <ComplexTable />
      </Grid>
    </Grid>
  </>
);
};

export default Dashboard;
