import Head from 'next/head';
import privateRoute from '../routes/privateRoute';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from '../layouts/dashboard/Layout';

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

        </Grid>
      </Container>
    </Box>
  </DashboardLayout>
);

export default privateRoute(Page);
