import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addMonitoringPointAsync } from '../../store/Slices/machineSlice';
import {
  Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel,
  Stack, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, CircularProgress, TableSortLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

type SortField = 'machineName' | 'machineType' | 'monitoringPointName' | 'sensorModel';

const Sensors: React.FC = () => {
  const [monitoringPointName, setMonitoringPointName] = useState('');
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [sensorModel, setSensorModel] = useState<'TcAg' | 'TcAs' | 'HF+'>('TcAg');
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<SortField>('machineName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const rowsPerPage = 5;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { machines, monitoringPoints, loading, error } = useAppSelector(state => state.machines);

  // Dados da tabela com memoização
  const tableData = useMemo(() => 
    monitoringPoints.map(mp => {
      const machine = machines.find(m => m.id === mp.machineId);
      return {
        id: mp.id,
        machineName: machine?.name || 'N/A',
        machineType: machine?.type || 'N/A',
        monitoringPointName: mp.name,
        sensorModel: mp.sensorModel || 'Não associado'
      };
    }), [monitoringPoints, machines]
  );

  // Ordenação e paginação
  const sortedData = useMemo(() => 
    [...tableData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }), [tableData, sortField, sortOrder]
  );

  const paginatedData = sortedData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleAddMonitoringPoint = () => {
    if (!monitoringPointName.trim() || !selectedMachineId) return;
    
    const selectedMachine = machines.find(m => m.id === selectedMachineId);
    if (selectedMachine?.type === 'Pump' && ['TcAg', 'TcAs'].includes(sensorModel)) {
      alert('Erro: Sensores TcAg e TcAs não são permitidos em Bombas (Pumps)');
      return;
    }

    dispatch(addMonitoringPointAsync({
      machineId: selectedMachineId,
      name: monitoringPointName.trim(),
      sensorModel
    }));

    // Reset form
    setMonitoringPointName('');
    setSelectedMachineId('');
    setSensorModel('TcAg');
  };

  const handleSort = (field: SortField) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>
        Voltar para Dashboard
      </Button>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="h4" gutterBottom>
        Gerenciamento de Monitoring Points e Sensores
        {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Regra de negócio:</strong> Sensores TcAg e TcAs não são permitidos em Bombas (Pumps)
      </Alert>

      {/* FORMULÁRIO */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Criar Novo Monitoring Point</Typography>

        <Stack spacing={2} sx={{ maxWidth: 500 }}>
          <FormControl fullWidth>
            <InputLabel>Máquina</InputLabel>
            <Select
              value={selectedMachineId}
              label="Máquina"
              onChange={(e) => setSelectedMachineId(e.target.value)}
              disabled={loading}
            >
              {machines.map(machine => (
                <MenuItem key={machine.id} value={machine.id}>
                  {machine.name} ({machine.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Nome do Monitoring Point"
            value={monitoringPointName}
            onChange={(e) => setMonitoringPointName(e.target.value)}
            fullWidth
            disabled={loading}
          />

          <FormControl fullWidth>
            <InputLabel>Modelo do Sensor</InputLabel>
            <Select
              value={sensorModel}
              label="Modelo do Sensor"
              onChange={(e) => setSensorModel(e.target.value as 'TcAg' | 'TcAs' | 'HF+')}
              disabled={loading}
            >
              <MenuItem value="TcAg">TcAg</MenuItem>
              <MenuItem value="TcAs">TcAs</MenuItem>
              <MenuItem value="HF+">HF+</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleAddMonitoringPoint}
            disabled={!monitoringPointName.trim() || !selectedMachineId || loading}
          >
            Criar Monitoring Point com Sensor
          </Button>
        </Stack>
      </Paper>

      {/* TABELA */}
      <Paper>
        <Typography variant="h6" sx={{ p: 2 }}>
          Monitoring Points Cadastrados ({monitoringPoints.length})
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'machineName'}
                    direction={sortField === 'machineName' ? sortOrder : 'asc'}
                    onClick={() => handleSort('machineName')}
                  >
                    <strong>Máquina</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'machineType'}
                    direction={sortField === 'machineType' ? sortOrder : 'asc'}
                    onClick={() => handleSort('machineType')}
                  >
                    <strong>Tipo</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'monitoringPointName'}
                    direction={sortField === 'monitoringPointName' ? sortOrder : 'asc'}
                    onClick={() => handleSort('monitoringPointName')}
                  >
                    <strong>Monitoring Point</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'sensorModel'}
                    direction={sortField === 'sensorModel' ? sortOrder : 'asc'}
                    onClick={() => handleSort('sensorModel')}
                  >
                    <strong>Sensor</strong>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.machineName}</TableCell>
                  <TableCell>{row.machineType}</TableCell>
                  <TableCell>{row.monitoringPointName}</TableCell>
                  <TableCell>
                    <Typography
                      color={row.sensorModel === 'Não associado' ? 'error' : 'primary'}
                    >
                      {row.sensorModel}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}

              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                      Nenhum monitoring point cadastrado
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
        />
      </Paper>
    </Box>
  );
};

export default Sensors;