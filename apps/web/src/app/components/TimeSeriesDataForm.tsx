import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, TextField } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AppDispatch } from '@/app/store/store';
import { createTimeSeriesData, deleteTimeSeriesData, fetchTimeSeries } from '@/app/store/slices/timeSeriesSlice';

interface TimeSeriesDataFormProps {
  sensorId: string;
}

export const TimeSeriesDataForm: React.FC<TimeSeriesDataFormProps> = ({ sensorId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [value, setValue] = useState('');
  const [timestamp, setTimestamp] = useState(new Date().toISOString().slice(0, 16));

  const handleAdd = async () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    const date = new Date(timestamp);
    await dispatch(createTimeSeriesData({
      sensorId,
      value: numValue,
      timestamp: date.toISOString(),
    }));
    setValue('');
    setTimestamp(new Date().toISOString().slice(0, 16));
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Remover todos os dados deste sensor?')) return;
    await dispatch(deleteTimeSeriesData(sensorId));
    dispatch(fetchTimeSeries(sensorId));
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap', mb: 2 }}>
      <TextField
        label="Valor"
        type="number"
        size="small"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputProps={{ step: 0.01 }}
        sx={{ width: 120 }}
      />
      <TextField
        label="Data/Hora"
        type="datetime-local"
        size="small"
        value={timestamp}
        onChange={(e) => setTimestamp(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ width: 220 }}
      />
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} disabled={!value}>
        Adicionar
      </Button>
      <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteAll}>
        Remover todos
      </Button>
    </Box>
  );
};
