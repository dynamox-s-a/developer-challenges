import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';

import type { MonitoringPoint } from '@/types/monitoring-point';

export interface SensorInfoModalProps {
  open: boolean;
  onClose: () => void;
  monitoringPoint: MonitoringPoint | null;
}

export function SensorInfoModal({ open, onClose, monitoringPoint }: SensorInfoModalProps): React.JSX.Element {
  if (!monitoringPoint) return <></>;

  const sensor = monitoringPoint.sensors?.[0]; // Assuming one sensor per monitoring point

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Sensor Information - {monitoringPoint.name}</DialogTitle>
      <Divider />
      <DialogContent>
        {sensor ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Sensor Model
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {sensor.model}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Sensor ID
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {sensor.id}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Monitoring Point
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {monitoringPoint.name}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Alert severity="info">No sensor assigned to this monitoring point</Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
