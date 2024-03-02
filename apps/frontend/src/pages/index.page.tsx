import Head from 'next/head';
import privateRoute from '../routes/privateRoute';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from '../layouts/dashboard/Layout';
import { AddMonitoringPointForm } from '../sessions/dashboard/AddMonitoringPointForm';
import { MonitoringPointTable } from '../sessions/dashboard/MonitoringPointTable';

const Page = () => (
  <DashboardLayout>
    <Head>
      <title>
        Dashboard | Dynamox
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <AddMonitoringPointForm />
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={8}
          >
            <MonitoringPointTable />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </DashboardLayout>
);

export default privateRoute(Page);
