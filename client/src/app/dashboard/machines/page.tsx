'use client';

import { useEffect, useState } from 'react';
import {
  Stack, Button, Typography
} from '@mui/material';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { MachineTable } from '@/components/dashboard/machine/machine-table';
import { AddMachineDialog } from '@/components/dashboard/machine/add-machine-dialog';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchMachines } from '@/store/features/machinesSlice';

export default function PageClient() {
  const dispatch = useDispatch<AppDispatch>();
  const { list: machines, loading, error } = useSelector((state: RootState) => state.machines);

  const page = 0;
  const rowsPerPage = 5;
  const paginatedMachines = machines.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Machines</Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" startIcon={<UploadIcon />}>Import</Button>
            <Button color="inherit" startIcon={<DownloadIcon />}>Export</Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon />} variant="contained" onClick={() => setOpen(true)}>
            Add
          </Button>
        </div>
      </Stack>
      <MachineTable paginatedMachines={paginatedMachines} />
      <AddMachineDialog open={open} onClose={() => setOpen(false)} />
    </Stack>
  );
}
