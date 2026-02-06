import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';

import type { MonitoringPoint } from '@/types/monitoring-point';
import type { Machine } from '@/types/machine';
import type { Sensor } from '@/types/sensor';

export interface SensorListModalProps {
  open: boolean;
  onClose: () => void;
  monitoringPoint: MonitoringPoint;
  machine: Machine;
  onAddSensor: () => void;
  onDeleteSensor: (sensor: Sensor) => void;
}

export function SensorListModal({
  open,
  onClose,
  monitoringPoint,
  machine,
  onAddSensor,
  onDeleteSensor,
}: SensorListModalProps): React.JSX.Element {
  const sensors = monitoringPoint.sensors || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">Sensors - {monitoringPoint.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              Machine: {machine.name} ({machine.type})
            </Typography>
          </Box>
          <Button
            startIcon={<PlusIcon />}
            variant="contained"
            onClick={onAddSensor}
          >
            Add Sensor
          </Button>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {sensors.length === 0 ? (
          <Alert severity="info">No sensors assigned to this monitoring point</Alert>
        ) : (
          <List>
            {sensors.map((sensor) => (
              <ListItem
                key={sensor.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => onDeleteSensor(sensor)}
                  >
                    <TrashIcon />
                  </IconButton>
                }
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" fontWeight={500}>
                        {sensor.model}
                      </Typography>
                      <Chip label={`ID: ${sensor.id}`} size="small" />
                    </Box>
                  }
                  secondary={`Monitoring Point: ${monitoringPoint.name}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
