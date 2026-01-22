import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMonitoringPoints } from '../features/monitoringPoints/monitoringPointSlice';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Typography, TablePagination, CircularProgress 
} from '@mui/material';

const MonitoringPointsPage = () => {
  const dispatch = useAppDispatch();
  const { items, total, loading, error } = useAppSelector((state) => state.monitoringPoints);
  
  const [page, setPage] = useState(1);
  const [sortBy] = useState('point_name');
  const [order] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    dispatch(fetchMonitoringPoints({ page, sort_by: sortBy, order }));
  }, [dispatch, page, sortBy, order]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ width: '100%', p: 2, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Inventário de Pontos (Requisito 5 itens/pág)</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Máquina</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ponto</TableCell>
              <TableCell>Sensor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((point) => (
              <TableRow key={point.point_id}>
                <TableCell>{point.machine_name}</TableCell>
                <TableCell>{point.machine_type}</TableCell>
                <TableCell>{point.point_name}</TableCell>
                <TableCell>{point.sensor_model || 'Não associado'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={total}
        rowsPerPage={5}
        page={page - 1}
        onPageChange={handleChangePage}
      />
    </Paper>
  );
};

export default MonitoringPointsPage;