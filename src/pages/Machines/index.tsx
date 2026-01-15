import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../store';
import { fetchMachines, addMachine, updateMachine, deleteMachine, type Machine } from '../../store/machinesSlice';
import { 
  Box, Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress, 
  Button, Dialog, DialogTitle, DialogContent, TextField, 
  DialogActions, MenuItem, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export const Machines = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, status, error } = useSelector((state: RootState) => state.machines) as { list: Machine[]; status: string; error: string | null };
  
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null); 

  const [name, setName] = useState('');
  const [type, setType] = useState('Pump');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMachines());
    }
  }, [status, dispatch]);

  const handleOpenCreate = () => {
    setEditingId(null); 
    setName('');
    setType('Pump');
    setOpen(true);
  };

  
  const handleOpenEdit = (machine: Machine) => {
    setEditingId(Number(machine.id)); 
    setName(machine.name);    
    setType(machine.type);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta máquina?')) {
      dispatch(deleteMachine(id));
    }
  };

  const handleSave = () => {
    if (!name.trim()) return alert("Nome obrigatório");

    if (editingId) {
      dispatch(updateMachine({ id: String(editingId), name, type: type as 'Pump' | 'Fan' }));
    } else {
      dispatch(addMachine({ name, type: type as 'Pump' | 'Fan' }));
    }
    setOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Minhas Máquinas
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleOpenCreate}
        >
          Nova Máquina
        </Button>
      </Box>

      {status === 'loading' && <CircularProgress />}
      {status === 'failed' && <Typography color="error">Erro: {error}</Typography>}

      {status === 'succeeded' && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>{machine.id}</TableCell>
                  <TableCell>{machine.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={machine.type} 
                      color={machine.type === 'Pump' ? 'primary' : 'secondary'} 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenEdit(machine)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(machine.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Editar Máquina' : 'Nova Máquina'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Máquina"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            select
            label="Tipo de Máquina"
            fullWidth
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="Pump">Pump (Bomba)</MenuItem>
            <MenuItem value="Fan">Fan (Ventilador)</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};