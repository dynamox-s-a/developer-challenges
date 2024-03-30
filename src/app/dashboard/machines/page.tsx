'use client'

import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { paths } from '@/paths';
import { machine_types } from '@/types';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';

import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';


let customers = [
  {
    id: '0',
    name: 'Machine 01',
    type: 'Pump',
  },
  {
    id: '1',
    name: 'Machine 02',
    type: 'Fan',
  },
] satisfies Customer[];


export default function Page(): React.JSX.Element {
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
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Machines</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" component={RouterLink} href={paths.dashboard.edit_machine}>
            Add
          </Button>
        </div>
      </Stack>
      <CustomersTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        handleDeleteClick={handleDeleteClick}
      />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
