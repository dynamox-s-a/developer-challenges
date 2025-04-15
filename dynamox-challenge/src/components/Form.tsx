import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postMachine, updateMachine } from '../redux/actions/machineActions';
import { AppDispatch, RootState } from '../redux/store';
import { Box, Button, FormControl, InputLabel, Select, MenuItem, TextField, Typography } from '@mui/material';

type FormProps = {
  isEdit: boolean;
  machineId?: string | null;
  onFinish?: () => void;
}

export default function Form({ isEdit, machineId, onFinish }: FormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const [select, setSelect] = useState('');
  const [error, setError] = useState('');
  const userId = useSelector((state: RootState) => state.id);
  const machines = useSelector((state: RootState) => state.machines);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !select) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    if (isEdit) {
      if (machines) {
        const machine = machines.find((machine) => machine.id === machineId);
        if (machine) {
          const updatedMachine = {
            ...machine,
            name: name,
            type: select,
          };
          dispatch(updateMachine(updatedMachine));
          onFinish?.();
        }
      }
    } else {
      if (select === "Pump" || select === "Fan") {
        const newMachine = {
          name: name,
          type: select,
          userId: Number(userId),
        };
        dispatch(postMachine(newMachine));
        onFinish?.();
      }
    }

    setName('');
    setSelect('');
    setError('');
  };

  useEffect(() => {
    if (isEdit) {
      if (machines) {
        const machine = machines.find((machine) => machine.id === machineId);
        if (machine) {
          setName(machine.name);
          setSelect(machine.type);
        }
      }
    }
  }, [isEdit, machines, machineId]);

  return (
    <Box
      className="form-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: 'auto',
        padding: 3,
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Typography variant="h6" component="h4">{isEdit ? 'Edit Machine' : 'Add Machine'}</Typography>

      <TextField
        label="Machine Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
      />

      <FormControl fullWidth required>
        <InputLabel id="machine-type-label">Select Type</InputLabel>
        <Select
          labelId="machine-type-label"
          id="machine-type"
          value={select}
          onChange={(e) => setSelect(e.target.value)}
          label="Select Type"
        >
          <MenuItem value="">
            Select Type
          </MenuItem>
          <MenuItem value="Pump">Pump</MenuItem>
          <MenuItem value="Fan">Fan</MenuItem>
        </Select>
      </FormControl>
      {error && <Typography color="error" variant="body2">{error}</Typography>}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {isEdit ? 'Save Changes' : 'Add Machine'}
        </Button>
        <Button variant="outlined" onClick={onFinish}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
