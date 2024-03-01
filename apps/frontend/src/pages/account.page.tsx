import {
  Box,
  Stack,
  Container,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import Head from 'next/head';
import { ReactNode } from 'react';
import { AccountProfile } from '../sessions/account/AccountProfile';
import { Layout as DashboardLayout } from '../layouts/dashboard/Layout';
import { AccountProfileDetails } from '../sessions/account/AccountProfileDetails';

const Page = () => (
  <>
    <Head>
      <title>
        Account | Dynamox
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              Account
            </Typography>
          </div>
          <div>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
                lg={4}
              >
                <AccountProfile />
              </Grid>
              <Grid
                xs={12}
                md={6}
                lg={8}
              >
                <AccountProfileDetails />
              </Grid>
            </Grid>
          </div>
        </Stack>
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
