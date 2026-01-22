import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMonitoringPoints } from '../features/monitoringPoints/monitoringPointSlice';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, TablePagination, IconButton, Tooltip, Typography, CircularProgress 
} from '@mui/material';
import { SensorModal } from './SensorModal';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';

interface MonitoringPointsPageProps {
  sortBy?: string;
  order?: 'asc' | 'desc';
}

const MonitoringPointsPage = ({ sortBy = 'point_name', order = 'asc' }: MonitoringPointsPageProps) => {
  const dispatch = useAppDispatch();
  const { items, total, loading, error } = useAppSelector((state) => state.monitoringPoints);
  
  const [page, setPage] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchMonitoringPoints({ page, sort_by: sortBy, order }));
  }, [dispatch, page, sortBy, order]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ width: '100%', p: 2, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Inventário de Pontos</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Máquina</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ponto</TableCell>
              <TableCell>Sensor</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((point) => (
              <TableRow key={point.point_id}>
                <TableCell>{point.machine_name}</TableCell>
                <TableCell>{point.machine_type}</TableCell>
                <TableCell>{point.point_name}</TableCell>
                <TableCell>{point.sensor_model || 'Não associado'}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Associar Sensor">
                    <IconButton 
                      size="small" 
                      onClick={() => setSelectedPoint(point)}
                      sx={{
                        color: '#7a2f54',
                        '&:hover': {
                          bgcolor: 'rgba(122, 47, 84, 0.08)'
                        }
                      }}
                    >
                      <SettingsInputComponentIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
              </TableCell>
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
      <SensorModal 
        open={Boolean(selectedPoint)} 
        onClose={() => setSelectedPoint(null)} 
        point={selectedPoint} 
      />
    </Paper>
  );
};

export default MonitoringPointsPage;