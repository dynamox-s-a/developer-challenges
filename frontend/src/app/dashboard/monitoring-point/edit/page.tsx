'use client'

import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import Button from '@mui/material/Button';

import { config } from '@/config';
import { MonitoringPointForm } from '@/components/dashboard/monitoring-point/monitoring-point-form';

import { paths } from '@/paths';
import { machine_types } from '@/types';
import RouterLink from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'




export default function Page(): React.JSX.Element {
  const searchParams = useSearchParams()
  const id = searchParams.get(`id`);



  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">{id ? 'Edit' : 'Add'} Monitoring Point {id}</Typography>
      </div>
      
      <Grid container spacing={3}>
        <Grid>
          <MonitoringPointForm id={id}/>
        </Grid>
      </Grid>
    </Stack>
  );
}
