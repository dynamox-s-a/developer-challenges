import React, { useState, useEffect, use } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchMachines, addNewMachine, updateMachine, deleteMachine, Machine, MachineType } from '../store/machineSlice';
import {
  Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton,
  Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Divider, useTheme,
  useMediaQuery
} from '@mui/material';

const EditIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>;
const TrashIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
const PlusIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;

export default function MachinesPage() {
  const machines = useSelector((state: RootState) => state.machines.machines);
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.machines.status);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'Bomba' as MachineType });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMachines());
    }
  }, [status, dispatch]);

  const handleOpen = (machine?: Machine) => {
    if (machine) {
      setEditingMachine(machine);
      setFormData({ name: machine.name, type: machine.type });
    } else {
      setEditingMachine(null);
      setFormData({ name: '', type: 'Bomba' });
    }
    setOpen(true);
  };

  const handleSave = () => {
    if (editingMachine) {
      dispatch(updateMachine({ ...editingMachine, ...formData }));
    } else {
      dispatch(addNewMachine({ status: 'online', ...formData }));
    }
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem a certeza que deseja excluir esta máquina?')) {
      dispatch(deleteMachine(id));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row'}, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center'},
        gap: 2,
        mb: 3 
      }}>
        <Typography variant="h5" sx={{ textAlign: { xs:'center', sm: 'left'}, fontWeight: 500}}>Gestão de Máquinas</Typography>
        <Button 
          variant="contained" 
          startIcon={<PlusIcon />} 
          onClick={() => handleOpen()}
          fullWidth={isMobile}
          size={isMobile ? "large" : "medium"}
          >
            Nova Máquina
          </Button>
      </Box>

      <Paper elevation={2}>
        <List>
          {machines.map((machine) => (
            <React.Fragment key={machine.id}>
              <ListItem 
                alignItems="flex-start"
                secondaryAction={
                  <Box>
                    <IconButton edge="end" onClick={() => handleOpen(machine)} aria-label="edit" sx={{ mr: 1}}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(machine.id)} aria-label="delete" color="error"><TrashIcon /></IconButton>
                  </Box>
                }  
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="div"   fontWeight="medium">
                      {machine.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" component="span"  color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Box component="span" sx={{ px: 1, py: 0.25, bgcolor: 'action.hover', borderRadius: 1, fontSize: '0.75rem'}}>
                        {machine.type}
                      </Box>

                      <Box component="span" sx={{ color: machine.status === 'online' ? 'succes.main' : 'error.main', fontSize: '0.875rem' }}>
                        {machine.status}
                      </Box>
                    </Typography>               
                  }
                />
              </ListItem>
              <Divider component="li"/>
            </React.Fragment>
          ))}
          {machines.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary'}}>
              <Typography sx={{ p: 2, textAlign: 'center', color: 'gray' }}>Nenhuma máquina cadastrada.</Typography>
            </Box>
            )}

        </List>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editingMachine ? 'Editar Máquina' : 'Nova Máquina'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" label="Nome" fullWidth variant="outlined"
            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2, mt: 1}}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={formData.type} label="Tipo"
              onChange={e => setFormData({ ...formData, type: e.target.value as MachineType })}
            >
              <MenuItem value="Bomba">Bomba</MenuItem>
              <MenuItem value="Ventilador">Ventilador</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}