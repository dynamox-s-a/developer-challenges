import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import { useGetSensorsQuery, useDeleteSensorMutation } from '@/store/sensors/sensors.api';
import { SensorModel } from '@/types/sensor';

export default function SensorsPage(): React.JSX.Element {
  const { data: sensors, isLoading } = useGetSensorsQuery();
  const [deleteSensor] = useDeleteSensorMutation();

  const [filterModel, setFilterModel] = React.useState<SensorModel | 'all'>('all');

  const filteredSensors = React.useMemo(() => {
    if (!sensors) return [];
    if (filterModel === 'all') return sensors;
    return sensors.filter(sensor => sensor.model === filterModel);
  }, [sensors, filterModel]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this sensor?')) {
      try {
        await deleteSensor(id).unwrap();
      } catch (err) {

      }
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;

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
                      <IconButton onClick={() => handleDelete(sensor.id)} color="error">
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
    </Stack>
  );
}
