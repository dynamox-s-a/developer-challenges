import { Alert, AlertColor, Snackbar } from '@mui/material';

const Toast = ({
  open,
  onClose,
  message,
  severity,
}: {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: AlertColor;
}) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={3000}
      transitionDuration={300}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
