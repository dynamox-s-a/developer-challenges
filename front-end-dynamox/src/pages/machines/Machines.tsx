import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
} from '@mui/material';
import { MachineTable } from '../../components/table/MachineTable';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
  fetchMachines,
  addMachine,
  editMachine,
  removeMachine,
  Machine,
} from '../../redux/machinesSlice';

export default function Machines() {
  const dispatch = useDispatch<AppDispatch>();
  const { machines, loading } = useSelector((state: RootState) => state.machines);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  const handleAddOrUpdate = () => {
    if (!name || !type) return;

    if (editingId) {
      dispatch(editMachine({ id: editingId, data: { name, type } }));
      setEditingId(null);
    } else {
      dispatch(addMachine({ name, type }));
    }

    setName('');
    setType('');
  };

  const handleEdit = (machine: Machine) => {
    setName(machine.name);
    setType(machine.type);
    setEditingId(machine._id);
  };

  const handleDelete = (id: string) => {
    dispatch(removeMachine(id));
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

      {loading ? (
        <CircularProgress />
      ) : (
        <MachineTable machines={machines} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </Box>
  );
}
