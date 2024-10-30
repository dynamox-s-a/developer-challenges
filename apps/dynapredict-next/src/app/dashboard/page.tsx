'use client';

import * as React from 'react';
import { Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { useGetPaginatedMonitoringPointsQuery } from '@/lib/redux/service/api';
import { MonitoringPointsTable } from '@/components/dashboard/overview/paginated-table';
import { TotalMachines } from '@/components/dashboard/overview/total-machines';
import { TotalMonitoringPoints } from '@/components/dashboard/overview/total-monitoring-points';

export default function Page(): React.JSX.Element {
  const { data: paginatedData, isLoading } = useGetPaginatedMonitoringPointsQuery({
    sortBy: 'machine_name',
    sortOrder: 'asc',
  });

  if (isLoading || !paginatedData) {
    return (
      <Card>
        <CardContent>Loading dashboard data...</CardContent>
      </Card>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid lg={6} sm={6} xs={12}>
        <TotalMachines machinesCount={paginatedData.totalMachines} />
      </Grid>
      <Grid lg={6} sm={6} xs={12}>
        <TotalMonitoringPoints mpsCount={paginatedData.total} />
      </Grid>
      <Grid lg={12} md={12} xs={12}>
        <Card>
          <CardContent>
            <MonitoringPointsTable />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
