import React, { useEffect, useState } from 'react';
import { 
  Box, Button, Typography, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, Alert, Snackbar, Divider 
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchPoints, createPoint, clearError } from '../store/pointsSlice';
import { fetchMachines } from '../store/machineSlice';

// Ícone SVG
const AddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export const PointsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const pointsState = useSelector((state: RootState) => state.points);
  const machinesState = useSelector((state: RootState) => state.machines);

  const points = pointsState?.items || [];
  const pointError = pointsState?.error || null;
  const machines = machinesState?.items || [];

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [machineId, setMachineId] = useState('');
  const [sensorModel, setSensorModel] = useState('HF+');
  const [sensorId, setSensorId] = useState('');

  useEffect(() => {
    dispatch(fetchPoints());
    dispatch(fetchMachines());
  }, [dispatch]);

  const handleSave = async () => {
    const payload = {
      name,
      machineId,
      sensor: sensorId ? { id: sensorId, model: sensorModel } : undefined
    };

    const result = await dispatch(createPoint(payload));
    
    if (createPoint.fulfilled.match(result)) {
      setOpen(false);
      setName('');
      setSensorId('');
      setMachineId('');
    }

  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome do Ponto', flex: 1 },
    { 
      field: 'machineName', 
      headerName: 'Máquina', 
      width: 200,
      valueGetter: (params: any) => params.row.machine?.name || '-'
    },
    { 
      field: 'sensorModel', 
      headerName: 'Sensor', 
      width: 150,
      valueGetter: (params: any) => params.row.sensor?.model || 'Sem Sensor'
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Pontos de Monitoramento</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Novo Ponto
        </Button>
      </Box>

      <Snackbar open={!!pointError} autoHideDuration={6000} onClose={() => dispatch(clearError())}>
        <Alert severity="error" onClose={() => dispatch(clearError())}>{pointError}</Alert>
      </Snackbar>

      <Box sx={{ height: 500, bgcolor: 'background.paper', borderRadius: 1 }}>
        <DataGrid
          rows={points}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Novo Ponto</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            label="Nome do Ponto" 
            fullWidth 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          
          <TextField 
            select 
            label="Máquina Associada" 
            fullWidth 
            value={machineId} 
            onChange={e => setMachineId(e.target.value)}
          >
            {machines.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.name} ({m.type})
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', fontWeight: 'bold' }}>
            CONFIGURAÇÃO DO SENSOR (OPCIONAL)
          </Typography>
          <Divider />

          <TextField 
            label="ID do Sensor (ex: X-100)" 
            fullWidth 
            value={sensorId} 
            onChange={e => setSensorId(e.target.value)} 
          />
          
          <TextField 
            select 
            label="Modelo do Sensor" 
            fullWidth 
            value={sensorModel} 
            onChange={e => setSensorModel(e.target.value)}
          >
            <MenuItem value="HF+">HF+</MenuItem>
            <MenuItem value="TcAg">TcAg</MenuItem>
            <MenuItem value="TcAs">TcAs</MenuItem>
          </TextField>
          
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};