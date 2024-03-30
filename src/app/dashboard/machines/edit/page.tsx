'use client'

import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import Button from '@mui/material/Button';

import { config } from '@/config';
import { MachineForm } from '@/components/dashboard/machine/machine-form';

import { paths } from '@/paths';
import { machine_types } from '@/types';
import RouterLink from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';

let customers = [
  {
    id: '0',
    name: 'Monitoring Point 01',
    type: 'Pump',
  },
  {
    id: '1',
    name: 'Monitoring Point 02',
    type: 'Fan',
  },
] satisfies Customer[];


export default function Page(): React.JSX.Element {
  const searchParams = useSearchParams()
  const id = searchParams.get(`id`);


  const page = 0;
  const rowsPerPage = 5;
  const router = useRouter();

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  const handleDeleteClick = React.useCallback((evt) => {

    const objWithIdIndex = customers.findIndex((obj) => obj.id === evt.currentTarget.id);
    customers.splice(objWithIdIndex, 1);

    console.log('onClick', evt.currentTarget.id);

    router.refresh();
  }, []);


  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">{id ? 'Edit' : 'Add'} Machine {id}</Typography>
      </div>
      
      <Grid container spacing={3}>
        <Grid>
          <MachineForm id={id}/>
        </Grid>
      </Grid>
      
      <Stack sx={{ 'display': id != undefined ? 'block' : 'none' }}>
        <Stack sx={{ 'margin-top': '25px', 'margin-bottom': '15px' }} direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h5">Monitoring Points</Typography>
          </Stack>
          <div>
            <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" component={RouterLink} href={paths.dashboard.edit_machine}>
              Add
            </Button>
          </div>
        </Stack>
          
        <Grid>
            <CustomersTable
              count={paginatedCustomers.length}
              page={page}
              rows={paginatedCustomers}
              rowsPerPage={rowsPerPage}
              handleDeleteClick={handleDeleteClick}
            />
        </Grid>
      </Stack>
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
