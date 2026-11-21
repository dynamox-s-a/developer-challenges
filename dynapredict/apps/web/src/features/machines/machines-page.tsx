import { useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMachines, type Machine } from './machines.slice';

// "2026-11-21T10:00:00.000Z" → "21/11/2026" (no fuso horário do navegador)
function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('pt-BR');
}

function MachinesTable({ machines }: { machines: Machine[] }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Criada em</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {machines.map((machine) => (
            <TableRow key={machine.id}>
              <TableCell>{machine.name}</TableCell>
              <TableCell>{machine.type}</TableCell>
              <TableCell>{formatDate(machine.createdAt)}</TableCell>
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

  // Busca a lista quando a página abre
  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Máquinas</Typography>

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
        <MachinesTable machines={items} />
      )}
    </Stack>
  );
}
