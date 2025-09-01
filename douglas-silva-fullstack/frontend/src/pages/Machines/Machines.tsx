import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Machine } from '../../services/api';
import { MachineService } from '../../services/api';

const Machines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const data = await MachineService.getAll();
      setMachines(data);
      setError(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar as máquinas. Tente novamente mais tarde.';
      setError(message);
      console.error('Error fetching machines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Tem certeza que deseja excluir esta máquina?");
    if (!confirmed) return;
    try {
      await MachineService.delete(id);
      await fetchMachines();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Falha ao excluir. Tente novamente.';
      setError(message);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Mapeia os valores do enum MachineType do backend
  const typeLabels = ["Prensa", "Torno", "Fresadora", "Cortadora", "Furadeira", "Outro"];
  
  const labelForType = (t?: number) => {
    if (typeof t !== 'number') return '—';
    // Garante que o índice está dentro dos limites do array
    return typeLabels[t] || `Tipo ${t}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Máquinas</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/machines/new')}
        >
          Adicionar Máquina
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Número de Série</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Cadastrada em</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {machines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Nenhuma máquina cadastrada
                  </TableCell>
                </TableRow>
              ) : (
                machines.map((machine) => (
                  <TableRow key={machine.id} hover>
                    <TableCell>{machine.id}</TableCell>
                    <TableCell>{machine.name}</TableCell>
                    <TableCell>{machine.serialNumber}</TableCell>
                    <TableCell>{labelForType(machine.type)}</TableCell>
                    <TableCell>{formatDate(machine.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Detalhes">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/machines/${machine.id}`)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/machines/${machine.id}/edit`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(machine.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Machines;
