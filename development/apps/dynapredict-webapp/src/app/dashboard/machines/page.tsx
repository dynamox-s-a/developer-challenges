'use client';

import React, { ReactNode } from 'react';
import Grid from '@mui/material/Unstable_Grid2';

import { useGetMachinesQuery } from '@/lib/redux/service/api';
import { ListMachines } from '@/components/dashboard/machines/list-machines';
import { MachinesForm } from '@/components/dashboard/machines/machines-form';

export default function Page(): ReactNode {
  const { data: machines, isLoading, error } = useGetMachinesQuery(undefined);
  const isFormDisabled = isLoading || Boolean(error);

  return (
    <Grid container spacing={3}>
      <Grid lg={12} sm={12} xs={12} order={{ xs: 3, sm: 3 }}>
        <MachinesForm isFormDisabled={isFormDisabled} />
      </Grid>
      <Grid lg={12} sm={12} xs={12} order={{ xs: 3, sm: 3 }}>
        <ListMachines isLoading={isLoading} error={error ?? null} machines={machines ?? []} />
      </Grid>
    </Grid>
  );
}
