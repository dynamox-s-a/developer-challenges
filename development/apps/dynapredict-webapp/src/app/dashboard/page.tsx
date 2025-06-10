'use client';

import * as React from 'react';
import Grid from '@mui/material/Grid';

import { useGetMachinesQuery } from '@/lib/redux/service/api';
import { ListMachines } from '@/components/dashboard/machines/list-machines';

export default function Page(): React.JSX.Element {
  const { data: machines, isLoading, error } = useGetMachinesQuery(undefined);

  return (
    <Grid container spacing={3}>
      <Grid lg={12} sm={12} xs={12} order={{ xs: 3, sm: 3 }}>
        <ListMachines isLoading={isLoading} error={error ?? null} machines={machines ?? []} />
      </Grid>
    </Grid>
  );
}
