import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addMachineAsync, updateMachineAsync, deleteMachineAsync } from '../../store/Slices/machineSlice';
import {
  Box, Button, TextField, Typography, List, ListItem, ListItemText,
  Select, MenuItem, FormControl, InputLabel, Stack, CircularProgress, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Machines: React.FC = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'Pump' | 'Fan'>('Pump');
  const [editingId, setEditingId] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { machines, loading, error } = useAppSelector(state => state.machines);

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (editingId) {
      dispatch(updateMachineAsync({ id: editingId, name: name.trim(), type }));
    } else {
      dispatch(addMachineAsync({ name: name.trim(), type }));
    }
    
    resetForm();
  };

  const handleEdit = (machine: { id: string; name: string; type: 'Pump' | 'Fan' }) => {
    setEditingId(machine.id);
    setName(machine.name);
    setType(machine.type);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteMachineAsync(id));
    if (editingId === id) resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setType('Pump');
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>
        Voltar para Dashboard
      </Button>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="h4" gutterBottom>
        Gerenciamento de Máquinas
        {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
      </Typography>

      {/* FORMULÁRIO */}
      <Stack spacing={2} sx={{ maxWidth: 400, mb: 4 }}>
        <TextField
          label="Nome da Máquina"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          disabled={loading}
        />

        <FormControl fullWidth>
          <InputLabel>Tipo da Máquina</InputLabel>
          <Select
            value={type}
            label="Tipo da Máquina"
            onChange={(e) => setType(e.target.value as 'Pump' | 'Fan')}
            disabled={loading}
          >
            <MenuItem value="Pump">Bomba (Pump)</MenuItem>
            <MenuItem value="Fan">Ventilador (Fan)</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!name.trim() || loading}
          >
            {editingId ? 'Atualizar' : 'Adicionar'} Máquina
          </Button>

          {editingId && (
            <Button variant="outlined" onClick={resetForm}>
              Cancelar
            </Button>
          )}
        </Stack>
      </Stack>

      {/* LISTA DE MÁQUINAS */}
      <Typography variant="h6" gutterBottom>
        Máquinas Cadastradas ({machines.length})
      </Typography>

      <List>
        {machines.map((machine) => (
          <ListItem
            key={machine.id}
            sx={{
              border: '1px solid #e0e0e0',
              mb: 1,
              borderRadius: 1,
              bgcolor: editingId === machine.id ? '#f5f5f5' : 'white'
            }}
          >
            <ListItemText
              primary={machine.name}
              secondary={`Tipo: ${machine.type === 'Pump' ? 'Bomba' : 'Ventilador'}`}
            />

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small" onClick={() => handleEdit(machine)}>
                Editar
              </Button>
              <Button color="error" variant="outlined" size="small" onClick={() => handleDelete(machine.id)}>
                Excluir
              </Button>
            </Stack>
          </ListItem>
        ))}

        {machines.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
            Nenhuma máquina cadastrada
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default Machines;
