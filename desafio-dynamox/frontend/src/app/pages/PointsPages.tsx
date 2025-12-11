import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import {
  addPoint,
  updatePoint,
  deletePoint,
  Point,
  SensorModel,
} from '../store/pointsSlice';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  TablePagination,
  Chip,
  TableSortLabel,
} from '@mui/material';

const EditIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);
const TrashIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const PlusIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default function PointsPage() {
  const points = useSelector((state: RootState) => state.points.points);
  const machines = useSelector((state: RootState) => state.machines.machines);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<Point | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    machineId: '',
    sensorModel: 'HF+' as SensorModel,
  });
  const [error, setError] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedPoints = useMemo(() => {
    return [...points].sort((a, b) => {
      let valueA: string | number = '';
      let valueB: string | number = '';

      if (orderBy === 'machine') {
        // Busca o nome da máquina para ordenar
        valueA = machines.find(m => m.id === a.machineId)?.name || '';
        valueB = machines.find(m => m.id === b.machineId)?.name || '';
      } else {
        valueA = a[orderBy as keyof Point] as string | number || '';
        valueB = b[orderBy as keyof Point] as string | number || '';
      }
      // Ordenação para strings
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return order === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }

      // Ordenação para números
      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [points, machines, order, orderBy]);

  const handleOpen = (point?: Point) => {
    setError('');
    if (point) {
      setEditingPoint(point);
      setFormData({
        name: point.name,
        machineId: point.machineId,
        sensorModel: point.sensorModel,
      });
    } else {
      setEditingPoint(null);
      setFormData({
        name: '',
        machineId: machines[0]?.id || '',
        sensorModel: 'HF+',
      });
    }
    setOpen(true);
  };

  const handleSave = () => {
    const machine = machines.find((m) => m.id === formData.machineId);
    if (!machine) {
      setError('Selecione uma máquina válida.');
      return;
    }

    if (
      machine.type === 'Bomba' &&
      (formData.sensorModel === 'TcAg' || formData.sensorModel === 'TcAs')
    ) {
      setError(
        `Erro: Máquinas do tipo 'Bomba' não aceitam sensores ${formData.sensorModel}.`
      );
      return;
    }

    if (editingPoint) {
      dispatch(updatePoint({ ...editingPoint, ...formData }));
    } else {
      dispatch(
        addPoint({ id: `p${Date.now()}`, status: 'active', ...formData })
      );
    }
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir este ponto?')) dispatch(deletePoint(id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Pontos de Monitoramento</Typography>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={() => handleOpen()}
        >
          Novo Ponto
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === 'name' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                  >
                    Nome
                  </TableSortLabel>
                </TableCell>

                <TableCell sortDirection={orderBy === 'sensorModel' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'sensorModel'}
                    direction={orderBy === 'sensorModel' ? order : 'asc'}
                    onClick={() => handleRequestSort('sensorModel')}
                  >
                    Sensor
                  </TableSortLabel>
                </TableCell>

                <TableCell sortDirection={orderBy === 'machine' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'machine'}
                    direction={orderBy === 'machine' ? order : 'asc'}
                    onClick={() => handleRequestSort('machine')}
                  >
                    Máquina
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPoints
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((point) => {
                  const machine = machines.find(
                    (m) => m.id === point.machineId
                  );
                  return (
                    <TableRow key={point.id} hover>
                      <TableCell>{point.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={point.sensorModel}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {machine?.name || '---'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {machine?.type}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpen(point)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(point.id)}
                        >
                          <TrashIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {points.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Nenhum ponto registado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={points.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, n) => setPage(n)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {editingPoint ? 'Editar Ponto' : 'Novo Ponto'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Máquina</InputLabel>
            <Select
              value={formData.machineId}
              label="Máquina"
              onChange={(e) => {
                setFormData({ ...formData, machineId: e.target.value });
                setError('');
              }}
            >
              {machines.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name} ({m.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Modelo Sensor</InputLabel>
            <Select
              value={formData.sensorModel}
              label="Modelo Sensor"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  sensorModel: e.target.value as SensorModel,
                });
                setError('');
              }}
            >
              <MenuItem value="HF+">HF+</MenuItem>
              <MenuItem value="TcAg">TcAg</MenuItem>
              <MenuItem value="TcAs">TcAs</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
