import { useEffect, useMemo, useState } from 'react';
import { Typography, Paper, Box, Table, TableBody, TableCell, TableHead, TableRow, Chip, Stack } from '@mui/material';
import { MachineService, type Machine } from '../../services/api';

// Mapeia os valores do enum MachineType do backend
const typeLabels = ["Prensa", "Torno", "Fresadora", "Cortadora", "Furadeira", "Outro"];

const labelForType = (t?: number) => {
  if (typeof t !== 'number') return '—';
  // Garante que o índice está dentro dos limites do array
  return typeLabels[t] || `Tipo ${t}`;
};

function StatusDots({ value }: { value: number }) {
  // Placeholder simples: 5 bolinhas coloridas com base no valor 0..4
  const colors = ['#d32f2f', '#f57c00', '#fbc02d', '#7cb342', '#388e3c'];
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Box key={i} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: i <= value ? colors[value] : '#e0e0e0' }} />
      ))}
    </Stack>
  );
}

const Dashboard = () => {
  const [machines, setMachines] = useState<Machine[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await MachineService.getAll();
        setMachines(data);
      } catch (e) {
        console.error(e);
        setMachines([]);
      }
    })();
  }, []);

  // Placeholder: gera um valor 0..4 estável por máquina a partir do id
  const statusById = useMemo(() => {
    const map = new Map<number, number>();
    machines.forEach((m) => map.set(m.id, m.id % 5));
    return map;
  }, [machines]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 0 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Máquinas</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Número de Série</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Criada em</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {machines.map((m) => (
              <TableRow key={m.id} hover>
                <TableCell>{m.id}</TableCell>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.serialNumber}</TableCell>
                <TableCell>
                  <Chip size="small" label={labelForType(m.type)} />
                </TableCell>
                <TableCell>
                  <StatusDots value={statusById.get(m.id) ?? 2} />
                </TableCell>
                <TableCell>{new Date(m.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {machines.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">Nenhuma máquina cadastrada.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Dashboard;
