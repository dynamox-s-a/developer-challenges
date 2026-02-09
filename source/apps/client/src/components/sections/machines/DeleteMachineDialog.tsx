import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store/store';
import { deleteMachine, Machine } from 'store/slices/machinesSlice';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface DeleteMachineDialogProps {
  open: boolean;
  onClose: () => void;
  machine: Machine | null;
}

const DeleteMachineDialog = ({ open, onClose, machine }: DeleteMachineDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!machine) return null;

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await dispatch(deleteMachine(machine.id)).unwrap();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to remove machine. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ color: 'error.main', fontWeight: 600 }}>Remove Machine</DialogTitle>
      <DialogContent>
        <Stack direction='column' spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <DialogContentText>
            Are you sure you want to remove <strong>{machine.name}</strong>?
          </DialogContentText>

          <Alert severity="warning">
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Important Warning:
            </Typography>
            <Typography variant="body2">
              This action will also permanently delete:
            </Typography>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>
                <Typography variant="body2">Associated Monitoring Points</Typography>
              </li>
              <li>
                <Typography variant="body2">Connected Sensors</Typography>
              </li>
              <li>
                <Typography variant="body2">Historical Telemetry Data</Typography>
              </li>
            </ul>
          </Alert>
          
          <Typography variant="caption" color="error.main">
            This operation cannot be undone.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? 'Removing...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMachineDialog;
