'use client'

import { RegisterMonitoringPointsForm } from '@/components/dashboard/register-monitoring-points/register-monitoring-points.form';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';


export default function Page(): React.JSX.Element {
 

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Register Monitoring Points</Typography>
        </Stack>
      </Stack>
      <RegisterMonitoringPointsForm />
    </Stack>
  );
}


