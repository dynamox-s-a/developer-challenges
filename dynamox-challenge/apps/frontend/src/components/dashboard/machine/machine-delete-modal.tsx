import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import { ModalLayout } from '@/components/core/modal-layout';

export interface MachineDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  machineName: string;
}

export function MachineDeleteModal({ open, onClose, onConfirm, machineName }: MachineDeleteModalProps): React.JSX.Element {
  return (
    <ModalLayout title="Delete Machine" open={open} onClose={onClose} maxWidth="xs">
      <Typography variant="body1">
        Are you sure you want to delete <strong>{machineName}</strong>? This action cannot be undone.
      </Typography>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </ModalLayout>
  );
}
