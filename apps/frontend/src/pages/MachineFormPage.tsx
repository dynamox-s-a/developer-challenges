import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const MachineFormPage = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');  // Adiciona o estado para o tipo
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchMachine = async () => {
        try {
          const response = await axios.get(`/api/machines/${id}`);
          setName(response.data.name);
          setStatus(response.data.status);
          setType(response.data.type); // Adiciona o tipo ao estado
        } catch (error) {
          console.error('Error fetching machine:', error);
        }
      };

      fetchMachine();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const machine = { name, status, type };

    try {
      if (id) {
        await axios.put(`/api/machines/${id}`, machine);
      } else {
        await axios.post('/api/machines', machine);
      }
      navigate('/machines');
    } catch (error) {
      console.error('Error saving machine:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Editar Máquina' : 'Adicionar Nova Máquina'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nome da Máquina"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="machine-type-label">Tipo de Máquina</InputLabel>
          <Select
            labelId="machine-type-label"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <MenuItem value="Bomba">Bomba</MenuItem>
            <MenuItem value="Ventilador">Ventilador</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          {id ? 'Atualizar Máquina' : 'Salvar Máquina'}
        </Button>
      </form>
    </Box>
  );
};

export default MachineFormPage;
