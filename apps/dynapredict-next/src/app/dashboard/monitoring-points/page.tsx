'use client';

import { Alert, Card, CardContent, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { useGetMachinesQuery } from '@/lib/redux/service/api';
import DidYouKnow from '@/components/dashboard/did-you-know';
import { ListMonitoringPoints } from '@/components/dashboard/monitoring-points/list-monitoring-points';
import { MonitoringPointsForm } from '@/components/dashboard/monitoring-points/monitoring-points-form';
import NoMachinesCard from '@/components/dashboard/monitoring-points/no-machines-card';
import SensorsImages from '@/components/dashboard/monitoring-points/sensors-images';

export default function Page(): React.JSX.Element {
  const { data: machines, isLoading, error } = useGetMachinesQuery();
  const areThereMachines = machines && machines.length > 0;
  const isReadyForForm = !isLoading && !error;

  return (
    <Grid container spacing={3}>
      <Grid lg={6} sm={6} xs={12} order={{ xs: 2, sm: 1 }}>
        {isLoading && (
          <Card>
            <CardContent>
              <CircularProgress size={32} />
            </CardContent>
          </Card>
        )}
        {error && <Alert severity="error">Failed to fetch machines. Please try again later.</Alert>}
        {isReadyForForm && (areThereMachines ? <MonitoringPointsForm machines={machines} /> : <NoMachinesCard />)}
      </Grid>
      <Grid lg={6} sm={6} xs={12} order={{ xs: 1, sm: 2 }}>
        <DidYouKnow
          message={
            'Monitoring points are your resources to manage sensors and which machine they track. With our brand new line of sensors, you can now have comprehensive machine health tracking and early problem detection.'
          }
        >
          <SensorsImages />
        </DidYouKnow>
      </Grid>
      <Grid lg={12} sm={12} xs={12} order={{ xs: 3, sm: 3 }}>
        <ListMonitoringPoints />
      </Grid>
    </Grid>
  );
}
