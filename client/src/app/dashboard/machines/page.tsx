'use client';

import { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { addMachine, deleteMachineAsync, fetchMachines, createMachine } from '@/store/features/machinesSlice';
import { useSnackbar } from '@/providers/SnackProvider';

export default function PageClient() {
  const { showMessage } = useSnackbar();
  const dispatch = useDispatch<AppDispatch>();
  const { list: machines, loading, error } = useSelector((state: RootState) => state.machines);

  const page = 0;
  const rowsPerPage = 5;
  console.log("🚀 ~ PageClient ~ machines:", machines)
  const paginatedMachines = machines.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'pump' | 'fan'>('pump');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);
  
  const handleAddMachine = async () => {
    if (!name.trim()) {
      showMessage('Please enter a machine name', 'error');
      return;
    }
    
    setCreating(true);
    try {
      await dispatch(createMachine({ name, type })).unwrap();
      showMessage('Machine created successfully', 'success');
      setOpen(false);
      setName('');
      setType('pump');
      // Refetch machines to get the updated list
      dispatch(fetchMachines());
    } catch (error) {
      showMessage('Failed to create machine', 'error');
      console.error('Error creating machine:', error);
    } finally {
      setCreating(false);
    }
  };

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

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Machine</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2, minWidth: 300 }}>
            <Typography variant="h6">Name</Typography>
            <TextField
              fullWidth
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Typography variant="h6">Type</Typography>
            <Select
              fullWidth
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value as 'pump' | 'fan')}
            >
              <MenuItem value="pump">Pump</MenuItem>
              <MenuItem value="fan">Fan</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={creating}>Cancel</Button>
          <Button 
            onClick={handleAddMachine} 
            variant="contained" 
            disabled={creating || !name.trim()}
          >
            {creating ? 'Creating...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
