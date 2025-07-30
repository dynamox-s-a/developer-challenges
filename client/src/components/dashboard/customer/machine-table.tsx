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
} from '@mui/material';

export interface Machine {
  id: string;
  name: string;
  type: 'pump' | 'fan';
}

export function MachineTable({ paginatedMachines }: { paginatedMachines: Machine[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  const handleStartEdit = (machine: Machine) => {
    setEditingId(machine.id);
    setEditedName(machine.name);
  };

  const handleSave = (machineId: string) => {
    console.log(`Save ${machineId} with new name: ${editedName}`);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedName('');
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
            gap: 4
          }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: '200px' }}>
              {editingId === machine.id ? (
                <TextField
                  size="small"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={() => handleSave(machine.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave(machine.id);
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
            </Stack>
            <Select
              size="small"
              value={machine.type}
              onChange={(e) => {
                // Handle type change
                console.log(`Changed type to ${e.target.value}`);
              }}
            >
              <MenuItem value="pump">Pump</MenuItem>
              <MenuItem value="fan">Fan</MenuItem>
            </Select>
            <Button variant="contained" color="error" onClick={() => {
              // Handle delete
            }}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
