'use client';

import { notFound } from 'next/navigation';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Unstable_Grid2';

import { useGetMachineQuery } from '@/lib/redux/service/api';
import { EditForm } from '@/components/dashboard/machines/edit-form';

export default function Page({ params }: { params: { id: string } }): React.JSX.Element {
  const { data: machine, isLoading, isError } = useGetMachineQuery(Number(params.id));

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        <Grid lg={6} sm={6} xs={12}>
          <Card sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Card>
        </Grid>
      </Grid>
    );
  }

  if (isError || !machine) {
    notFound();
  }

  return (
    <Grid container spacing={3}>
      <Grid lg={6} sm={6} xs={12}>
        <EditForm machine={machine} />
      </Grid>
    </Grid>
  );
}
