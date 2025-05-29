
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

interface Sensor {
  id: number;
  name?: string;
  sensorType: string;
}

interface Machine {
  id: number;
  name: string;
  typeOfMachine: string;
  statusMachine: string;
  pointmonitoring1?: Sensor;
  pointmonitoring2?: Sensor;
  createdAt?: string;
  updatedAt?: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApiResponse {
  message: string;
  data: {
    machines: Machine[];
    pagination: PaginationData;
  };
}

export default function AboutPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchMachines = async (currentPage: number, limit: number) => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        `http://localhost:3000/machine/paginated?page=${currentPage + 1}&limit=${limit}`
      );
      
      setMachines(response.data.data.machines);
      setPagination(response.data.data.pagination);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar as máquinas');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };
  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'RUNNING':
        return 'success';
      case 'ALERTING':
        return 'warning';
      case 'STOPPED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string): 'primary' | 'secondary' | 'default' => {
    switch (type) {
      case 'PUMP':
        return 'primary';
      case 'FAN':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2.5 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2.5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Lista de Máquinas
      </Typography>
      
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabela de máquinas">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Tipo</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Sensor 1</strong></TableCell>
              <TableCell><strong>Sensor 2</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {machines.map((machine) => (
              <TableRow
                key={machine.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#f9f9f9' } }}
              >
                <TableCell component="th" scope="row">
                  {machine.id}
                </TableCell>
                <TableCell>{machine.name}</TableCell>                <TableCell>
                  <Chip 
                    label={machine.typeOfMachine} 
                    color={getTypeColor(machine.typeOfMachine)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={machine.statusMachine} 
                    color={getStatusColor(machine.statusMachine)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {machine.pointmonitoring1 ? (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {machine.pointmonitoring1.name || 'Sem nome'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {machine.pointmonitoring1.sensorType}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">-</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {machine.pointmonitoring2 ? (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {machine.pointmonitoring2.name || 'Sem nome'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {machine.pointmonitoring2.sensorType}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">-</Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Visualizar">
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton size="small" color="secondary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {pagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pagination.totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
          />
        )}
      </TableContainer>
      
      {pagination && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Total: {pagination.totalItems} máquinas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Página {pagination.currentPage} de {pagination.totalPages}
          </Typography>
        </Box>
      )}
    </Box>
  );
}