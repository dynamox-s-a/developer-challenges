'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createMachine, fetchMachines } from '@/store/features/machinesSlice';
import { useSnackbar } from '@/providers/SnackProvider';

interface AddMachineDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddMachineDialog({ open, onClose }: AddMachineDialogProps): React.JSX.Element {
  const { showMessage } = useSnackbar();
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState('');
  const [type, setType] = useState<'pump' | 'fan'>('pump');
  const [creating, setCreating] = useState(false);

  const handleClose = () => {
    setName('');
    setType('pump');
    setCreating(false);
    onClose();
  };

  const handleAddMachine = async () => {
    if (!name.trim()) {
      showMessage('Please enter a machine name', 'error');
      return;
    }
    
    setCreating(true);
    try {
      await dispatch(createMachine({ name, type })).unwrap();
      showMessage('Machine created successfully', 'success');
      handleClose();
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
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Machine</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2, minWidth: 300 }}>
          <Typography variant="h6">Name</Typography>
          <TextField
            fullWidth
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter machine name"
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
        <Button onClick={handleClose} disabled={creating}>
          Cancel
        </Button>
        <Button 
          onClick={handleAddMachine} 
          variant="contained" 
          disabled={creating || !name.trim()}
        >
          {creating ? 'Creating...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}