'use client'

import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Stack,
  Select,
  MenuItem,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { deleteMachineAsync, updateMachine } from '@/store/features/machinesSlice';
import { AppDispatch } from '@/store';
import { useDispatch } from 'react-redux';
import { useSnackbar } from '@/providers/SnackProvider';

export interface Machine {
  id: string;
  name: string;
  type: 'pump' | 'fan';
  monitoringPoints?: Array<{
    id: string;
    monitoringPointName: string;
    sensorType: string;
  }>;
}

export function MachineTable({ paginatedMachines }: { paginatedMachines: Machine[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingTypeChange, setPendingTypeChange] = useState<{
    machineId: string;
    newType: 'pump' | 'fan';
    machineName: string;
  } | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { showMessage } = useSnackbar();
  const handleStartEdit = (machine: Machine) => {
    setEditingId(machine.id);
    setEditedName(machine.name);
  };

  const handleUpdateName = (machineId: string, machineType: string) => {
    setEditingId(null);
    dispatch(updateMachine({ id: machineId, name: editedName }));
    showMessage('Machine name updated', 'info');
  };

  const handleUpdateType = (machineId: string, newType: string) => {
    const machine = paginatedMachines.find(m => m.id === machineId);
    if (machine && machine.type !== newType) {
      // Show confirmation dialog before changing type
      setPendingTypeChange({
        machineId,
        newType: newType as 'pump' | 'fan',
        machineName: machine.name
      });
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirmTypeChange = () => {
    if (pendingTypeChange) {
      dispatch(updateMachine({ 
        id: pendingTypeChange.machineId, 
        type: pendingTypeChange.newType 
      }));
      showMessage(`Machine type updated to ${pendingTypeChange.newType}. All monitoring points have been removed.`, 'warning');
    }
    setConfirmDialogOpen(false);
    setPendingTypeChange(null);
  };

  const handleCancelTypeChange = () => {
    setConfirmDialogOpen(false);
    setPendingTypeChange(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedName('');
  };

  const handleDeleteMachine = async (id: string) => {
    setDeletingId(id);
    try {
      await dispatch(deleteMachineAsync(id)).unwrap();
      showMessage('Machine and all associated monitoring points have been removed.', 'success');
    } catch (error) {
      showMessage('Failed to delete machine', 'error');
      console.error('Error deleting machine:', error);
    } finally {
      setDeletingId(null);
    }
  };
  

  return (
    <>
      {paginatedMachines.map((machine) => (
        <Card key={machine.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CardContent sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}>
              {editingId === machine.id ? (
                <TextField
                  size="small"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={() => handleUpdateName(machine.id, machine.type)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdateName(machine.id, machine.type);
                    if (e.key === 'Escape') handleCancel();
                  }}
                  autoFocus
                />
              ) : (
                <Typography
                  variant="h6"
                  onClick={() => handleStartEdit(machine)}
                  sx={{ cursor: 'pointer' }}
                >
                  {machine.name}
                </Typography>
              )}
            <Select
              size="small"
              value={machine.type}
              onChange={(e) => {
                handleUpdateType(machine.id, e.target.value);
              }}
            >
              <MenuItem value="pump">Pump</MenuItem>
              <MenuItem value="fan">Fan</MenuItem>
            </Select>
                <Container sx={{ minWidth: '200px' }}>
                </Container>
            <Button 
              variant="contained" 
              color="error" 
              onClick={() => handleDeleteMachine(machine.id)}
              disabled={deletingId === machine.id}
            >
              {deletingId === machine.id ? 'Deleting...' : 'Delete'}
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Confirmation Dialog for Machine Type Change */}
      <Dialog open={confirmDialogOpen} onClose={handleCancelTypeChange}>
        <DialogTitle>Confirm Machine Type Change</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to change the machine type for "{pendingTypeChange?.machineName}" 
            to {pendingTypeChange?.newType}?
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ fontWeight: 'bold' }}>
            ⚠️ Warning: This action will delete all monitoring points associated with this machine, 
            as different machine types have specific sensor types available.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelTypeChange}>Cancel</Button>
          <Button onClick={handleConfirmTypeChange} variant="contained" color="warning">
            Confirm Change
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
