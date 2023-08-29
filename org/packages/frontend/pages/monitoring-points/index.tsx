import { ReactElement } from 'react';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import Head from 'next/head';

import DashboardLayout from 'layouts/dashboard';
const MonitoringPoints = () => {
  return (
    <>
      <Head>
        <title>Monitoring Points</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Monitoring Points</Typography>
              </Stack>
              <div>
                <Button
                  //   startIcon={
                  //     <SvgIcon fontSize="small">
                  //       <PlusIcon />
                  //     </SvgIcon>
                  //   }
                  variant="contained"
                  //   onClick={onToggleAddMachineDialog}
                >
                  Create monitoring point
                </Button>
              </div>
            </Stack>
            <Stack direction="column" spacing={1}>
              {/* {content} */}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

MonitoringPoints.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default MonitoringPoints;
