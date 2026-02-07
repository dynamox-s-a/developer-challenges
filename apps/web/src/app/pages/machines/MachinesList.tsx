import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '@/app/store/store';
import { fetchMachines, createMachine, updateMachine, deleteMachine } from '@/app/store/slices/machinesSlice';
import type { Machine } from '@/app/types';

export const MachinesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.machines);
  const [open, setOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'Pump' as 'Pump' | 'Fan' });

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  const handleOpen = (machine?: Machine) => {
    if (machine) {
      setEditingMachine(machine);
      setFormData({ name: machine.name, type: machine.type });
    } else {
      setEditingMachine(null);
      setFormData({ name: '', type: 'Pump' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMachine(null);
  };

  const handleSubmit = async () => {
    if (editingMachine) {
      await dispatch(updateMachine({ id: editingMachine.id, data: formData }));
    } else {
      await dispatch(createMachine(formData));
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      dispatch(deleteMachine(id));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Machines</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Machine
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell>{machine.name}</TableCell>
                <TableCell>{machine.type}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(machine)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(machine.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No machines found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingMachine ? 'Edit Machine' : 'Add Machine'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            select
            margin="dense"
            label="Type"
            fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Pump' | 'Fan' })}
          >
            <MenuItem value="Pump">Pump</MenuItem>
            <MenuItem value="Fan">Fan</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
