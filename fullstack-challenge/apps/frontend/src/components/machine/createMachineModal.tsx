'use client';

import { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addMachine, updateMachine } from '@/store/machine/machine.slices';
import { Machine } from '@/store/machine/machine.types';

type MachineType = 'Pump' | 'Fan';

type CreateMachineModalProps = {
  open: boolean;
  onClose: () => void;
  machine?: Machine | null;
};

export function CreateMachineModal({
  open,
  onClose,
  machine,
}: CreateMachineModalProps) {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [type, setType] = useState<MachineType>('Pump');

  useEffect(() => {
    if (machine) {
      setName(machine.name);
      setType(machine.type);
    } else {
      setName('');
      setType('Pump');
    }
  }, [machine]);

  function handleSubmit() {
    if (machine) {
      dispatch(
        updateMachine({
          id: machine.id,
          name,
          type,
        })
      );
    } else {
      dispatch(
        addMachine({
          name,
          type,
        })
      );
    }

    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: 300, sm: 400 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6">
          {machine ? 'Editar Máquina' : 'Adicionar Máquina'}
        </Typography>

        <TextField
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel id="type-label">Tipo</InputLabel>
          <Select
            labelId="type-label"
            value={type}
            label="Tipo"
            onChange={(e) => setType(e.target.value as MachineType)}
          >
            <MenuItem value="Pump">Pump</MenuItem>
            <MenuItem value="Fan">Fan</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleSubmit} disabled={!name}>
          {machine ? 'Atualizar' : 'Salvar'}
        </Button>
      </Box>
    </Modal>
  );
}
