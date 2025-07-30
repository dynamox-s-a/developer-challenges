// 📁 page-client.tsx (Client Component — can use hooks, MUI dialogs, etc.)
'use client';

import { useState } from 'react';
import {
  Stack, Button, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
  Select,
  MenuItem
} from '@mui/material';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { MachineTable } from '@/components/dashboard/customer/machine-table';

const machines = [
  { id: 'USR-010', name: 'Pump Station Alpha', type: 'pump' },
  { id: 'USR-009', name: 'Cooling Fan Beta', type: 'fan' },
  { id: 'USR-008', name: 'Industrial Pump Gamma', type: 'pump' },
];

export default function PageClient() {
  const page = 0;
  const rowsPerPage = 5;
  const paginatedMachines = machines.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const [open, setOpen] = useState(false);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Customers</Typography>
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

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Machine</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2, minWidth: 300 }}>
            <Typography variant="h6">Name</Typography>
            <TextField
              fullWidth
              // label="Machine Name"
              autoFocus
            />
            <Typography variant="h6">Type</Typography>
            <Select
              fullWidth
              // defaultValue="pump"
              label="Type"
              // displayEmpty
            >
              <MenuItem value="pump">Pump</MenuItem>
              <MenuItem value="fan">Fan</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
