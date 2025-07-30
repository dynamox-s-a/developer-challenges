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
} from '@mui/material';
import { deleteMachine, updateMachine } from '@/store/features/machinesSlice';
import { AppDispatch } from '@/store';
import { useDispatch } from 'react-redux';
import { useSnackbar } from '@/providers/SnackProvider';

export interface Machine {
  id: string;
  name: string;
  type: 'pump' | 'fan';
}

export function MachineTable({ paginatedMachines }: { paginatedMachines: Machine[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { showMessage } = useSnackbar();
  const handleStartEdit = (machine: Machine) => {
    setEditingId(machine.id);
    setEditedName(machine.name);
  };

  const handleUpdateName = (machineId: string, machineType: string) => {
    setEditingId(null);
    dispatch(updateMachine({ id: machineId, name: editedName }));
    showMessage('Machine updated', 'info');
  };

  const handleUpdateType = (machineId: string, machineType: string) => {
    dispatch(updateMachine({ id: machineId, type: machineType as 'pump' | 'fan' }));
    showMessage('Machine updated', 'info');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedName('');
  };

  const handleDeleteMachine = (id: string) => {
    dispatch(deleteMachine(id));
    showMessage('Machine deleted', 'info');
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
                handleUpdateType(machine.id, e.target.value as 'pump' | 'fan');
              }}
            >
              <MenuItem value="pump">Pump</MenuItem>
              <MenuItem value="fan">Fan</MenuItem>
            </Select>
                <Container sx={{ minWidth: '200px' }}>
                </Container>
            <Button variant="contained" color="error" onClick={() => handleDeleteMachine(machine.id)}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
