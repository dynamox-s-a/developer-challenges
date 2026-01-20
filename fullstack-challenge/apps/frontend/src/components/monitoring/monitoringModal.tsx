'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';

import {
  MonitoringPoint,
  SensorModel,
} from '@/store/monitoring/monitoring.types';

import {
  addMonitoringPoint,
  clearMonitoringError,
} from '@/store/monitoring/monitoring.slices';

import { nanoid } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Machine } from '@/store/machine/machine.types';
import { AppDispatch, RootState } from '@/store/indext';
import { useEffect } from 'react';

interface Props {
  open: boolean;
  machine: Machine;
  onClose: () => void;
}

export function MonitoringModal({ open, machine, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector((state: RootState) => state.monitoring.error);

  const [name, setName] = useState('');
  const [sensorModel, setSensorModel] = useState<SensorModel>('HF+');

  function handleSave() {
    const monitoringPoint: MonitoringPoint = {
      id: nanoid(),
      name,
      machineId: machine.id,
      machineType: machine.type,
      machineName: machine.name,
      sensor: {
        id: nanoid(),
        model: sensorModel,
      },
    };

    dispatch(addMonitoringPoint(monitoringPoint));
    onClose();
  }

  function handleClose() {
    dispatch(clearMonitoringError());
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Novo ponto de monitoramento — {machine.name}</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Nome do ponto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          select
          fullWidth
          margin="normal"
          label="Modelo do sensor"
          value={sensorModel}
          onChange={(e) => setSensorModel(e.target.value as SensorModel)}
        >
          <MenuItem value="HF+">HF+</MenuItem>

          <MenuItem value="TcAg" disabled={machine.type === 'Pump'}>
            TcAg
          </MenuItem>

          <MenuItem value="TcAs" disabled={machine.type === 'Pump'}>
            TcAs
          </MenuItem>
        </TextField>

        {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
