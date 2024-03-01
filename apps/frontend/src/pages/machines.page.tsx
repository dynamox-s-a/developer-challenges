import {
  Box,
  Stack,
  Container,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import Head from 'next/head';
import privateRoute from '../routes/privateRoute';
import { MachinesTable } from '../sessions/machines/MachinesTable';
import { AddMachineForm } from '../sessions/machines/AddMachineForm';
import { Layout as DashboardLayout } from '../layouts/dashboard/Layout';

const Page = () => (
  <DashboardLayout>
    <Head>
      <title>
        Sensors | Dynamox
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
              Machines
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
                <AddMachineForm />
              </Grid>
              <Grid
                xs={12}
                md={6}
                lg={8}
              >
                <MachinesTable />
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </DashboardLayout>
);

export default privateRoute(Page);
