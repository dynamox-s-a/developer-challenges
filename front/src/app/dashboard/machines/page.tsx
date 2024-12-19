import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import { config } from '@/config';


export const metadata = { title: `Machines | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Machines(): React.JSX.Element {
  return (
    <Grid container spacing={3}>
     Hi Machines Page
    </Grid>
  );
}
