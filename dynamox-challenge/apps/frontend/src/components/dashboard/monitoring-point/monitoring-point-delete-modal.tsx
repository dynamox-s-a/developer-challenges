import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { MonitoringPoint } from '@/types/monitoring-point';

interface MonitoringPointDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  monitoringPoint: MonitoringPoint | null;
  isLoading?: boolean;
}

export function MonitoringPointDeleteModal({
  open,
  onClose,
  onConfirm,
  monitoringPoint,
  isLoading,
}: MonitoringPointDeleteModalProps): React.JSX.Element | null {
  if (!monitoringPoint) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Monitoring Point</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete monitoring point <strong>{monitoringPoint.name}</strong>? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={isLoading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
