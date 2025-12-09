import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  MenuItem,
  CircularProgress
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchMachines, createMachine } from '../store/machineSlice';

const AddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export const MachinesPages = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((state: RootState) => state.machines);
  
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Bomba');

  // Busca os dados assim que a tela abre
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMachines());
    }
  }, [status, dispatch]);

  // Função para Salvar Nova Máquina
  const handleSave = async () => {
    if (!newName) return;
    await dispatch(createMachine({ name: newName, type: newType }));
    setOpen(false);
    setNewName('');
  };

  // Colunas da Tabela
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Nome da Máquina', flex: 1 },
    { 
      field: 'type', 
      headerName: 'Tipo', 
      width: 150,
      renderCell: (params) => (
        <span style={{ 
          fontWeight: 'bold', 
          color: params.value === 'Bomba' ? '#d32f2f' : '#1976d2' 
        }}>
          {params.value}
        </span>
      )
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Máquinas
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ fontWeight: 'bold' }}
        >
          Nova Máquina
        </Button>
      </Box>

      
      <Box sx={{ height: 500, width: '100%', bgcolor: 'background.paper', borderRadius: 1 }}>
        <DataGrid
          rows={items || []} 
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          loading={status === 'loading'}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Box>

      
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Nova Máquina</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Máquina"
            placeholder="Ex: Bomba Centrífuga 01"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mb: 3, mt: 1 }}
          />
          <TextField
            select
            margin="dense"
            label="Tipo"
            fullWidth
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
          >
            <MenuItem value="Bomba">Bomba</MenuItem>
            <MenuItem value="Ventilador">Ventilador</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            disabled={status === 'loading' || !newName}
          >
            {status === 'loading' ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};