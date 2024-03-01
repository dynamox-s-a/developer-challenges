import Head from 'next/head';
import { ReactNode } from 'react';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from '../layouts/dashboard/Layout';

const Page = () => (
  <>
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
  </>
);

Page.getLayout = (page: ReactNode) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
