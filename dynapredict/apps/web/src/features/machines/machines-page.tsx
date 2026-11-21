import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { MachineFormDialog } from './machine-form-dialog';
import { fetchMachines, type Machine } from './machines.slice';

// "2026-11-21T10:00:00.000Z" → "21/11/2026" (no fuso horário do navegador)
function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('pt-BR');
}

type MachinesTableProps = {
  machines: Machine[];
  onEdit: (machine: Machine) => void;
};

function MachinesTable({ machines, onEdit }: MachinesTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Criada em</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {machines.map((machine) => (
            <TableRow key={machine.id}>
              <TableCell>{machine.name}</TableCell>
              <TableCell>{machine.type}</TableCell>
              <TableCell>{formatDate(machine.createdAt)}</TableCell>
              <TableCell align="right">
                <IconButton
                  aria-label={`Editar ${machine.name}`}
                  onClick={() => onEdit(machine)}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function MachinesPage() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.machines);

  // O formulário está aberto? E qual máquina ele edita (null = nova)
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Machine | null>(null);
  // Mensagem de sucesso que aparece no rodapé (null = nenhuma)
  const [notice, setNotice] = useState<string | null>(null);

  // Busca a lista quando a página abre
  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  function openForm(machine: Machine | null) {
    setEditing(machine);
    setFormOpen(true);
  }

  function handleSaved(message: string) {
    setFormOpen(false);
    setNotice(message);
  }

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4">Máquinas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openForm(null)}
        >
          Nova máquina
        </Button>
      </Stack>

      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress aria-label="Carregando máquinas" />
        </Box>
      )}

      {status === 'failed' && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={() => dispatch(fetchMachines())}>
              Tentar de novo
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {status === 'succeeded' && items.length === 0 && (
        <Typography color="text.secondary">
          Nenhuma máquina cadastrada ainda.
        </Typography>
      )}

      {status === 'succeeded' && items.length > 0 && (
        <MachinesTable machines={items} onEdit={openForm} />
      )}

      {formOpen && (
        <MachineFormDialog
          machine={editing}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}

      <Snackbar
        open={notice !== null}
        autoHideDuration={4000}
        onClose={() => setNotice(null)}
        message={notice}
      />
    </Stack>
  );
}
