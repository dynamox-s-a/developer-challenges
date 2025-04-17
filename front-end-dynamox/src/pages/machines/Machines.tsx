import { useState } from 'react';
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import { MachineTable } from '../../components/table/MachineTable';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { addMachine, updateMachine } from '../../redux/machinesSlice';
import { v4 as uuidv4 } from 'uuid';

export default function Machines() {
  const dispatch = useDispatch();
  const machines = useSelector((state: RootState) => state.machines.machines);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddOrUpdate = () => {
    if (!name || !type) return;

    if (editingId) {
      dispatch(updateMachine({ id: editingId, name, type: type as 'Pump' | 'Fan' }));
      setEditingId(null);
    } else {
      dispatch(addMachine({ id: uuidv4(), name, type: type as 'Pump' | 'Fan' }));
    }

    setName('');
    setType('');
  };

  const handleEdit = (id: string) => {
    const machine = machines.find((machine) => machine.id === id);
    if (machine) {
      setName(machine.name);
      setType(machine.type);
      setEditingId(machine.id);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 6,
        gap: 4,
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Machine Management
      </Typography>

      <Box sx={{ maxWidth: 400, width: '100%' }}>
        <TextField
          label="Machine Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            label="Type"
          >
            <MenuItem value="Pump">Pump</MenuItem>
            <MenuItem value="Fan">Fan</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleAddOrUpdate} fullWidth>
          {editingId ? 'Save Changes' : 'Add Machine'}
        </Button>
      </Box>

      <MachineTable machines={machines} onEdit={handleEdit} />
    </Box>
  );
}
