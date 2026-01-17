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
  // uso dispatch para disparar ações no Redux
  const dispatch = useDispatch<AppDispatch>();
  
  // extraio a lista de máquinas, status de carregamento e possíveis erros do estado global
  const { list, status, error } = useSelector((state: RootState) => state.machines) as { list: Machine[]; status: string; error: string | null };
  
  // gerencio o estado do diálogo de criação/edição
  const [open, setOpen] = useState(false);
  
  // uso isso para saber se estou editando (tem um ID) ou criando uma nova máquina
  const [editingId, setEditingId] = useState<string | null>(null); 

  // armazeno os dados do formulário temporariamente
  const [name, setName] = useState('');
  const [type, setType] = useState('Pump');

  // carrego as máquinas quando o componente monta (apenas uma vez)
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMachines());
    }
  }, [status, dispatch]);

  // abro o diálogo para criar uma nova máquina com campos vazios
  const handleOpenCreate = () => {
    setEditingId(null); 
    setName('');
    setType('Pump');
    setOpen(true);
  };

  // abro o diálogo para editar uma máquina existente preenchendo os dados dela
  const handleOpenEdit = (machine: Machine) => {
    setEditingId(machine.id); 
    setName(machine.name);    
    setType(machine.type);
    setOpen(true);
  };

  // deleto uma máquina após confirmação do usuário
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta máquina?')) {
      dispatch(deleteMachine(id));
    }
  };

  // valido e salvo a máquina (novo ou atualizado)
  const handleSave = () => {
    if (!name.trim()) return alert("Nome obrigatório");

    if (editingId) {
      // atualizo uma máquina existente
      dispatch(updateMachine({ id: String(editingId), name, type: type as 'Pump' | 'Fan' }));
    } else {
      // crio uma nova máquina
      dispatch(addMachine({ name, type: type as 'Pump' | 'Fan' }));
    }
    setOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* monto o cabeçalho com título e botão de criar nova máquina */}
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

      {/* exibo diferentes estados: carregamento, erro ou sucesso */}
      {status === 'loading' && <CircularProgress />}
      {status === 'failed' && <Typography color="error">Erro: {error}</Typography>}

      {/* renderizo a tabela com as máquinas quando os dados são carregados com sucesso */}
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
              {/* itero sobre as máquinas e crio uma linha para cada uma */}
              {list.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>{machine.id}</TableCell>
                  <TableCell>{machine.name}</TableCell>
                  <TableCell>
                    {/* exibo o tipo com cores diferentes dependendo do tipo */}
                    <Chip 
                      label={machine.type} 
                      color={machine.type === 'Pump' ? 'primary' : 'secondary'} 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    {/* oferço botões para editar e deletar cada máquina */}
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

      {/* monto o diálogo modal para criar ou editar máquinas */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Editar Máquina' : 'Nova Máquina'}</DialogTitle>
        <DialogContent>
          {/* uso um campo de texto para o nome da máquina */}
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
          {/* uso um select para escolher o tipo de máquina */}
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
          {/* ofereço botões para cancelar ou salvar a máquina */}
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};