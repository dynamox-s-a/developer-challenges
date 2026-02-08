import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import { Trash as TrashIcon } from '@phosphor-icons/react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { useGetSensorsQuery, useDeleteSensorMutation } from '@/store/sensors/sensors.api';
import { SensorModel } from '@/types/sensor';
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog';

export default function SensorsPage(): React.JSX.Element {
  const { data: sensors, isLoading, error } = useGetSensorsQuery();
  const [deleteSensor] = useDeleteSensorMutation();

  const [filterModel, setFilterModel] = React.useState<SensorModel | 'all'>('all');
  const [selectedSensorId, setSelectedSensorId] = React.useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

  const filteredSensors = React.useMemo(() => {
    if (!sensors) return [];
    if (filterModel === 'all') return sensors;
    return sensors.filter(sensor => sensor.model === filterModel);
  }, [sensors, filterModel]);

  const handleDeleteClick = (id: number) => {
    setSelectedSensorId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSensorId) {
      try {
        await deleteSensor(selectedSensorId).unwrap();
        setSnackbarMessage('Sensor deleted successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (err) {
        setSnackbarMessage('Failed to delete sensor');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
    setIsDeleteDialogOpen(false);
    setSelectedSensorId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading sensors</Typography>;

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4">Sensors</Typography>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <TextField
          select
          label="Filter by Model"
          value={filterModel}
          onChange={(e) => setFilterModel(e.target.value as SensorModel | 'all')}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">All Models</MenuItem>
          <MenuItem value={SensorModel.TcAg}>TcAg</MenuItem>
          <MenuItem value={SensorModel.TcAs}>TcAs</MenuItem>
          <MenuItem value={SensorModel.HF_PLUS}>HF+</MenuItem>
        </TextField>
      </Stack>

      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Monitoring Point ID</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSensors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="text.secondary">No sensors found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSensors.map((sensor) => (
                  <TableRow hover key={sensor.id}>
                    <TableCell>{sensor.id}</TableCell>
                    <TableCell>{sensor.model}</TableCell>
                    <TableCell>{sensor.monitoringPointId}</TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="Delete" onClick={() => handleDeleteClick(sensor.id)} color="error">
                        <TrashIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Card>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Sensor"
        message="Are you sure you want to delete this sensor?"
        confirmText="Delete"
        severity="error"
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
