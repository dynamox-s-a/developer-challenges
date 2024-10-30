'use client';

import Grid from '@mui/material/Unstable_Grid2';

import { useGetMachinesQuery } from '@/lib/redux/service/api';
import DidYouKnow from '@/components/dashboard/did-you-know';
import { ListMachines } from '@/components/dashboard/machines/list-machines';
import { MachinesForm } from '@/components/dashboard/machines/machines-form';

export default function Page(): React.JSX.Element {
  const { data: machines, isLoading, error } = useGetMachinesQuery();
  const isFormDisabled = isLoading || !!error;

  return (
    <Grid container spacing={3}>
      <Grid lg={6} sm={6} xs={12} order={{ xs: 2, sm: 1 }}>
        <MachinesForm isFormDisabled={isFormDisabled} />
      </Grid>
      <Grid lg={6} sm={6} xs={12} order={{ xs: 1, sm: 2 }}>
        <DidYouKnow
          message={
            'The machines managed on Dynapredict can be equipped with a variety of monitoring points and sensors that helps you to achieve maximum security and longetivity for your machines.'
          }
        />
      </Grid>
      <Grid lg={12} sm={12} xs={12} order={{ xs: 3, sm: 3 }}>
        <ListMachines isLoading={isLoading} error={error ?? null} machines={machines ?? []} />
      </Grid>
    </Grid>
  );
}
